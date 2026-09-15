import React, { useState, useEffect } from 'react';
import { toastBus, type ToastEventData } from '../../../api/handlers/error/errorEvent';

export const ErrorToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastEventData[]>([]);

  useEffect(() => {
    const unsubscribe = toastBus.subscribe((newToast) => {
      setToasts((prev) => {
        if (prev.some((t) => t.error.code === newToast.error.code && t.error.message === newToast.error.message)) {
          return prev;
        }
        return [...prev, newToast];
      });
    });

    return () => unsubscribe();
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className="
      fixed
      top-5
      right-5
      z-[9999]
      flex
      flex-col
      gap-3
      w-[32rem]
      max-w-[calc(100vw-2rem)]
      pointer-events-none
    "
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="transition-all duration-300 ease-out"
        >
          <ToastItem
            toast={toast}
            onClose={removeToast}
          />
        </div>
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastEventData;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));

    const timer = setTimeout(() => {
      setIsVisible(false);

      setTimeout(() => {
        onClose(toast.id);
      }, 350);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const handleClose = () => {
    setIsVisible(false);

    setTimeout(() => {
      onClose(toast.id);
    }, 350);
  };

  return (
    <div
      className={`
        relative
        overflow-hidden
        pointer-events-auto
        bg-white/95
        backdrop-blur-md
        border
        border-sky-200
        rounded-xl
        shadow-xl
        p-4
        transition-all
        duration-300
        ease-out
        hover:scale-[1.02]
        hover:shadow-2xl
        ${isVisible
          ? "opacity-100 translate-x-0 scale-100"
          : "opacity-0 translate-x-16 scale-95"
        }
      `}
    >
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-sky-400 animate-[toastProgress_4s_linear_forwards]" />

      {/* Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-sky-500" />

      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-sky-900">
              {toast.error.type}
            </div>

            <div className="text-sm text-sky-800 mt-1">
              {toast.error.message}
            </div>

            <div className="mt-2">
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-sky-50 border border-sky-100 text-sky-600">
                {toast.error.code}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="ml-3 text-sky-400 hover:text-sky-700 transition cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};