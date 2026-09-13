import type { ApiErrorDTO } from "../../../contracts/dto/common/api-error-dto";

export interface ToastEventData {
  id: string;
  error: ApiErrorDTO;
  severity: 'error' | 'success' | 'info';
}

type ToastListener = (toast: ToastEventData) => void;

class ToastEventEmitter {
  private listeners = new Set<ToastListener>();

  subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emitError(errorDto: ApiErrorDTO) {
    const id = Math.random().toString(36).substring(2, 9);
    this.listeners.forEach((listener) => listener({ id, error: errorDto, severity: 'error' }));
  }
}

export const toastBus = new ToastEventEmitter();