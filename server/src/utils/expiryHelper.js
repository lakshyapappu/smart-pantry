/**
 * Expiry date helper for Smart Pantry.
 * Computes status dynamically:
 * - NONE: No expiry date provided (e.g. non-perishable / shelf-stable items)
 * - RED: 1 day remaining, expiring today, or already expired (<= 1 day)
 * - YELLOW: Between 2 and 5 days remaining (2 <= days <= 5)
 * - GREEN: More than 5 days remaining (> 5 days)
 */

function calculateExpiryStatus(expiryDate) {
  if (!expiryDate) {
    return {
      status: 'none',
      level: 'none',
      daysRemaining: null,
      label: 'No Expiry',
      badgeClass: 'bg-stone-100 text-stone-600 border-stone-200',
      isExpired: false,
      isExpiringSoon: false
    };
  }

  const now = new Date();
  // Normalize both dates to start of day in UTC / local consistency
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const exp = new Date(expiryDate);
  if (isNaN(exp.getTime())) {
    return {
      status: 'none',
      level: 'none',
      daysRemaining: null,
      label: 'No Expiry',
      badgeClass: 'bg-stone-100 text-stone-600 border-stone-200',
      isExpired: false,
      isExpiringSoon: false
    };
  }

  const expiryStart = new Date(exp.getFullYear(), exp.getMonth(), exp.getDate());
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.round((expiryStart - todayStart) / msPerDay);

  if (diffDays < 0) {
    return {
      status: 'red',
      level: 'danger',
      daysRemaining: diffDays,
      label: 'Expired',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      isExpired: true,
      isExpiringSoon: true
    };
  } else if (diffDays === 0) {
    return {
      status: 'red',
      level: 'danger',
      daysRemaining: 0,
      label: 'Expiring Today',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
      isExpired: false,
      isExpiringSoon: true
    };
  } else if (diffDays === 1) {
    return {
      status: 'red',
      level: 'danger',
      daysRemaining: 1,
      label: '1 Day Left',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      isExpired: false,
      isExpiringSoon: true
    };
  } else if (diffDays <= 5) {
    return {
      status: 'yellow',
      level: 'warning',
      daysRemaining: diffDays,
      label: `${diffDays} Days Left`,
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      isExpired: false,
      isExpiringSoon: true
    };
  } else {
    return {
      status: 'green',
      level: 'fresh',
      daysRemaining: diffDays,
      label: `${diffDays} Days Left`,
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      isExpired: false,
      isExpiringSoon: false
    };
  }
}

module.exports = {
  calculateExpiryStatus
};
