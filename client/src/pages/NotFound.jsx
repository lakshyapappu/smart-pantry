import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft, Home } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-beige/80 shadow-elevated space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-forest/10 text-forest flex items-center justify-center mx-auto">
            <Leaf className="w-8 h-8" />
          </div>

          <h1 className="text-4xl font-extrabold text-forest-dark">404</h1>
          <h2 className="text-xl font-bold text-stone-700">Recipe or Page Not Found</h2>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            The page you are looking for may have been moved or does not exist in your pantry.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-bold shadow-soft transition"
            >
              <Home className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;

