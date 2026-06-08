/* ============================================================
   gesCasesRurals - SPA Router
   ============================================================ */

const routes = {
  '/': { template: '/pages/home.html', auth: false, admin: false, init: () => window.homePage && window.homePage.init() },
  '/casas': { template: '/pages/casas.html', auth: false, admin: false, init: () => window.casasPage && window.casasPage.init() },
  '/casas/:id': { template: '/pages/casa-detalle.html', auth: false, admin: false, init: (id) => window.reservasPage && window.reservasPage.init(id) },
  '/login': { template: '/pages/login.html', auth: false, admin: false, init: () => initLoginView() },
  '/registro': { template: '/pages/registro.html', auth: false, admin: false, init: () => initRegisterView() },
  '/panel': { template: '/pages/panel.html', auth: true, admin: false, init: () => initPanelView() },
  '/admin': { template: '/pages/admin.html', auth: true, admin: true, init: () => window.adminPage && window.adminPage.init() }
};

class Router {
  constructor() {
    window.addEventListener('hashchange', () => this.handleRouting());
    window.addEventListener('DOMContentLoaded', () => this.handleRouting());
  }

  async handleRouting() {
    const rawHash = window.location.hash || '#/';
    let path = rawHash.replace('#', '');
    
    // Parse path parameters (e.g. /casas/3)
    let matchedRoute = null;
    let paramId = null;

    if (path.startsWith('/casas/') && path.split('/').length === 3) {
      paramId = path.split('/')[2];
      matchedRoute = routes['/casas/:id'];
    } else {
      matchedRoute = routes[path] || routes['/']; // Default fallback to home
    }

    // Check Authentication and Admin roles
    const user = window.auth && window.auth.currentUser;
    const isLoggedIn = !!user;
    const isAdmin = isLoggedIn && user.rol === 'admin';

    if (matchedRoute.auth && !isLoggedIn) {
      window.utils.showToast('Debes iniciar sesión para acceder a esta sección.', 'error');
      window.location.hash = '#/login';
      return;
    }

    if (matchedRoute.admin && !isAdmin) {
      window.utils.showToast('Acceso denegado. Se requieren permisos de administrador.', 'error');
      window.location.hash = '#/';
      return;
    }

    // Fetch and load template
    const appContent = document.getElementById('app-content');
    if (!appContent) return;

    // Display loader
    appContent.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 60vh;">
        <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 3rem; color: var(--primary);"></i>
      </div>
    `;

    try {
      const response = await fetch(matchedRoute.template);
      if (!response.ok) throw new Error('No se pudo cargar la vista.');
      const htmlContent = await response.text();
      
      appContent.innerHTML = htmlContent;

      // Update active nav-link highlighting
      this.updateActiveNavLink(path);

      // Trigger view init logic
      if (paramId) {
        matchedRoute.init(paramId);
      } else {
        matchedRoute.init();
      }
    } catch (err) {
      appContent.innerHTML = `
        <div class="text-center" style="padding: 100px 24px;">
          <i class="fa-solid fa-circle-exclamation" style="font-size: 4rem; color: var(--danger); margin-bottom: 20px;"></i>
          <h2>Error al cargar la página</h2>
          <p style="color: var(--text-muted); margin-top: 8px;">${err.message}</p>
          <a href="#/" class="btn btn-primary" style="margin-top:20px;">Volver al Inicio</a>
        </div>
      `;
    }
  }

  updateActiveNavLink(path) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      const routeAttr = link.getAttribute('data-route');
      if (routeAttr === 'home' && path === '/') {
        link.classList.add('active');
      } else if (routeAttr === 'casas' && path.startsWith('/casas')) {
        link.classList.add('active');
      }
    });
  }
}

// Instantiate router
window.router = new Router();

/* ============================================================
   LOCAL VIEW BINDINGS (Login, Register, Client Panel)
   ============================================================ */

// 1. LOGIN VIEW BINDING
function initLoginView() {
  const form = document.getElementById('login-form');
  const errorBanner = document.getElementById('login-error-banner');
  const submitBtn = document.getElementById('login-submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errorBanner) errorBanner.style.display = 'none';
    if (submitBtn) submitBtn.disabled = true;

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const user = await window.auth.login(email, password);
      // Redirect based on role
      if (user.rol === 'admin') {
        window.location.hash = '#/admin';
      } else {
        window.location.hash = '#/panel';
      }
    } catch (err) {
      if (errorBanner) {
        errorBanner.textContent = err.message;
        errorBanner.style.display = 'block';
      }
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// 2. REGISTER VIEW BINDING
function initRegisterView() {
  const form = document.getElementById('register-form');
  const errorBanner = document.getElementById('register-error-banner');
  const submitBtn = document.getElementById('register-submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errorBanner) errorBanner.style.display = 'none';

    const nombre = document.getElementById('register-name').value;
    const apellidos = document.getElementById('register-apellidos').value;
    const email = document.getElementById('register-email').value;
    const telefono = document.getElementById('register-telefono').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
      if (errorBanner) {
        errorBanner.textContent = 'Las contraseñas no coinciden.';
        errorBanner.style.display = 'block';
      }
      return;
    }

    if (submitBtn) submitBtn.disabled = true;

    try {
      await window.auth.register(nombre, apellidos, email, telefono, password);
      window.location.hash = '#/login';
    } catch (err) {
      if (errorBanner) {
        errorBanner.textContent = err.message;
        errorBanner.style.display = 'block';
      }
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// 3. CLIENT PANEL VIEW BINDING
async function initPanelView() {
  const user = window.auth.currentUser;
  if (!user) return;

  // Set welcome message
  const welcomeName = document.getElementById('panel-welcome-name');
  if (welcomeName) welcomeName.textContent = `¡Hola, ${user.nombre}!`;

  // Fetch client details to show registration date
  try {
    const profile = await window.api.get('/auth/profile');
    const welcomeMeta = document.getElementById('panel-welcome-meta');
    if (welcomeMeta && profile.fecha_registro) {
      welcomeMeta.textContent = `Miembro de gesCasesRurals desde: ${window.utils.formatDate(profile.fecha_registro)}`;
    }
    
    // Fill profile form values
    const formName = document.getElementById('profile-name');
    const formApellidos = document.getElementById('profile-apellidos');
    const formEmail = document.getElementById('profile-email');
    const formTelefono = document.getElementById('profile-telefono');
    
    if (formName) formName.value = profile.nombre || '';
    if (formApellidos) formApellidos.value = profile.apellidos || '';
    if (formEmail) formEmail.value = profile.email || '';
    if (formTelefono) formTelefono.value = profile.telefono || '';
  } catch (err) {
    console.error('Failed to load profile details:', err);
  }

  // Load client reservations
  loadClientReservations();

  // Tab bindings
  const tabReservasBtn = document.getElementById('tab-reservas-btn');
  const tabPerfilBtn = document.getElementById('tab-perfil-btn');
  const contentReservas = document.getElementById('panel-tab-reservas-content');
  const contentPerfil = document.getElementById('panel-tab-perfil-content');

  if (tabReservasBtn && tabPerfilBtn && contentReservas && contentPerfil) {
    tabReservasBtn.addEventListener('click', () => {
      tabReservasBtn.classList.add('active');
      tabPerfilBtn.classList.remove('active');
      contentReservas.classList.remove('hidden');
      contentPerfil.classList.add('hidden');
    });

    tabPerfilBtn.addEventListener('click', () => {
      tabPerfilBtn.classList.add('active');
      tabReservasBtn.classList.remove('active');
      contentPerfil.classList.remove('hidden');
      contentReservas.classList.add('hidden');
    });
  }

  // Bind Profile Form Submit
  const profileForm = document.getElementById('profile-update-form');
  const profileError = document.getElementById('profile-error-banner');
  const profileSuccess = document.getElementById('profile-success-banner');
  const profileSubmit = document.getElementById('profile-submit-btn');

  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (profileError) profileError.style.display = 'none';
      if (profileSuccess) profileSuccess.style.display = 'none';
      if (profileSubmit) profileSubmit.disabled = true;

      const updatedData = {
        nombre: document.getElementById('profile-name').value,
        apellidos: document.getElementById('profile-apellidos').value,
        email: document.getElementById('profile-email').value,
        telefono: document.getElementById('profile-telefono').value
      };

      try {
        await window.api.put('/auth/profile', updatedData);
        
        // Update credentials in localStorage
        const localUser = JSON.parse(localStorage.getItem('user'));
        localUser.nombre = updatedData.nombre;
        localUser.apellidos = updatedData.apellidos;
        localUser.email = updatedData.email;
        localStorage.setItem('user', JSON.stringify(localUser));
        window.auth.currentUser = localUser;
        window.auth.updateNavbarUI();

        if (welcomeName) welcomeName.textContent = `¡Hola, ${updatedData.nombre}!`;
        if (profileSuccess) {
          profileSuccess.textContent = 'Perfil actualizado correctamente.';
          profileSuccess.style.display = 'block';
        }
      } catch (err) {
        if (profileError) {
          profileError.textContent = err.message;
          profileError.style.display = 'block';
        }
      } finally {
        if (profileSubmit) profileSubmit.disabled = false;
      }
    });
  }
}

// Fetch and render client bookings
async function loadClientReservations() {
  const container = document.getElementById('client-bookings-list');
  const emptyState = document.getElementById('client-bookings-empty');
  if (!container) return;

  try {
    const list = await window.api.get('/reservas/mis-reservas');
    
    if (list.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    container.innerHTML = '';

    list.forEach(booking => {
      const card = document.createElement('div');
      card.className = 'my-booking-card';

      // Fallback image if house has no principal
      const imgPath = booking.imagen_principal || '/assets/img/casa-placeholder.webp';

      card.innerHTML = `
        <img class="my-booking-img" src="${imgPath}" alt="${window.utils.sanitizeHTML(booking.casa_nombre)}" onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'">
        <div class="my-booking-details">
          <h3 class="my-booking-house-name">${window.utils.sanitizeHTML(booking.casa_nombre)}</h3>
          <p class="my-booking-dates">
            <i class="fa-regular fa-calendar-days"></i>
            <span>${window.utils.formatDate(booking.fecha_entrada)}</span> al <span>${window.utils.formatDate(booking.fecha_salida)}</span>
          </p>
          <div class="my-booking-meta">
            <span><i class="fa-solid fa-user-group"></i> ${booking.num_personas} personas</span>
            <span>Solicitada: ${window.utils.formatDate(booking.fecha_reserva)}</span>
          </div>
        </div>
        <div class="my-booking-actions">
          <div class="my-booking-price">${window.utils.formatCurrency(booking.precio_total)}</div>
          <span class="status-tag ${booking.estado}">${booking.estado.toUpperCase()}</span>
          ${booking.estado === 'pendiente' ? `
            <button class="btn btn-secondary admin-btn-sm" style="color:var(--danger); border-color:rgba(211,47,47,0.2)" onclick="cancelarReservaCliente(${booking.id})">
              Cancelar solicitud
            </button>
          ` : ''}
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = `<div class="text-center" style="padding: 20px; color: var(--danger);">Error al cargar tus reservas: ${err.message}</div>`;
  }
}

// Client cancellation action
window.cancelarReservaCliente = async (id) => {
  if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;

  try {
    await window.api.put(`/reservas/${id}/cancelar`);
    window.utils.showToast('Reserva cancelada correctamente.', 'success');
    loadClientReservations(); // Reload list
  } catch (err) {
    window.utils.showToast(err.message, 'error');
  }
};
