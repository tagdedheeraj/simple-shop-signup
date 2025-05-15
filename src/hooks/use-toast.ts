
// Import from the toast component
import { type ToastProps } from '@/components/ui/toast';
import { toast } from 'sonner';

// Re-export with our app's configuration
export const useToast = () => {
  return {
    toast,
    // This matches the expected structure in the Toaster component
    toasts: [],
    dismiss: toast.dismiss,
    error: toast.error,
    success: toast.success,
    info: toast
  };
};

export { toast };
export type { ToastProps };
