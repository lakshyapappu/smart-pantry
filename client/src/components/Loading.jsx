import React from 'react';

const Loading = ({ message = 'Loading...', size = 'default' }) => {
  const sizeClasses = size === 'small' ? 'w-6 h-6 border-2' : 'w-10 h-10 border-3';

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[200px] space-y-3">
      <div
        className={`${sizeClasses} border-forest/20 border-t-forest rounded-full animate-spin`}
      />
      {message && <p className="text-sm font-medium text-stone-600 animate-pulse">{message}</p>}
    </div>
  );
};

export default Loading;

