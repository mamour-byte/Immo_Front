// Utilitaires de notification
import toast from 'react-hot-toast';

export function showSuccess(message) {
  if (toast) {
    toast.success(message);
  } else {
    console.log('Success:', message);
  }
}

export function showError(message) {
  if (toast) {
    toast.error(message);
  } else {
    console.error('Error:', message);
  }
}

export function showWarning(message) {
  if (toast) {
    toast(message, { icon: '⚠️' });
  } else {
    console.warn('Warning:', message);
  }
}
