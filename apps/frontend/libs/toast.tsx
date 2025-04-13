// apps/frontend/lib/toast.tsx
import { toast as hotToast, Toaster as HotToaster } from "react-hot-toast";

// Reusable toast wrapper
export const toast = {
  success: (message: string) =>
    hotToast.success(message, {
      style: {
        background: "#22c55e",
        color: "#fff",
      },
    }),

  error: (message: string) =>
    hotToast.error(message, {
      style: {
        background: "#ef4444",
        color: "#fff",
      },
    }),

  info: (message: string) =>
    hotToast(message, {
      style: {
        background: "#3b82f6",
        color: "#fff",
      },
    }),
};

// Reusable Toaster component
export const Toaster = () => {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#333",
          color: "#fff",
        },
        success: {
          style: {
            background: "#22c55e",
          },
        },
        error: {
          style: {
            background: "#ef4444",
          },
        },
      }}
    />
  );
};