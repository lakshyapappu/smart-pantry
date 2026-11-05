/**
 * Formats a Date object or ISO string to standard readable format (e.g. Nov 15, 2026).
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'No expiry';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'No expiry';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Calculates remaining days from now until expiry date.
 */
export const getDaysRemaining = (expiryDate) => {
  if (!expiryDate) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const exp = new Date(expiryDate);
  if (isNaN(exp.getTime())) return null;
  const expiry = new Date(exp.getFullYear(), exp.getMonth(), exp.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((expiry - today) / msPerDay);
};

/**
 * Returns dynamic expiry status level and label:
 * - none: no expiry date
 * - red: <= 1 day or expired
 * - yellow: 2-5 days
 * - green: > 5 days
 */
export const getExpiryStatus = (expiryDate) => {
  if (!expiryDate) {
    return {
      status: 'none',
      level: 'none',
      daysRemaining: null,
      label: 'No Expiry',
      badgeClass: 'bg-stone-100 text-stone-600 border-stone-200'
    };
  }

  const days = getDaysRemaining(expiryDate);
  if (days === null) {
    return {
      status: 'none',
      level: 'none',
      daysRemaining: null,
      label: 'No Expiry',
      badgeClass: 'bg-stone-100 text-stone-600 border-stone-200'
    };
  }

  if (days < 0) {
    return {
      status: 'red',
      level: 'danger',
      daysRemaining: days,
      label: 'Expired',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300'
    };
  } else if (days === 0) {
    return {
      status: 'red',
      level: 'danger',
      daysRemaining: 0,
      label: 'Expiring Today',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
    };
  } else if (days === 1) {
    return {
      status: 'red',
      level: 'danger',
      daysRemaining: 1,
      label: '1 Day Left',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300'
    };
  } else if (days <= 5) {
    return {
      status: 'yellow',
      level: 'warning',
      daysRemaining: days,
      label: `${days} Days Left`,
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300'
    };
  } else {
    return {
      status: 'green',
      level: 'fresh',
      daysRemaining: days,
      label: `${days} Days Left`,
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };
  }
};
