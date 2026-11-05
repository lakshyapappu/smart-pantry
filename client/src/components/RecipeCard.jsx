import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChefHat, CheckCircle2, AlertTriangle, ArrowRight, Flame } from 'lucide-react';

const RecipeCard = ({ recipe }) => {
  const match = recipe.match || {
    matchPercentage: 0,
    isFullyCookable: false,
    missingIngredients: [],
    expiringCount: 0
  };

  const is100 = match.matchPercentage === 100 || match.isFullyCookable;
  const hasExpiring = match.expiringCount > 0 || (match.criticalExpiringCount && match.criticalExpiringCount > 0);

  // Match badge styling
  let badgeStyle = 'bg-stone-100 text-stone-700 border-stone-200';
  if (is100) {
    badgeStyle = 'bg-emerald-600 text-white border-emerald-700 shadow-sm';
  } else if (match.matchPercentage >= 60) {
    badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (match.matchPercentage >= 30) {
    badgeStyle = 'bg-amber-100 text-amber-800 border-amber-300';
  }

  const difficultyColors = {
    Easy: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    Medium: 'text-amber-700 bg-amber-50 border-amber-200',
    Hard: 'text-rose-700 bg-rose-50 border-rose-200'
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-beige/70 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col group">
      {/* Image container */}
      <div className="relative h-48 overflow-hidden bg-stone-100">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback image if unsplash link fails
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Match Percentage Pill */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wide flex items-center gap-1 backdrop-blur-sm ${badgeStyle}`}
          >
            {is100 ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Match
              </>
            ) : (
              `${match.matchPercentage}% Match`
            )}
          </span>

          {hasExpiring && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1 animate-pulse">
              <Flame className="w-3 h-3" /> Uses Expiring
            </span>
          )}
        </div>

        {/* Category tag */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/90 text-forest-dark backdrop-blur-sm">
            {recipe.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-forest-dark group-hover:text-forest transition-colors line-clamp-1 mb-1.5">
            {recipe.name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4">
            {recipe.description}
          </p>

          {/* Cooking meta */}
          <div className="flex items-center gap-3 text-xs text-stone-600 mb-4 pb-3 border-b border-beige/60">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              {recipe.cookingTime + (recipe.preparationTime || 0)} mins
            </span>
            <span
              className={`px-2 py-0.5 rounded-md font-semibold border text-[11px] ${
                difficultyColors[recipe.difficulty] || difficultyColors.Easy
              }`}
            >
              {recipe.difficulty}
            </span>
          </div>

          {/* Missing items status */}
          <div className="mb-4 text-xs font-medium">
            {is100 ? (
              <span className="text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                All ingredients ready in pantry!
              </span>
            ) : match.missingIngredients && match.missingIngredients.length > 0 ? (
              <span className="text-amber-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Missing {match.missingIngredients.length} item{match.missingIngredients.length > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="text-stone-500">
                Check pantry ingredients
              </span>
            )}
          </div>
        </div>

        {/* View Recipe CTA */}
        <Link
          to={`/recipes/${recipe._id}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-cream hover:bg-forest hover:text-white text-forest-dark border border-beige/80 transition-all duration-200"
        >
          <span>View Recipe</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;

