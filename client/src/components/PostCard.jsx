import React, { useState } from 'react';
import { Heart, Trash2, Calendar, User, Tag } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onLike, onDelete }) => {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);

  const isAuthor = user && post.userId && (
    (typeof post.userId === 'object' && post.userId._id === user._id) ||
    post.userId === user._id
  );

  const authorName = post.userId?.name || 'Sustainable Cook';

  const categoryTags = {
    'Leftover Recipes': 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'Vegetable Waste Hacks': 'bg-amber-50 text-amber-800 border-amber-200',
    'Food Storage Tips': 'bg-sky-50 text-sky-800 border-sky-200',
    'Budget Cooking': 'bg-stone-100 text-stone-800 border-stone-200',
    'Sustainable Kitchen': 'bg-purple-50 text-purple-800 border-purple-200'
  };

  const handleLikeClick = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await onLike(post._id);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <article className="bg-white rounded-2xl p-6 border border-beige/80 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top: Author & Category */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-forest text-cream flex items-center justify-center font-bold text-sm shadow-xs">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-bold text-forest-dark leading-tight">
                {authorName}
              </h4>
              <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3" />
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
              categoryTags[post.category] || categoryTags['Sustainable Kitchen']
            }`}
          >
            {post.category}
          </span>
        </div>

        {/* Post text */}
        <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line mb-4 font-normal">
          {post.content}
        </p>

        {/* Optional Image */}
        {post.image && (
          <div className="rounded-xl overflow-hidden mb-4 max-h-72 bg-stone-100 border border-beige/60">
            <img
              src={post.image}
              alt="Tip visual"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom: Likes & Delete */}
      <div className="pt-3 border-t border-beige/60 flex items-center justify-between">
        <button
          onClick={handleLikeClick}
          disabled={!user || isLiking}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
            post.isLikedByCurrentUser
              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
              : 'text-stone-500 hover:text-rose-600 hover:bg-rose-50'
          } ${!user ? 'cursor-not-allowed opacity-60' : ''}`}
          title={user ? 'Like this tip' : 'Log in to like'}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              post.isLikedByCurrentUser ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
          <span>{post.likeCount || 0}</span>
        </button>

        {isAuthor && (
          <button
            onClick={() => onDelete(post._id)}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            title="Delete your post"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </article>
  );
};

export default PostCard;

