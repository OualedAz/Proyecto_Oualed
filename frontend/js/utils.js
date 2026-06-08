/* ============================================================
   gesCasesRurals - JS Utilities
   ============================================================ */

window.utils = {
  // Toast notifications
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Choose icon based on type
    let icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-xmark';
    if (type === 'info') icon = 'fa-circle-info';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Fade out and remove after 4 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 4000);
  },

  // Format Date (YYYY-MM-DD or ISO String to DD/MM/YYYY)
  formatDate(dateString) {
    if (!dateString) return '-';
    // Handle DATE formats (which can localise oddly due to timezone shifts)
    if (dateString.length === 10) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  },

  // Format Currency (€)
  formatCurrency(value) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  },

  // Sanitize input to prevent XSS
  sanitizeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  },

  // Modal open/close controls
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden'; // Lock scroll
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = ''; // Unlock scroll
    }
  },

  // Simple debounce helper
  debounce(func, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }
};
