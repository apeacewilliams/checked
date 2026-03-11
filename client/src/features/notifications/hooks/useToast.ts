import { toast } from 'sonner';

export const useToast = () => {
  const showSuccess = (msg: string) => toast.success(msg);
  const showError = (msg: string) => toast.error(msg);
  const showInfo = (msg: string) => toast.info(msg);

  return { showSuccess, showError, showInfo };
};
