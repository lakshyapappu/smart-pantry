import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import PantryCard from '../components/PantryCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import {
  Refrigerator,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  X,
  Calendar,
  AlertCircle
} from 'lucide-react';

const CATEGORIES = [
  'All',
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

const UNITS = ['kg', 'g', 'L', 'ml', 'pieces', 'packets', 'cups'];

const Pantry = () => {
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('expiry'); // 'expiry' | 'name' | 'quantity'
  const [statusFilter, setStatusFilter] = useState(searchParams.get('filter') === 'expiring' ? 'expiring' : 'all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    quantity: 1,
    unit: 'pieces',
    purchaseDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    notes: ''
  });

  // Fetch items from backend
  const fetchPantryItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/pantry');
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      showToast('Failed to load pantry items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPantryItems();
  }, []);

  // Update URL params when filters change
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
  };

  // Open modal for add
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Vegetables',
      quantity: 1,
      unit: 'pieces',
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      purchaseDate: item.purchaseDate ? new Date(item.purchaseDate).toISOString().split('T')[0] : '',
      expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
      notes: item.notes || ''
    });
    setIsModalOpen(true);
  };

  // Handle category change in form
  const handleFormCategoryChange = (newCat) => {
    setFormData((prev) => ({
      ...prev,
      category: newCat
    }));
  };

  // Submit add or edit
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('Please provide an item name', 'error');
      return;
    }

    if (parseFloat(formData.quantity) < 0) {
      showToast('Quantity cannot be negative', 'error');
      return;
    }

    setFormSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        purchaseDate: formData.purchaseDate || undefined,
        expiryDate: formData.expiryDate ? formData.expiryDate : null,
        notes: formData.notes
      };

      if (editingItem) {
        const res = await api.put(`/pantry/${editingItem._id}`, payload);
        if (res.data.success) {
          showToast(`Updated ${res.data.data.name}`, 'success');
          setIsModalOpen(false);
          fetchPantryItems();
        }
      } else {
        const res = await api.post('/pantry', payload);
        if (res.data.success) {
          showToast(`Added ${res.data.data.name} to pantry`, 'success');
          setIsModalOpen(false);
          fetchPantryItems();
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save grocery item';
      showToast(msg, 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Inline quantity adjustment
  const handleUpdateQuantity = async (id, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        // If reduced to 0, ask user or auto remove
        await api.delete(`/pantry/${id}`);
        showToast('Item quantity reached 0 and was removed from pantry', 'info');
        setItems((prev) => prev.filter((i) => i._id !== id));
      } else {
        const res = await api.put(`/pantry/${id}`, { quantity: newQuantity });
        if (res.data.success) {
          setItems((prev) =>
            prev.map((i) => (i._id === id ? res.data.data : i))
          );
        }
      }
    } catch (err) {
      showToast('Failed to update quantity', 'error');
    }
  };

  // Delete item
  const handleDeleteItem = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from your pantry?`)) {
      return;
    }

    try {
      const res = await api.delete(`/pantry/${id}`);
      if (res.data.success) {
        showToast(`Removed ${name}`, 'info');
        setItems((prev) => prev.filter((i) => i._id !== id));
      }
    } catch (err) {
      showToast('Failed to delete pantry item', 'error');
    }
  };

  // Filter & Sort Items in memory for instant feedback
  const filteredItems = items.filter((item) => {
    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchName && !matchCat) return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }

    // Status filter
    if (statusFilter === 'expiring') {
      return item.expiryStatus?.isExpiringSoon;
    } else if (statusFilter === 'fresh') {
      return !item.expiryStatus?.isExpiringSoon;
    }

    return true;
  });

  // Sort items
  filteredItems.sort((a, b) => {
    if (sort === 'expiry') {
      if (!a.expiryDate && !b.expiryDate) return 0;
      if (!a.expiryDate) return 1;
      if (!b.expiryDate) return -1;
      return new Date(a.expiryDate) - new Date(b.expiryDate);
    } else if (sort === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sort === 'quantity') {
      return b.quantity - a.quantity;
    }
    return 0;
  });

  const expiringCount = items.filter((i) => i.expiryStatus?.isExpiringSoon).length;

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar expiringCount={expiringCount} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-dark tracking-tight">
                Pantry Inventory Tracker
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Monitor groceries, dynamic expiry alerts, and quantities.
              </p>
            </div>

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-semibold shadow-soft transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Grocery</span>
            </button>
          </div>

          {/* Search, Filter, Sort Controls */}
          <div className="bg-white rounded-2xl p-4 border border-beige/80 shadow-soft space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Search bar */}
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search grocery item by name..."
                  className="w-full pl-10 pr-4 py-2.5 bg-cream/50 border border-beige/80 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-forest text-stone-800"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status filter: All vs Expiring Soon */}
              <div className="sm:col-span-3 flex items-center gap-1 bg-cream p-1 rounded-xl border border-beige/80">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                    statusFilter === 'all'
                      ? 'bg-white text-forest shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All ({items.length})
                </button>
                <button
                  onClick={() => setStatusFilter('expiring')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                    statusFilter === 'expiring'
                      ? 'bg-rose-50 text-rose-700 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Expiring ({expiringCount})
                </button>
              </div>

              {/* Sort By dropdown */}
              <div className="sm:col-span-3 flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-stone-400 shrink-0" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full py-2.5 px-3 bg-cream/50 border border-beige/80 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:border-forest"
                >
                  <option value="expiry">Sort: Expiry Date (Soonest)</option>
                  <option value="name">Sort: Name (A-Z)</option>
                  <option value="quantity">Sort: Highest Quantity</option>
                </select>
              </div>
            </div>

            {/* Category Pills Slider */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition border ${
                    selectedCategory === cat
                      ? 'bg-forest text-white border-forest'
                      : 'bg-cream text-stone-600 border-beige hover:border-sage'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Items Grid */}
          {loading ? (
            <Loading message="Loading pantry inventory..." />
          ) : filteredItems.length === 0 ? (
            <EmptyState
              icon={Refrigerator}
              title={
                search || selectedCategory !== 'All' || statusFilter !== 'all'
                  ? 'No matching groceries'
                  : 'Your pantry is currently empty'
              }
              description={
                search || selectedCategory !== 'All' || statusFilter !== 'all'
                  ? 'Try clearing your search query or switching categories.'
                  : 'Add fresh ingredients to unlock personalized recipe recommendations and expiry alerts.'
              }
              actionText={
                search || selectedCategory !== 'All' || statusFilter !== 'all'
                  ? 'Clear Filters'
                  : 'Add First Grocery Item'
              }
              onAction={
                search || selectedCategory !== 'All' || statusFilter !== 'all'
                  ? () => {
                      setSearch('');
                      setSelectedCategory('All');
                      setStatusFilter('all');
                    }
                  : handleOpenAdd
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item) => (
                <PantryCard
                  key={item._id}
                  item={item}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteItem}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              ))}
            </div>
          )}

        </main>
      </div>

      {/* Add / Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-elevated border border-beige/80 animate-scaleIn">
            <div className="flex items-center justify-between pb-4 border-b border-beige/60 mb-5">
              <h3 className="text-xl font-extrabold text-forest-dark">
                {editingItem ? 'Edit Grocery Item' : 'Add to Pantry'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
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
                  placeholder="e.g. Tomatoes, Milk, Spinach"
                  className="w-full px-3.5 py-2.5 bg-cream/50 border border-beige/80 rounded-xl text-sm focus:outline-hidden focus:border-forest text-stone-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleFormCategoryChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-cream/50 border border-beige/80 rounded-xl text-sm focus:outline-hidden focus:border-forest text-stone-800"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Qty *
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-3 py-2.5 bg-cream/50 border border-beige/80 rounded-xl text-sm focus:outline-hidden focus:border-forest text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Unit *
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-2 py-2.5 bg-cream/50 border border-beige/80 rounded-xl text-sm focus:outline-hidden focus:border-forest text-stone-800"
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Purchase Date & Expiry Date (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-cream/50 border border-beige/80 rounded-xl text-sm focus:outline-hidden focus:border-forest text-stone-800"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                      Expiry Date <span className="font-normal text-stone-400 lowercase">(optional)</span>
                    </label>
                    {formData.expiryDate && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, expiryDate: '' })}
                        className="text-[11px] text-stone-400 hover:text-rose-600 underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-cream/50 border border-beige/80 rounded-xl text-sm focus:outline-hidden focus:border-forest text-stone-800"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Leave blank if this item does not expire
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Optional Notes
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Keep in crisper drawer, organic"
                  className="w-full px-3.5 py-2.5 bg-cream/50 border border-beige/80 rounded-xl text-sm focus:outline-hidden focus:border-forest text-stone-800"
                />
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
                  {formSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Add to Pantry'}
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

export default Pantry;

