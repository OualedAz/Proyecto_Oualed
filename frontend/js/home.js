/* ============================================================
   gesCasesRurals - Home Page Controller
   ============================================================ */

window.homePage = {
  async init() {
    this.loadFeaturedHouses();
    this.setupQuickSearch();
  },

  async loadFeaturedHouses() {
    const listContainer = document.getElementById('featured-houses-list');
    if (!listContainer) return;

    try {
      // Get all active houses
      const houses = await window.api.get('/casas');
      
      // Keep only first 3 houses for featured section
      const featured = houses.slice(0, 3);
      
      if (featured.length === 0) {
        listContainer.innerHTML = '<div style="grid-column: span 3; text-align: center; color: var(--text-muted);">No hay casas rurales disponibles actualmente.</div>';
        return;
      }

      listContainer.innerHTML = '';
      featured.forEach(house => {
        const card = document.createElement('div');
        card.className = 'house-card';

        // Choose image (fallback to sample photo from unsplash if none seeded)
        const imgPath = house.imagen_principal || '/assets/img/casa-placeholder.webp';

        card.innerHTML = `
          <div class="house-card-image">
            <img src="${imgPath}" alt="${window.utils.sanitizeHTML(house.nombre)}" onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'">
            <div class="house-card-price">${window.utils.formatCurrency(house.precio)}<span>/ noche</span></div>
          </div>
          <div class="house-card-content">
            <h3 class="house-card-title">${window.utils.sanitizeHTML(house.nombre)}</h3>
            <p class="house-card-desc">${window.utils.sanitizeHTML(house.descripcion)}</p>
            <div class="house-card-specs">
              <span class="house-card-spec-item"><i class="fa-solid fa-user-group"></i> ${house.capacidad} pers.</span>
              <span class="house-card-spec-item"><i class="fa-solid fa-bed"></i> ${house.num_habitaciones} hab.</span>
              <span class="house-card-spec-item"><i class="fa-solid fa-bath"></i> ${house.num_banos} baños</span>
            </div>
            <a href="#/casas/${house.id}" class="btn btn-primary" style="margin-top: auto; text-align: center;">
              Ver Detalles y Reservar
            </a>
          </div>
        `;
        
        listContainer.appendChild(card);
      });
    } catch (err) {
      listContainer.innerHTML = `<div style="grid-column: span 3; text-align: center; color: var(--danger);">Error al cargar las casas rurales destacadas: ${err.message}</div>`;
    }
  },

  setupQuickSearch() {
    const form = document.getElementById('quick-search-form');
    if (!form) return;

    // Set today as minimum entry date and tomorrow as minimum exit date
    const entradaInput = document.getElementById('search-entrada');
    const salidaInput = document.getElementById('search-salida');

    if (entradaInput && salidaInput) {
      const today = new Date().toISOString().split('T')[0];
      entradaInput.min = today;
      
      entradaInput.addEventListener('change', () => {
        if (entradaInput.value) {
          const nextDay = new Date(entradaInput.value);
          nextDay.setDate(nextDay.getDate() + 1);
          salidaInput.min = nextDay.toISOString().split('T')[0];
          
          if (!salidaInput.value || salidaInput.value <= entradaInput.value) {
            salidaInput.value = nextDay.toISOString().split('T')[0];
          }
        }
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const casaId = document.getElementById('search-casa').value;
      const entrada = document.getElementById('search-entrada').value;
      const salida = document.getElementById('search-salida').value;

      if (casaId !== 'all') {
        // Redirect to detail page with date pre-filled
        const queryParams = (entrada && salida) ? `?in=${entrada}&out=${salida}` : '';
        window.location.hash = `#/casas/${casaId}${queryParams}`;
      } else {
        // Redirect to catalog page with search criteria if wanted (for now just redirect to catalog)
        window.location.hash = `#/casas`;
      }
    });
  }
};
