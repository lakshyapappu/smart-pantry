import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, ShieldCheck, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-forest-dark text-cream border-t border-forest mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sage text-forest-dark flex items-center justify-center font-bold">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Smart Pantry
              </span>
            </div>
            <p className="text-sm text-stone-300 max-w-md leading-relaxed">
              Your intelligent grocery inventory tracker & zero-waste recipe recommendation engine.
              Cook delicious meals with ingredients you already have, eliminate household food spoilage, and build a sustainable kitchen.
            </p>
            <div className="flex items-center gap-4 text-xs text-sage pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-sage" /> 100% Data Isolation
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-sage" /> Zero-Waste Matching
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sage mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li>
                <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link>
              </li>
              <li>
                <Link to="/pantry" className="hover:text-white transition">Pantry Tracker</Link>
              </li>
              <li>
                <Link to="/recipes" className="hover:text-white transition">Zero-Waste Recipes</Link>
              </li>
              <li>
                <Link to="/grocery-list" className="hover:text-white transition">Smart Grocery List</Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-white transition">Community Wall</Link>
              </li>
            </ul>
          </div>

          {/* Sustainability Mission */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sage mb-4">
              Sustainability
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed mb-3">
              Over 30% of global food is wasted annually in households. By using smart expiry tracking, you save money, conserve resources, and cut carbon emissions.
            </p>
            <div className="p-3 rounded-xl bg-forest/40 border border-sage/20 text-xs text-sage-light">
              💡 Tip: Regularly prioritize recipes using ingredients marked in yellow and red.
            </div>
          </div>

        </div>

        <div className="border-t border-forest/60 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} Smart Pantry Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" /> for a sustainable planet.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

