"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000,
    );
  }, []);

  const remove = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const icons = { success: CheckCircle2, error: AlertCircle, info: Info };
  const colors = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };
  const iconColors = {
    success: "text-emerald-500",
    error: "text-red-500",
    info: "text-blue-500",
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className={cn(
                "flex items-start gap-3 p-4 rounded-2xl border shadow-lg animate-fade-up",
                colors[t.type],
              )}
            >
              <Icon
                size={18}
                className={cn("mt-0.5 flex-shrink-0", iconColors[t.type])}
              />
              <p className="text-sm font-medium flex-1">{t.message}</p>
              <button
                onClick={() => remove(t.id)}
                className="text-current opacity-50 hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback: use a simple event system for usage outside provider
    return {
      toast: (message: string, type: ToastType = "info") => {
        console.log(`[${type.toUpperCase()}] ${message}`);
      },
    };
  }
  return ctx;
}
