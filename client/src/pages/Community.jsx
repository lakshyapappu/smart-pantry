import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import {
  Users,
  Send,
  Sparkles,
  MessageSquare,
  Image as ImageIcon,
  Tag,
  Filter
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Leftover Recipes',
  'Vegetable Waste Hacks',
  'Food Storage Tips',
  'Budget Cooking',
  'Sustainable Kitchen'
];

const Community = () => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // New post form state
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Sustainable Kitchen');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'All' ? '/posts' : `/posts?category=${encodeURIComponent(selectedCategory)}`;
      const res = await api.get(url);
      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch (err) {
      showToast('Failed to load community tips', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please log in to share a cooking tip', 'info');
      return;
    }

    if (!content.trim()) {
      showToast('Please write some content for your tip', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/posts', {
        content: content.trim(),
        category,
        image: imageUrl.trim()
      });

      if (res.data.success) {
        showToast('Tip shared with the community! 🌿', 'success');
        setContent('');
        setImageUrl('');
        setShowImageInput(false);
        // Prepend new post to feed
        setPosts((prev) => [res.data.data, ...prev]);
      }
    } catch (err) {
      showToast('Failed to share post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikePost = async (id) => {
    if (!isAuthenticated) {
      showToast('Please log in to like posts', 'info');
      return;
    }

    try {
      const res = await api.post(`/posts/${id}/like`);
      if (res.data.success) {
        setPosts((prev) =>
          prev.map((p) => {
            if (p._id === id) {
              return {
                ...p,
                isLikedByCurrentUser: res.data.isLiked,
                likeCount: res.data.likeCount
              };
            }
            return p;
          })
        );
      }
    } catch (err) {
      showToast('Could not update like', 'error');
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tip?')) return;

    try {
      const res = await api.delete(`/posts/${id}`);
      if (res.data.success) {
        showToast('Post removed', 'info');
        setPosts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      showToast('Failed to delete post', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {isAuthenticated && <Sidebar />}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 space-y-8 max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zero-Waste Kitchen Collective</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-dark tracking-tight">
              Community Tips & Food Hacks
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto">
              Share your scrap recipes, vegetable peel hacks, storage secrets, and budget cooking wisdom.
            </p>
          </div>

          {/* Share Tip Form Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-beige/80 shadow-elevated">
            <h3 className="text-base font-bold text-forest-dark mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-forest" />
              <span>Share a Zero-Waste Cooking Tip</span>
            </h3>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <textarea
                rows="3"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  isAuthenticated
                    ? "What zero-waste hack or leftover idea did you discover today? (e.g. Save carrot peels for homemade stock...)"
                    : "Log in to share your cooking tips with the community!"
                }
                disabled={!isAuthenticated}
                className="w-full p-4 bg-cream/50 border border-beige/80 rounded-2xl text-sm focus:outline-hidden focus:border-forest text-stone-800 placeholder:text-stone-400"
              />

              {showImageInput && (
                <div className="relative animate-fadeIn">
                  <ImageIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste an image URL (Unsplash or image link)..."
                    className="w-full pl-10 pr-4 py-2 bg-cream/50 border border-beige/80 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-forest text-stone-800"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={!isAuthenticated}
                    className="py-2 px-3 bg-cream/50 border border-beige/80 rounded-xl text-xs font-semibold text-stone-700 focus:outline-hidden focus:border-forest"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setShowImageInput(!showImageInput)}
                    className="p-2 text-stone-500 hover:text-forest hover:bg-cream rounded-xl text-xs flex items-center gap-1 transition"
                    title="Attach Image URL"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Image</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!isAuthenticated || submitting || !content.trim()}
                  className="px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-bold shadow-soft transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sharing...' : 'Post Tip'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap border ${
                  selectedCategory === cat
                    ? 'bg-forest text-white border-forest shadow-soft'
                    : 'bg-white text-stone-700 border-beige hover:border-sage'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Social Feed List */}
          {loading ? (
            <Loading message="Fetching tips from community cooks..." />
          ) : posts.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No tips in this category yet"
              description="Be the first to share an inspiring zero-waste idea with the kitchen collective!"
              actionText={isAuthenticated ? "Write a Tip" : "Sign In to Share"}
              onAction={() => {
                if (!isAuthenticated) window.location.href = '/login';
              }}
            />
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={handleLikePost}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Community;

