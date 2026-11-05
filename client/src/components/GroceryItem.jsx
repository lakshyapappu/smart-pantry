import React, { useState } from 'react';
import { Check, Trash2, Edit2, ArrowRightCircle } from 'lucide-react';

const GroceryItem = ({ item, onPurchase, onEdit, onDelete }) => {
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [selectedDays, setSelectedDays] = useState(null); // null = No Expiry
  const [purchasing, setPurchasing] = useState(false);

  const handleConfirmPurchase = async () => {
    setPurchasing(true);
    try {
      let expDate = null;
      if (selectedDays !== null && selectedDays > 0) {
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() + parseInt(selectedDays, 10));
        expDate = dateObj.toISOString();
      }
      await onPurchase(item._id, expDate);
      setShowPurchaseDialog(false);
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        item.purchased
          ? 'bg-beige/20 border-beige/60 opacity-75'
          : 'bg-white border-beige/80 shadow-soft hover:shadow-card'
      }`}
    >
      {/* Left: Checkbox / Info */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {!item.purchased ? (
          <button
            onClick={() => setShowPurchaseDialog(true)}
            className="w-6 h-6 rounded-lg border-2 border-forest/40 hover:border-forest hover:bg-forest/10 flex items-center justify-center transition shrink-0"
            title="Mark as purchased and add to pantry"
          >
            <Check className="w-4 h-4 text-forest opacity-0 hover:opacity-100 transition" />
          </button>
        ) : (
          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={`font-bold text-sm sm:text-base capitalize truncate ${
                item.purchased ? 'line-through text-stone-400' : 'text-forest-dark'
              }`}
            >
              {item.name}
            </h4>
            {item.category && item.category !== 'Other' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cream border border-beige/60 text-stone-600">
                {item.category}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 font-medium">
            {item.quantity} {item.unit}
            {item.purchased && item.transferredToPantry && (
              <span className="ml-2 text-emerald-700 font-semibold inline-flex items-center gap-1">
                <ArrowRightCircle className="w-3 h-3" /> Transferred to pantry
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center justify-end gap-2 shrink-0">
        {!item.purchased && (
          <button
            onClick={() => setShowPurchaseDialog(true)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-forest/10 hover:bg-forest hover:text-white text-forest-dark transition"
          >
            Mark Purchased
          </button>
        )}

        {!item.purchased && onEdit && (
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-stone-400 hover:text-forest hover:bg-sage/10 rounded-xl transition"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => onDelete(item._id, item.name)}
          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Modal for setting expiry date when marking purchased */}
      {showPurchaseDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-elevated border border-beige/80 animate-scaleIn">
            <h3 className="text-lg font-bold text-forest-dark mb-2">
              Transfer to Pantry
            </h3>
            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              Marking <strong>{item.name}</strong> ({item.quantity} {item.unit}) as purchased will automatically add it to your pantry inventory.
            </p>

            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Expiry Date (Optional)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setSelectedDays(null)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                    selectedDays === null
                      ? 'bg-forest text-white border-forest'
                      : 'bg-cream text-stone-700 border-beige hover:border-sage'
                  }`}
                >
                  No Expiry
                </button>
                {[3, 7, 14].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDays(d)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                      selectedDays === d
                        ? 'bg-forest text-white border-forest'
                        : 'bg-cream text-stone-700 border-beige hover:border-sage'
                    }`}
                  >
                    {d} days
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-stone-500">
                {selectedDays === null
                  ? 'Item will be stored in your pantry without an expiry date.'
                  : `Item will be stored in your pantry with an expiry date in ${selectedDays} days.`}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPurchaseDialog(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPurchase}
                disabled={purchasing}
                className="px-4 py-2 text-xs font-semibold bg-forest hover:bg-forest-hover text-white rounded-xl shadow-soft transition disabled:opacity-50"
              >
                {purchasing ? 'Transferring...' : 'Confirm & Add to Pantry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroceryItem;
