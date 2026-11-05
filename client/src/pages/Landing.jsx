import React from 'react';
import { Link } from 'react-router-dom';
import {
  Refrigerator,
  UtensilsCrossed,
  ShoppingCart,
  Users,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Leaf,
  Clock,
  HeartHandshake
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline and Call-to-actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/10 border border-forest/15 text-forest text-xs sm:text-sm font-bold tracking-wide">
                <Leaf className="w-4 h-4 text-forest" />
                <span>The Intelligent Zero-Waste Kitchen Assistant</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest-dark tracking-tight leading-[1.15]">
                Your Pantry, Smarter. <br />
                <span className="text-forest">Your Waste, Smaller.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Transform ingredients you already own into delicious chef-inspired recipes.
                Track expiry dates automatically, eliminate forgotten groceries, and minimize household food waste effortlessly.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-forest hover:bg-forest-hover text-white font-bold text-base shadow-elevated transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#features"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-beige/40 text-forest-dark font-bold text-base border border-beige/80 shadow-soft transition-all duration-200"
                >
                  <span>Explore Features</span>
                </a>
              </div>

              {/* Trust badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-forest" /> 30+ Curated Recipes
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-forest" /> Dynamic Expiry Engine
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-forest" /> Free & Privacy-First
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Card */}
                <div className="bg-white rounded-3xl p-6 shadow-elevated border border-beige/80 relative z-10 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-beige/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-forest/10 flex items-center justify-center text-forest">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-forest-dark">Smart Match Active</h4>
                        <p className="text-[11px] text-stone-400">Available from your pantry</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      100% Cookable
                    </span>
                  </div>

                  {/* Sample Recipe preview card */}
                  <div className="rounded-2xl overflow-hidden border border-beige/60 bg-cream/40">
                    <img
                      src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
                      alt="Tomato Rice"
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-sm text-forest-dark">Tangy Tomato Rice</h5>
                        <span className="text-xs font-semibold text-stone-500">20 mins</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold border border-rose-200">
                          Uses: Tomatoes (Expiring Today)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Highlight bar */}
                  <div className="p-3 rounded-xl bg-forest text-white text-xs flex items-center justify-between font-medium shadow-soft">
                    <span>Prevented 450g of food waste!</span>
                    <span className="text-sage-light font-bold">Zero-Waste</span>
                  </div>
                </div>

                {/* Floating decor badge */}
                <div className="absolute -bottom-6 -left-6 z-20 bg-white rounded-2xl p-4 shadow-elevated border border-beige/80 hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <TrendingDown className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-forest-dark">Save ~₹3,500/mo</p>
                    <p className="text-[11px] text-stone-500">Average household savings</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="py-20 bg-white border-y border-beige/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-dark bg-sage/15 px-3 py-1 rounded-full">
              Full Suite of Kitchen Tools
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-dark tracking-tight">
              Engineered to End Food Spoilage
            </h2>
            <p className="text-sm sm:text-base text-stone-500 leading-relaxed">
              Every feature works together in real time—from your pantry inventory to recipe deduction and grocery auto-replenishment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-cream/50 border border-beige/80 hover:shadow-card transition-all duration-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-forest text-cream flex items-center justify-center font-bold shadow-soft">
                <Refrigerator className="w-6 h-6 text-sage-light" />
              </div>
              <h3 className="text-lg font-bold text-forest-dark">Pantry Tracking</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Log groceries with dynamic green, yellow, and red status alerts. Monitor quantities and know what needs cooking today.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-cream/50 border border-beige/80 hover:shadow-card transition-all duration-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-forest text-cream flex items-center justify-center font-bold shadow-soft">
                <UtensilsCrossed className="w-6 h-6 text-sage-light" />
              </div>
              <h3 className="text-lg font-bold text-forest-dark">Smart Recipes</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Ingredient-matching algorithm prioritizes items approaching expiry. Mark as Cooked automatically deducts inventory.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-cream/50 border border-beige/80 hover:shadow-card transition-all duration-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-forest text-cream flex items-center justify-center font-bold shadow-soft">
                <ShoppingCart className="w-6 h-6 text-sage-light" />
              </div>
              <h3 className="text-lg font-bold text-forest-dark">Grocery Lists</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                One-click transfer of missing recipe ingredients. Mark as purchased seamlessly moves goods back to your pantry.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-cream/50 border border-beige/80 hover:shadow-card transition-all duration-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-forest text-cream flex items-center justify-center font-bold shadow-soft">
                <Users className="w-6 h-6 text-sage-light" />
              </div>
              <h3 className="text-lg font-bold text-forest-dark">Zero-Waste Community</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Share and discover innovative peel broths, storage hacks, leftover transformations, and budget-friendly recipes.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-forest bg-forest/10 px-3 py-1 rounded-full">
              Seamless Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-dark tracking-tight">
              How Smart Pantry Works
            </h2>
            <p className="text-sm sm:text-base text-stone-500">
              Four intuitive steps to total kitchen peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-beige/80 shadow-soft text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-forest text-white font-bold flex items-center justify-center mx-auto text-sm">
                1
              </div>
              <h4 className="font-bold text-forest-dark text-base">Add Your Groceries</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Input items and expiry dates into your pantry dashboard.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-beige/80 shadow-soft text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-forest text-white font-bold flex items-center justify-center mx-auto text-sm">
                2
              </div>
              <h4 className="font-bold text-forest-dark text-base">Get Smart Matches</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Our engine prioritizes recipes using ingredients expiring soonest.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-beige/80 shadow-soft text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-forest text-white font-bold flex items-center justify-center mx-auto text-sm">
                3
              </div>
              <h4 className="font-bold text-forest-dark text-base">Cook & Deduct</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Click "Mark as Cooked" to automatically update inventory and log food waste saved.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-6 border border-beige/80 shadow-soft text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-forest text-white font-bold flex items-center justify-center mx-auto text-sm">
                4
              </div>
              <h4 className="font-bold text-forest-dark text-base">Sync Grocery List</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Send missing recipe ingredients directly to your list and restock with ease.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-20 bg-forest-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage/20 border border-sage/30 text-sage-light text-xs font-bold">
                <Leaf className="w-4 h-4 text-sage" />
                <span>Environmental Impact</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Small Kitchen Habits. <br />
                <span className="text-sage">Massive Planet Impact.</span>
              </h2>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                Food waste accounts for approximately 8-10% of global greenhouse gas emissions. When food ends up in landfills, it decomposes to produce methane, a greenhouse gas 28 times more potent than carbon dioxide.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-forest/40 border border-sage/20">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-sage-light">30%</h3>
                  <p className="text-xs text-stone-300 mt-1">Average food saved per home</p>
                </div>
                <div className="p-4 rounded-xl bg-forest/40 border border-sage/20">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-sage-light">4.5 kg</h3>
                  <p className="text-xs text-stone-300 mt-1">CO₂ emissions cut per week</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border border-sage/20 shadow-elevated">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
                alt="Fresh sustainable ingredients"
                className="w-full h-96 object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-20 bg-cream border-t border-beige/80 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-dark tracking-tight">
            Ready to Cook Smarter and Waste Less?
          </h2>
          <p className="text-base text-stone-600 max-w-xl mx-auto">
            Join thousands of zero-waste cooks who save groceries, money, and time every single day.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-forest hover:bg-forest-hover text-white font-bold text-base shadow-elevated transition"
            >
              <span>Create Your Free Pantry</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;

