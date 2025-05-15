
import { useToast as useToastHook, toast as toastFunction } from '@/components/ui/use-toast';

export const useToast = useToastHook;
export const toast = toastFunction;

export type { ToastProps } from '@/components/ui/toast';
