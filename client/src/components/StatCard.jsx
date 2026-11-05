import React from 'react';

const StatCard = ({ title, value, unit, subtext, icon: Icon, color = 'forest', onClick }) => {
  const colorStyles = {
    forest: 'bg-forest/10 text-forest border-forest/20',
    sage: 'bg-sage/20 text-forest-dark border-sage/30',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-rose-100 text-rose-800 border-rose-200',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-beige/60 shadow-soft hover:shadow-card transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-sage' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-forest-dark">
              {value}
            </h3>
            {unit && <span className="text-sm font-semibold text-stone-500">{unit}</span>}
          </div>
          {subtext && (
            <p className="text-xs text-stone-500 mt-1 font-medium">{subtext}</p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${colorStyles[color] || colorStyles.forest}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

