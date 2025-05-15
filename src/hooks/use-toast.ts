
// Import from the toast component
import { type ToastProps } from '@/components/ui/toast';
import { useToast as useToastOriginal, toast as toastOriginal } from 'sonner';

// Re-export with our app's configuration
export const useToast = useToastOriginal;
export const toast = toastOriginal;

export type { ToastProps };
