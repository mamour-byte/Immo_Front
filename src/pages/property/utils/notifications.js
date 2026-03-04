// Utilitaires de notification
export function showSuccess(message) {
  // Intégration avec react-hot-toast si disponible
  try {
    const toast = require('react-hot-toast').default;
    toast.success(message);
  } catch {
    console.log('Success:', message);
  }
}

export function showError(message) {
  try {
    const toast = require('react-hot-toast').default;
    toast.error(message);
  } catch {
    console.error('Error:', message);
  }
}

export function showWarning(message) {
  try {
    const toast = require('react-hot-toast').default;
    toast(message, { icon: '⚠️' });
  } catch {
    console.warn('Warning:', message);
  }
}
