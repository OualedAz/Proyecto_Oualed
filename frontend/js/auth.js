/* ============================================================
   gesCasesRurals - Authentication & Session Management
   ============================================================ */

window.auth = {
  currentUser: null,

  init() {
    // Check if token and user info are stored
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
      } catch (err) {
        this.logout();
      }
    }

    this.setupDropdowns();
    this.updateNavbarUI();
  },

  async login(email, password) {
    try {
      const response = await window.api.post('/auth/login', { email, password });
      
      // Save session credentials
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      this.currentUser = response.user;

      this.updateNavbarUI();
      
      // Initialize notifications
      if (window.notifications) {
        window.notifications.startPolling();
      }

      window.utils.showToast('Inicio de sesión correcto.', 'success');
      return response.user;
    } catch (err) {
      throw err;
    }
  },

  async register(nombre, apellidos, email, telefono, password) {
    try {
      const response = await window.api.post('/auth/register', {
        nombre,
        apellidos,
        email,
        telefono,
        password
      });
      window.utils.showToast('Registro completado. Ya puedes iniciar sesión.', 'success');
      return response;
    } catch (err) {
      throw err;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser = null;
    
    // Stop notifications polling
    if (window.notifications) {
      window.notifications.stopPolling();
    }

    this.updateNavbarUI();
    window.utils.showToast('Sesión cerrada correctamente.', 'info');
    
    // Redirect to home
    window.location.hash = '#/';
  },

  updateNavbarUI() {
    const guestButtons = document.getElementById('guest-buttons');
    const userDropdown = document.getElementById('user-dropdown-container');
    const userDisplayName = document.getElementById('user-display-name');
    const userAvatarInitials = document.getElementById('user-avatar-initials');
    
    const menuPanel = document.getElementById('menu-item-panel');
    const menuAdmin = document.getElementById('menu-item-admin');
    const notifContainer = document.getElementById('notif-container');

    if (this.currentUser) {
      // User is logged in
      if (guestButtons) guestButtons.classList.add('hidden');
      if (userDropdown) userDropdown.classList.remove('hidden');
      if (notifContainer) notifContainer.classList.remove('hidden');

      // Set initials & name
      const name = this.currentUser.nombre || '';
      const surname = this.currentUser.apellidos || '';
      if (userDisplayName) userDisplayName.textContent = `${name} ${surname.split(' ')[0]}`;
      if (userAvatarInitials) {
        userAvatarInitials.textContent = (name.charAt(0) + surname.charAt(0)).toUpperCase();
      }

      // Show/hide Admin dashboard link
      if (this.currentUser.rol === 'admin') {
        if (menuAdmin) menuAdmin.classList.remove('hidden');
      } else {
        if (menuAdmin) menuAdmin.classList.add('hidden');
      }

      // Setup Notification badge
      if (window.notifications) {
        window.notifications.loadUnreadCount();
      }
    } else {
      // Guest user
      if (guestButtons) guestButtons.classList.remove('hidden');
      if (userDropdown) userDropdown.classList.add('hidden');
      if (notifContainer) notifContainer.classList.add('hidden');
    }
  },

  setupDropdowns() {
    const profileToggle = document.getElementById('user-profile-toggle');
    const dropdownMenu = document.getElementById('user-dropdown-menu');
    const notifBtn = document.getElementById('notif-bell-btn');
    const notifMenu = document.getElementById('notif-dropdown-menu');
    const logoutBtn = document.getElementById('logout-btn');

    // Profile Dropdown Toggle
    if (profileToggle && dropdownMenu) {
      profileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
        if (notifMenu) notifMenu.classList.remove('show'); // close other
      });
    }

    // Notifications Dropdown Toggle
    if (notifBtn && notifMenu) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifMenu.classList.toggle('show');
        if (dropdownMenu) dropdownMenu.classList.remove('show'); // close other
        if (notifMenu.classList.contains('show') && window.notifications) {
          window.notifications.loadDropdownList();
        }
      });
    }

    // Close dropdowns on document click
    document.addEventListener('click', () => {
      if (dropdownMenu) dropdownMenu.classList.remove('show');
      if (notifMenu) notifMenu.classList.remove('show');
    });

    // Logout Click
    if (logoutBtn) {
      // Remove any previously bound listener to prevent multi-call
      const newLogoutBtn = logoutBtn.cloneNode(true);
      logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
      newLogoutBtn.addEventListener('click', () => {
        this.logout();
      });
    }
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  window.auth.init();
});
