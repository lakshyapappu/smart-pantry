import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import RecipeCard from '../components/RecipeCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import {
  UtensilsCrossed,
  Search,
  Filter,
  CheckCircle2,
  Flame,
  Sparkles,
  X
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Breakfast',
  'Main Course',
  'Rice & Noodles',
  'Snacks & Breads',
  'Soups & Salads',
  'Quick Meals'
];

const Recipes = () => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [specialFilter, setSpecialFilter] = useState(searchParams.get('filter') || 'all'); // 'all' | 'cookable' | 'expiring'

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/recipes');
      if (res.data.success) {
        setRecipes(res.data.data);
      }
    } catch (err) {
      showToast('Failed to load recipes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Filter recipes based on category, search, and zero-waste special filter
  const filteredRecipes = recipes.filter((recipe) => {
    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchName = recipe.name.toLowerCase().includes(q);
      const matchDesc = recipe.description?.toLowerCase().includes(q);
      const matchTag = recipe.tags?.some((t) => t.toLowerCase().includes(q));
      const matchIng = recipe.ingredients?.some((i) => i.name.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTag && !matchIng) return false;
    }

    // Category
    if (selectedCategory !== 'All' && recipe.category !== selectedCategory) {
      return false;
    }

    // Special Zero-Waste Filters
    if (specialFilter === 'cookable') {
      return recipe.match?.isFullyCookable || recipe.match?.matchPercentage === 100;
    }

    if (specialFilter === 'expiring') {
      return recipe.match?.expiringCount > 0 || recipe.match?.criticalExpiringCount > 0;
    }

    return true;
  });

  const cookableCount = recipes.filter((r) => r.match?.isFullyCookable || r.match?.matchPercentage === 100).length;
  const expiringCount = recipes.filter((r) => (r.match?.expiringCount || 0) > 0).length;

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {isAuthenticated && <Sidebar />}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero-Waste Recommendation Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-dark tracking-tight">
                Recipe Recommendations
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Matched against your live pantry stock and prioritized by ingredients expiring soonest.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-beige/80 shadow-soft space-y-4">
            
            {/* Search and Quick Filters */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search recipe by name, ingredients, or cuisine..."
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

              {/* Zero-Waste Special Toggle Filters */}
              <div className="md:col-span-6 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
                <button
                  onClick={() => setSpecialFilter('all')}
                  className={`px-3 py-2 rounded-xl transition shrink-0 ${
                    specialFilter === 'all'
                      ? 'bg-forest text-white shadow-soft'
                      : 'bg-cream text-stone-700 hover:bg-beige/40 border border-beige/80'
                  }`}
                >
                  All Dishes ({recipes.length})
                </button>

                <button
                  onClick={() => setSpecialFilter('cookable')}
                  className={`px-3 py-2 rounded-xl transition shrink-0 flex items-center gap-1.5 ${
                    specialFilter === 'cookable'
                      ? 'bg-emerald-700 text-white shadow-soft'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Ready to Cook ({cookableCount})</span>
                </button>

                <button
                  onClick={() => setSpecialFilter('expiring')}
                  className={`px-3 py-2 rounded-xl transition shrink-0 flex items-center gap-1.5 ${
                    specialFilter === 'expiring'
                      ? 'bg-amber-600 text-white shadow-soft'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Uses Expiring ({expiringCount})</span>
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
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

          {/* Recipes Grid */}
          {loading ? (
            <Loading message="Calculating ingredient matches with your pantry..." />
          ) : filteredRecipes.length === 0 ? (
            <EmptyState
              icon={UtensilsCrossed}
              title="No recipes found"
              description="No recipes match your current search and filters. Try adjusting your query or resetting filters."
              actionText="Reset All Filters"
              onAction={() => {
                setSearch('');
                setSelectedCategory('All');
                setSpecialFilter('all');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Recipes;

