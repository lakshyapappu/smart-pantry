import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import StatCard from '../components/StatCard';
import ExpiryBadge from '../components/ExpiryBadge';
import RecipeCard from '../components/RecipeCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import {
  Refrigerator,
  AlertTriangle,
  UtensilsCrossed,
  ShoppingCart,
  TrendingDown,
  PlusCircle,
  Search,
  MessageSquarePlus,
  ArrowRight,
  Flame,
  Calendar,
  Sparkles,
  Scale
} from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/stats');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Could not load dashboard statistics.');
      showToast('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-cream">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loading message="Assembling your kitchen dashboard..." />
        </div>
        <Footer />
      </div>
    );
  }

  const stats = data?.stats || {
    totalPantryItems: 0,
    expiringSoonCount: 0,
    recipesAvailable: 0,
    pendingGroceryItems: 0,
    foodWasteSavedGrams: 0,
    foodWasteSavedKg: 0,
    totalMealsCooked: 0
  };

  const expiringSoon = data?.expiringSoon || [];
  const suggestions = data?.todaySuggestions || [];

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          expiringCount={stats.expiringSoonCount}
          pendingGroceryCount={stats.pendingGroceryItems}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 space-y-8">
          
          {/* Top Greeting Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero-Waste Overview</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-dark tracking-tight">
                {getGreeting()}, {user?.name || 'Chef'}!
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Here is your kitchen inventory and zero-waste meal plan for today.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/pantry"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-semibold shadow-soft transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Grocery</span>
              </Link>
            </div>
          </div>

          {/* 5 Real-Time Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              title="Pantry Items"
              value={stats.totalPantryItems}
              unit="items"
              subtext="Stored in kitchen"
              icon={Refrigerator}
              color="forest"
              onClick={() => navigate('/pantry')}
            />
            <StatCard
              title="Expiring Soon"
              value={stats.expiringSoonCount}
              unit="items"
              subtext="Use in 1-5 days"
              icon={AlertTriangle}
              color={stats.expiringSoonCount > 0 ? 'danger' : 'forest'}
              onClick={() => navigate('/pantry?filter=expiring')}
            />
            <StatCard
              title="Ready Recipes"
              value={stats.recipesAvailable}
              unit="dishes"
              subtext="Matches available"
              icon={UtensilsCrossed}
              color="sage"
              onClick={() => navigate('/recipes')}
            />
            <StatCard
              title="Pending Groceries"
              value={stats.pendingGroceryItems}
              unit="to buy"
              subtext="In shopping list"
              icon={ShoppingCart}
              color="warning"
              onClick={() => navigate('/grocery-list')}
            />
            <StatCard
              title="Food Waste Saved"
              value={stats.foodWasteSavedKg > 0 ? stats.foodWasteSavedKg : `${stats.foodWasteSavedGrams}g`}
              unit={stats.foodWasteSavedKg > 0 ? 'kg' : ''}
              subtext={`${stats.totalMealsCooked} meals prepared`}
              icon={Scale}
              color="emerald"
            />
          </div>

          {/* Quick Actions Row */}
          <div className="bg-white rounded-2xl p-5 border border-beige/80 shadow-soft">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                to="/pantry"
                className="p-3 rounded-xl bg-cream hover:bg-beige/40 text-stone-700 hover:text-forest-dark border border-beige/60 text-xs font-semibold flex items-center gap-2 transition"
              >
                <PlusCircle className="w-4 h-4 text-forest" />
                <span>Add Grocery</span>
              </Link>
              <Link
                to="/recipes"
                className="p-3 rounded-xl bg-cream hover:bg-beige/40 text-stone-700 hover:text-forest-dark border border-beige/60 text-xs font-semibold flex items-center gap-2 transition"
              >
                <Search className="w-4 h-4 text-forest" />
                <span>Find Recipes</span>
              </Link>
              <Link
                to="/grocery-list"
                className="p-3 rounded-xl bg-cream hover:bg-beige/40 text-stone-700 hover:text-forest-dark border border-beige/60 text-xs font-semibold flex items-center gap-2 transition"
              >
                <ShoppingCart className="w-4 h-4 text-forest" />
                <span>View Grocery List</span>
              </Link>
              <Link
                to="/community"
                className="p-3 rounded-xl bg-cream hover:bg-beige/40 text-stone-700 hover:text-forest-dark border border-beige/60 text-xs font-semibold flex items-center gap-2 transition"
              >
                <MessageSquarePlus className="w-4 h-4 text-forest" />
                <span>Share a Tip</span>
              </Link>
            </div>
          </div>

          {/* Section: Expiring Soon */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg sm:text-xl font-bold text-forest-dark">
                  Expiring Soon — Action Needed
                </h2>
              </div>
              <Link
                to="/pantry"
                className="text-xs font-bold text-forest hover:underline flex items-center gap-1"
              >
                <span>View All Pantry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {expiringSoon.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-beige/80 text-center">
                <p className="text-sm font-semibold text-emerald-800">
                  🎉 Excellent! No ingredients are expiring in the next 5 days.
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Keep your pantry updated to get proactive freshness alerts.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {expiringSoon.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 bg-white rounded-2xl border border-beige/80 shadow-soft flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-forest-dark capitalize">
                        {item.name}
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Quantity: <strong>{item.quantity} {item.unit}</strong>
                      </p>
                      <p className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Expires {formatDate(item.expiryDate)}
                      </p>
                    </div>
                    <ExpiryBadge expiryDate={item.expiryDate} customStatus={item.expiryStatus} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Section: Today's Recipe Suggestions */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-forest-dark">
                  Today's Zero-Waste Recipe Suggestions
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Prioritized by ingredients expiring soon and current pantry contents
                </p>
              </div>
              <Link
                to="/recipes"
                className="text-xs font-bold text-forest hover:underline flex items-center gap-1"
              >
                <span>Explore All Recipes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {suggestions.length === 0 ? (
              <EmptyState
                icon={UtensilsCrossed}
                title="No recipes found"
                description="Add some ingredients to your pantry to see tailored zero-waste recommendations."
                actionText="Add Pantry Items"
                onAction={() => navigate('/pantry')}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {suggestions.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            )}
          </section>

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;

