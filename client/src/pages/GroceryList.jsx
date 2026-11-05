import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import GroceryItem from '../components/GroceryItem';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import {
  ShoppingCart,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react';

const UNITS = ['kg', 'g', 'L', 'ml', 'pieces', 'packets', 'cups'];
const CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Dairy',
  'Meat and Seafood',
  'Grains and Cereals',
  'Bakery',
  'Spices and Condiments',
  'Beverages',
  'Other'
];

const GroceryList = () => {
  const { showToast } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    unit: 'pieces',
    category: 'Other'
  });

  const fetchGroceryItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/grocery');
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      showToast('Failed to load grocery items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroceryItems();
  }, []);

  const pendingItems = items.filter((i) => !i.purchased);
  const purchasedItems = items.filter((i) => i.purchased);

  // Open add modal
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      quantity: 1,
      unit: 'pieces',
      category: 'Other'
    });
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category || 'Other'
    });
    setIsModalOpen(true);
  };

  // Form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter an item name', 'error');
      return;
    }

    setFormSubmitting(true);
    try {
      if (editingItem) {
        const res = await api.put(`/grocery/${editingItem._id}`, formData);
        if (res.data.success) {
          showToast(`Updated ${res.data.data.name}`, 'success');
          setIsModalOpen(false);
          fetchGroceryItems();
        }
      } else {
        const res = await api.post('/grocery', formData);
        if (res.data.success) {
          showToast(`Added ${res.data.data.name} to grocery list`, 'success');
          setIsModalOpen(false);
          fetchGroceryItems();
        }
      }
    } catch (err) {
      showToast('Failed to save grocery item', 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Purchase & transfer to pantry
  const handlePurchaseItem = async (id, expiryDate) => {
    try {
      const res = await api.patch(`/grocery/${id}/purchase`, { expiryDate });
      if (res.data.success) {
        showToast(res.data.message || 'Purchased and added to pantry!', 'success');
        fetchGroceryItems();
      }
    } catch (err) {
      showToast('Failed to purchase item', 'error');
    }
  };

  // Delete item
  const handleDeleteItem = async (id, name) => {
    try {
      const res = await api.delete(`/grocery/${id}`);
      if (res.data.success) {
        showToast(`Removed ${name}`, 'info');
        setItems((prev) => prev.filter((i) => i._id !== id));
      }
    } catch (err) {
      showToast('Failed to delete item', 'error');
    }
  };

  // Clear all purchased items
  const handleClearPurchased = async () => {
    if (purchasedItems.length === 0) return;
    if (!window.confirm('Clear all purchased items from this list?')) return;

    try {
      const res = await api.delete('/grocery/clear-purchased');
      if (res.data.success) {
        showToast(res.data.message || 'Cleared purchased items', 'success');
        setItems((prev) => prev.filter((i) => !i.purchased));
      }
    } catch (err) {
      showToast('Failed to clear purchased items', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar pendingGroceryCount={pendingItems.length} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-dark tracking-tight">
                Smart Grocery List
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Purchased goods automatically transfer straight into your pantry inventory.
              </p>
            </div>

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-semibold shadow-soft transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>

          {/* Pending Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-beige/60">
              <h2 className="text-base sm:text-lg font-bold text-forest-dark flex items-center gap-2">
                <Clock className="w-4 h-4 text-forest" />
                <span>To Buy ({pendingItems.length})</span>
              </h2>
            </div>

            {loading ? (
              <Loading message="Loading grocery list..." />
            ) : pendingItems.length === 0 ? (
              <EmptyState
                icon={ShoppingCart}
                title="Your shopping list is clear"
                description="Add items manually or click 'Add Missing Ingredients' inside any recipe to auto-populate this list."
                actionText="Add New Item"
                onAction={handleOpenAdd}
              />
            ) : (
              <div className="space-y-3">
                {pendingItems.map((item) => (
                  <GroceryItem
                    key={item._id}
                    item={item}
                    onPurchase={handlePurchaseItem}
                    onEdit={handleOpenEdit}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Purchased Section */}
          {purchasedItems.length > 0 && (
            <section className="space-y-4 pt-4">
              <div className="flex items-center justify-between pb-2 border-b border-beige/60">
                <h2 className="text-base sm:text-lg font-bold text-stone-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Purchased & Transferred ({purchasedItems.length})</span>
                </h2>

                <button
                  onClick={handleClearPurchased}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Purchased</span>
                </button>
              </div>

              <div className="space-y-2">
                {purchasedItems.map((item) => (
                  <GroceryItem
                    key={item._id}
                    item={item}
                    onPurchase={handlePurchaseItem}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </div>
            </section>
          )}

        </main>
      </div>

      {/* Add / Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-elevated border border-beige/80 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-beige/60 mb-4">
              <h3 className="text-xl font-extrabold text-forest-dark">
                {editingItem ? 'Edit Grocery Item' : 'Add to Grocery List'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tomatoes, Olive Oil, Bread"
                  className="w-full px-3.5 py-2.5 bg-cream/50 border border-beige/80 rounded-xl text-sm focus:outline-hidden focus:border-forest text-stone-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-cream/50 border border-beige/80 rounded-xl text-sm focus:outline-hidden focus:border-forest text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Unit *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-cream/50 border border-beige/80 rounded-xl text-sm focus:outline-hidden focus:border-forest text-stone-800"
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-cream/50 border border-beige/80 rounded-xl text-sm focus:outline-hidden focus:border-forest text-stone-800"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-beige/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2.5 text-xs font-bold bg-forest hover:bg-forest-hover text-white rounded-xl shadow-soft transition disabled:opacity-50"
                >
                  {formSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Add to List'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GroceryList;

