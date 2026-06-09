import { CheckCircle2, Info, X } from "lucide-react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface ToastMessage {
  id: number;
  message: string;
  tone: "success" | "info";
}

interface ToastContextValue {
  notify: (message: string, tone?: ToastMessage["tone"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, tone: ToastMessage["tone"] = "success") => {
      const id = Date.now();
      setToasts((current) => [...current, { id, message, tone }]);
      window.setTimeout(() => removeToast(id), 2800);
    },
    [removeToast],
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"
      >
        {toasts.map((toast) => {
          const Icon = toast.tone === "success" ? CheckCircle2 : Info;

          return (
            <div
              key={toast.id}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800 shadow-xl"
              role="status"
            >
              <Icon
                className={
                  toast.tone === "success"
                    ? "mt-0.5 h-5 w-5 flex-none text-green-600"
                    : "mt-0.5 h-5 w-5 flex-none text-blue-700"
                }
                aria-hidden="true"
              />
              <p className="flex-1 font-medium">{toast.message}</p>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => removeToast(toast.id)}
                className="min-h-11 min-w-11 rounded-full text-slate-500 hover:bg-slate-100"
              >
                <X className="mx-auto h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
