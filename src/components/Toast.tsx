import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <div
      className={`fixed bottom-5 right-4 z-50 max-w-sm px-4 py-3 rounded-2xl bg-slate-900/95 border-2 border-amber-400 text-amber-100 shadow-2xl transition-all duration-500 flex items-center gap-3 font-ui-ar text-xs sm:text-sm ${
        message ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
        ✓
      </span>
      <span>{message || ''}</span>
    </div>
  );
};

