import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Leaf, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back to Smart Pantry!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      let msg = err.response?.data?.message || err.message || 'Login failed';
      if (err.message === 'Network Error' || !err.response) {
        msg = 'Cannot connect to backend server. Please verify the Express backend is running on port 5000.';
      }
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@smartpantry.app');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-beige/80 shadow-elevated">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-forest text-cream flex items-center justify-center mx-auto mb-3 shadow-soft">
              <Leaf className="w-6 h-6 text-sage-light" />
            </div>
            <h2 className="text-2xl font-extrabold text-forest-dark tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Sign in to manage your pantry and discover zero-waste meals
            </p>
          </div>

          {/* Quick Demo Login Pill */}
          <div className="mb-6 p-3 rounded-xl bg-sage-soft border border-sage/30 flex items-center justify-between text-xs">
            <span className="text-forest-dark font-medium">Want to test right away?</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-2.5 py-1 bg-forest text-white rounded-lg font-bold hover:bg-forest-hover transition text-[11px]"
            >
              Fill Demo User
            </button>
          </div>

          {/* Error notice */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-cream/50 border border-beige/80 rounded-xl text-sm focus:outline-hidden focus:border-forest text-stone-800 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-cream/50 border border-beige/80 rounded-xl text-sm focus:outline-hidden focus:border-forest text-stone-800 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-forest hover:bg-forest-hover text-white font-bold text-sm shadow-soft transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="text-center mt-6 text-xs text-stone-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-forest hover:underline">
              Create an account
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;

