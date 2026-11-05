import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Refrigerator,
  UtensilsCrossed,
  ShoppingCart,
  Users,
  Flame,
  Leaf
} from 'lucide-react';

const Sidebar = ({ expiringCount = 0, pendingGroceryCount = 0 }) => {
  const links = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Pantry Tracker',
      path: '/pantry',
      icon: Refrigerator,
      badge: expiringCount > 0 ? `${expiringCount} expiring` : null,
      badgeClass: 'bg-rose-100 text-rose-800'
    },
    {
      name: 'Smart Recipes',
      path: '/recipes',
      icon: UtensilsCrossed,
      badge: null
    },
    {
      name: 'Grocery List',
      path: '/grocery-list',
      icon: ShoppingCart,
      badge: pendingGroceryCount > 0 ? pendingGroceryCount : null,
      badgeClass: 'bg-amber-100 text-amber-800'
    },
    {
      name: 'Community Wall',
      path: '/community',
      icon: Users,
      badge: null
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-beige/80 min-h-[calc(100vh-5rem)] p-4 shrink-0">
      <div className="space-y-1.5">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
          Kitchen Workspace
        </p>

        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-forest text-white shadow-soft'
                  : 'text-stone-700 hover:text-forest-dark hover:bg-cream'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <link.icon className={`w-4 h-4 ${isActive ? 'text-sage-light' : 'text-stone-500'}`} />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${link.badgeClass || 'bg-sage-soft text-forest'}`}>
                    {link.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Sustainable Kitchen Card */}
      <div className="mt-auto pt-6">
        <div className="bg-gradient-to-br from-forest-dark to-forest rounded-2xl p-4 text-white shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-sage/20 flex items-center justify-center text-sage">
              <Leaf className="w-4 h-4 text-sage-light" />
            </div>
            <span className="text-xs font-bold text-sage-light tracking-wide uppercase">
              Zero Waste Mission
            </span>
          </div>
          <p className="text-xs text-stone-200 leading-relaxed mb-3">
            Check ingredients expiring in the next 1-5 days to plan your meals without waste.
          </p>
          <NavLink
            to="/recipes?filter=expiring"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sage-light hover:text-white transition"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Cook Expiring Items &rarr;
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

