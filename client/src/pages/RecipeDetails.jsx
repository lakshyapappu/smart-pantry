import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import {
  Clock,
  Users,
  ChefHat,
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
  Flame,
  ArrowLeft,
  Check,
  Scale,
  Sparkles,
  Utensils
} from 'lucide-react';

const RecipeDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cooking, setCooking] = useState(false);
  const [addingToGrocery, setAddingToGrocery] = useState(false);
  const [showCookModal, setShowCookModal] = useState(false);
  const [cookingDoneInfo, setCookingDoneInfo] = useState(null);

  const fetchRecipeDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/recipes/${id}`);
      if (res.data.success) {
        setRecipe(res.data.data);
      }
    } catch (err) {
      showToast('Recipe not found or could not be loaded', 'error');
      navigate('/recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);

  // Add missing ingredients to grocery list
  const handleAddMissingToGrocery = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to add items to your grocery list', 'info');
      navigate('/login');
      return;
    }

    const missing = recipe.match?.missingIngredients || [];
    if (missing.length === 0) {
      showToast('You already have all ingredients in your pantry!', 'success');
      return;
    }

    setAddingToGrocery(true);
    try {
      const itemsToAdd = missing.map((m) => ({
        name: m.name,
        quantity: m.missingQuantity || m.requiredQuantity,
        unit: m.unit,
        category: recipe.category || 'Other'
      }));

      const res = await api.post('/grocery', { items: itemsToAdd });
      if (res.data.success) {
        showToast(
          `Added ${itemsToAdd.length} missing ingredient${
            itemsToAdd.length > 1 ? 's' : ''
          } to your grocery list!`,
          'success'
        );
      }
    } catch (err) {
      showToast('Failed to add ingredients to grocery list', 'error');
    } finally {
      setAddingToGrocery(false);
    }
  };

  // Mark recipe as cooked
  const handleConfirmCook = async () => {
    setCooking(true);
    try {
      // Generate client idempotency key to prevent double execution
      const idempotencyKey = `cook_${recipe._id}_${Date.now()}`;

      const res = await api.post(`/recipes/${recipe._id}/cook`, { idempotencyKey });
      if (res.data.success) {
        showToast(res.data.message || 'Recipe cooked! Pantry updated.', 'success');
        setCookingDoneInfo(res.data);
        setShowCookModal(false);
        // Refresh recipe match data with updated pantry
        fetchRecipeDetails();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not mark recipe as cooked';
      showToast(msg, 'error');
      setShowCookModal(false);
    } finally {
      setCooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-cream">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loading message="Loading recipe details and pantry stock..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (!recipe) return null;

  const match = recipe.match || {
    matchPercentage: 0,
    isFullyCookable: false,
    availableIngredients: [],
    missingIngredients: [],
    expiringCount: 0
  };

  const is100 = match.isFullyCookable || match.matchPercentage === 100;
  const missingCount = match.missingIngredients?.length || 0;
  const availableCount = match.availableIngredients?.filter((i) => i.isSufficient)?.length || 0;

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Back Link */}
        <div>
          <Link
            to="/recipes"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-forest transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Recipes</span>
          </Link>
        </div>

        {/* Cook Success Banner */}
        {cookingDoneInfo && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-emerald-900 shadow-soft animate-scaleIn flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base">Meal Prepared Successfully!</h3>
              <p className="text-xs text-emerald-800 mt-1">
                {cookingDoneInfo.message}
              </p>
              {cookingDoneInfo.savedFoodWasteGrams > 0 && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-200/70 text-emerald-950 font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>You saved {cookingDoneInfo.savedFoodWasteGrams}g of food from going to waste!</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hero Card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-beige/80 shadow-elevated grid grid-cols-1 md:grid-cols-12">
          
          {/* Image */}
          <div className="md:col-span-5 relative h-72 md:h-full bg-stone-100 min-h-[300px]">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-forest-dark backdrop-blur-sm shadow-xs">
                {recipe.category}
              </span>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {/* Match percentage */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
                    is100
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : match.matchPercentage >= 50
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  {is100 ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                  {match.matchPercentage}% Pantry Match
                </span>

                {match.expiringCount > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    Uses {match.expiringCount} Expiring Ingredient{match.expiringCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-dark tracking-tight mb-2">
                {recipe.name}
              </h1>

              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                {recipe.description}
              </p>

              {/* Cooking Metadata */}
              <div className="grid grid-cols-3 gap-3 py-3 border-y border-beige/60 text-center">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Prep Time</p>
                  <p className="text-sm font-bold text-forest-dark mt-0.5">{recipe.preparationTime || 10} mins</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Cook Time</p>
                  <p className="text-sm font-bold text-forest-dark mt-0.5">{recipe.cookingTime} mins</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Difficulty</p>
                  <p className="text-sm font-bold text-forest-dark mt-0.5">{recipe.difficulty}</p>
                </div>
              </div>

              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-lg bg-cream border border-beige/60 text-xs font-medium text-stone-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              {is100 ? (
                <button
                  onClick={() => setShowCookModal(true)}
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-forest hover:bg-forest-hover text-white font-bold text-sm shadow-soft transition flex items-center justify-center gap-2"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Mark as Cooked</span>
                </button>
              ) : (
                <button
                  onClick={handleAddMissingToGrocery}
                  disabled={addingToGrocery || missingCount === 0}
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-forest hover:bg-forest-hover text-white font-bold text-sm shadow-soft transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{addingToGrocery ? 'Adding...' : `Add Missing to Grocery List (${missingCount})`}</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Two-Column Section: Ingredients Checklist & Cooking Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Ingredients Checklist */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-beige/80 shadow-soft">
              <div className="flex items-center justify-between pb-3 border-b border-beige/60 mb-4">
                <h3 className="text-base font-bold text-forest-dark flex items-center gap-2">
                  <span>Required Ingredients</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cream text-stone-600 border border-beige/80">
                    {recipe.ingredients.length} total
                  </span>
                </h3>
              </div>

              {/* Available Ingredients */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>In Your Pantry ({availableCount})</span>
                  </h4>

                  {match.availableIngredients && match.availableIngredients.length > 0 ? (
                    <ul className="space-y-2">
                      {match.availableIngredients.map((ing, idx) => (
                        <li
                          key={idx}
                          className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-stone-800 capitalize">
                              {ing.name}
                            </span>
                            <span className="text-stone-500 ml-1.5">
                              (Needs {ing.requiredQuantity} {ing.unit})
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-emerald-800">
                              {ing.availableQuantity} {ing.unit} in stock
                            </span>
                            {ing.isExpiringSoon && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                Expiring
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-stone-400 italic">No matching ingredients in pantry yet.</p>
                  )}
                </div>

                {/* Missing Ingredients */}
                {match.missingIngredients && match.missingIngredients.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Missing from Pantry ({match.missingIngredients.length})</span>
                    </h4>

                    <ul className="space-y-2">
                      {match.missingIngredients.map((m, idx) => (
                        <li
                          key={idx}
                          className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-between text-xs"
                        >
                          <span className="font-bold text-stone-800 capitalize">
                            {m.name}
                          </span>
                          <span className="font-semibold text-amber-900">
                            Need {m.missingQuantity || m.requiredQuantity} {m.unit}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={handleAddMissingToGrocery}
                      disabled={addingToGrocery}
                      className="w-full mt-3 py-2 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add missing to grocery list</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right Column: Cooking Instructions */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-beige/80 shadow-soft space-y-6">
              <h3 className="text-lg font-bold text-forest-dark pb-3 border-b border-beige/60">
                Step-by-Step Cooking Instructions
              </h3>

              <div className="space-y-4">
                {recipe.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-xl bg-forest text-cream font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-stone-700 leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom cook action */}
              <div className="pt-6 border-t border-beige/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-stone-500">
                  {is100 ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> All ingredients verified and in stock
                    </span>
                  ) : (
                    <span className="text-stone-500">
                      Missing {missingCount} ingredients to complete this meal
                    </span>
                  )}
                </div>

                {is100 ? (
                  <button
                    onClick={() => setShowCookModal(true)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-bold shadow-soft transition"
                  >
                    Mark as Cooked
                  </button>
                ) : (
                  <button
                    onClick={handleAddMissingToGrocery}
                    disabled={addingToGrocery}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-forest/10 hover:bg-forest hover:text-white text-forest-dark text-xs sm:text-sm font-bold transition"
                  >
                    Add Missing Items
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* Confirmation Modal for "Mark as Cooked" */}
      {showCookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-elevated border border-beige/80 animate-scaleIn space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mx-auto">
              <Utensils className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-xl font-extrabold text-forest-dark">
                Mark "{recipe.name}" as Cooked?
              </h3>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                This will automatically deduct the required ingredient quantities from your pantry inventory and record your zero-waste impact.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-cream border border-beige/80 space-y-2 text-xs">
              <p className="font-bold text-stone-700">Ingredients to be deducted:</p>
              <ul className="space-y-1 text-stone-600">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{ing.name}</span>
                    <span className="font-semibold">{ing.quantity} {ing.unit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCookModal(false)}
                className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCook}
                disabled={cooking}
                className="px-5 py-2.5 text-xs font-bold bg-forest hover:bg-forest-hover text-white rounded-xl shadow-soft transition disabled:opacity-50"
              >
                {cooking ? 'Deducting Pantry...' : 'Confirm & Deduct'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RecipeDetails;

