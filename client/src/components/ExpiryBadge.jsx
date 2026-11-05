import React from 'react';
import { getExpiryStatus } from '../utils/dateUtils';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

const ExpiryBadge = ({ expiryDate, customStatus }) => {
  const status = customStatus || getExpiryStatus(expiryDate);

  let icon = <CheckCircle className="w-3.5 h-3.5 mr-1" />;
  if (status.status === 'red') {
    icon = <AlertCircle className="w-3.5 h-3.5 mr-1" />;
  } else if (status.status === 'yellow') {
    icon = <Clock className="w-3.5 h-3.5 mr-1" />;
  } else if (status.status === 'none') {
    icon = null;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        status.badgeClass || 'bg-stone-100 text-stone-600 border-stone-200'
      }`}
      title={expiryDate ? `Expiry Date: ${new Date(expiryDate).toLocaleDateString()}` : 'No expiry date'}
    >
      {icon}
      {status.label || 'No Expiry'}
    </span>
  );
};

export default ExpiryBadge;
