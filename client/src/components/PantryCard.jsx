import React, { useState } from 'react';
import ExpiryBadge from './ExpiryBadge';
import { Edit2, Trash2, Plus, Minus, Calendar, Tag } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

const PantryCard = ({ item, onEdit, onDelete, onUpdateQuantity }) => {
  const [updating, setUpdating] = useState(false);

  const handleAdjustQuantity = async (delta) => {
    const newQty = Math.max(0, Math.round((item.quantity + delta) * 100) / 100);
    setUpdating(true);
    try {
      await onUpdateQuantity(item._id, newQty);
    } finally {
      setUpdating(false);
    }
  };

  const categoryColors = {
    Vegetables: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Fruits: 'bg-amber-50 text-amber-800 border-amber-200',
    Dairy: 'bg-sky-50 text-sky-800 border-sky-200',
    'Meat and Seafood': 'bg-rose-50 text-rose-800 border-rose-200',
    'Grains and Cereals': 'bg-stone-100 text-stone-800 border-stone-200',
    Bakery: 'bg-orange-50 text-orange-800 border-orange-200',
    'Spices and Condiments': 'bg-purple-50 text-purple-800 border-purple-200',
    Beverages: 'bg-teal-50 text-teal-800 border-teal-200',
    Other: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-beige/70 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top: Category and Expiry Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border ${
              categoryColors[item.category] || categoryColors.Other
            }`}
          >
            {item.category}
          </span>
          <ExpiryBadge
            expiryDate={item.expiryDate}
            customStatus={item.expiryStatus}
          />
        </div>

        {/* Item Name */}
        <h3 className="text-lg font-bold text-forest-dark mb-1 group-hover:text-forest transition-colors capitalize">
          {item.name}
        </h3>

        {/* Purchase & Expiry dates */}
        <div className="flex flex-col gap-1 text-xs text-stone-500 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>
              {item.expiryDate ? (
                <>Expires: <strong className="text-stone-700">{formatDate(item.expiryDate)}</strong></>
              ) : (
                <span className="text-stone-400">No expiry date</span>
              )}
            </span>
          </div>
          {item.purchaseDate && (
            <div className="text-[11px] text-stone-400">
              Purchased: {formatDate(item.purchaseDate)}
            </div>
          )}
        </div>

        {/* Optional notes */}
        {item.notes && (
          <p className="text-xs text-stone-600 bg-cream/70 p-2.5 rounded-xl border border-beige/40 italic mb-4">
            "{item.notes}"
          </p>
        )}
      </div>

      {/* Bottom: Quantity Controls & Actions */}
      <div className="pt-3 border-t border-beige/60 flex items-center justify-between gap-3">
        {/* Quantity Stepper */}
        <div className="flex items-center gap-1.5 bg-cream px-2 py-1 rounded-xl border border-beige/80">
          <button
            onClick={() => handleAdjustQuantity(-1)}
            disabled={updating || item.quantity <= 0}
            className="w-6 h-6 rounded-lg bg-white hover:bg-beige/50 text-stone-700 flex items-center justify-center transition disabled:opacity-40"
            title="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          
          <span className="text-xs font-bold text-forest-dark px-1.5 min-w-[40px] text-center">
            {item.quantity} <span className="font-normal text-stone-500">{item.unit}</span>
          </span>

          <button
            onClick={() => handleAdjustQuantity(1)}
            disabled={updating}
            className="w-6 h-6 rounded-lg bg-white hover:bg-beige/50 text-stone-700 flex items-center justify-center transition disabled:opacity-40"
            title="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-stone-400 hover:text-forest hover:bg-sage/10 rounded-xl transition"
            title="Edit item"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item._id, item.name)}
            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
            title="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PantryCard;

