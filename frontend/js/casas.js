/* ============================================================
   gesCasesRurals - Casas Catalog Controller
   ============================================================ */

window.casasPage = {
  allHouses: [],
  filters: {
    text: '',
    maxPrice: 250,
    minCapacity: 1,
    services: []
  },

  async init() {
    this.setupFilterListeners();
    await this.loadAllHouses();
  },

  async loadAllHouses() {
    const listContainer = document.getElementById('catalog-houses-list');
    if (!listContainer) return;

    try {
      // Get all active houses
      this.allHouses = await window.api.get('/casas');
      this.applyFilters();
    } catch (err) {
      listContainer.innerHTML = `<div style="grid-column: span 3; text-align: center; color: var(--danger);">Error al cargar el catálogo de casas: ${err.message}</div>`;
    }
  },

  setupFilterListeners() {
    const filterText = document.getElementById('filter-text');
    const filterPrice = document.getElementById('filter-price');
    const priceIndicator = document.getElementById('price-val-indicator');
    const filterCapacity = document.getElementById('filter-capacity');
    const clearBtn = document.getElementById('clear-filters-btn');
    const serviceCheckboxes = document.querySelectorAll('input[name="services"]');

    if (filterText) {
      filterText.value = this.filters.text;
      filterText.addEventListener('input', window.utils.debounce((e) => {
        this.filters.text = e.target.value.trim().toLowerCase();
        this.applyFilters();
      }, 250));
    }

    if (filterPrice) {
      filterPrice.value = this.filters.maxPrice;
      if (priceIndicator) priceIndicator.textContent = `${this.filters.maxPrice}€`;
      filterPrice.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        this.filters.maxPrice = val;
        if (priceIndicator) priceIndicator.textContent = `${val}€`;
        this.applyFilters();
      });
    }

    if (filterCapacity) {
      filterCapacity.value = this.filters.minCapacity;
      filterCapacity.addEventListener('change', (e) => {
        this.filters.minCapacity = parseInt(e.target.value);
        this.applyFilters();
      });
    }

    // Checkboxes change
    serviceCheckboxes.forEach(chk => {
      chk.checked = this.filters.services.includes(chk.value);
      chk.addEventListener('change', () => {
        const active = [];
        serviceCheckboxes.forEach(c => {
          if (c.checked) active.push(c.value);
        });
        this.filters.services = active;
        this.applyFilters();
      });
    });

    // Clear filters button
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.filters = {
          text: '',
          maxPrice: 250,
          minCapacity: 1,
          services: []
        };
        
        if (filterText) filterText.value = '';
        if (filterPrice) {
          filterPrice.value = 250;
          if (priceIndicator) priceIndicator.textContent = '250€';
        }
        if (filterCapacity) filterCapacity.value = '1';
        serviceCheckboxes.forEach(c => c.checked = false);

        this.applyFilters();
      });
    }
  },

  applyFilters() {
    const listContainer = document.getElementById('catalog-houses-list');
    const emptyState = document.getElementById('catalog-empty-state');
    if (!listContainer) return;

    // Filter houses list locally
    const filtered = this.allHouses.filter(house => {
      // 1. Text Search
      if (this.filters.text && !house.nombre.toLowerCase().includes(this.filters.text)) {
        return false;
      }
      
      // 2. Price filter
      if (parseFloat(house.precio) > this.filters.maxPrice) {
        return false;
      }
      
      // 3. Capacity filter
      if (house.capacidad < this.filters.minCapacity) {
        return false;
      }

      // 4. Services filter
      if (this.filters.services.length > 0) {
        const houseServices = house.servicios ? house.servicios.split(',') : [];
        const hasAllServices = this.filters.services.every(s => 
          houseServices.some(hs => hs.trim().toLowerCase() === s.trim().toLowerCase())
        );
        if (!hasAllServices) return false;
      }

      return true;
    });

    // Render results
    if (filtered.length === 0) {
      listContainer.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    listContainer.innerHTML = '';

    filtered.forEach(house => {
      const card = document.createElement('div');
      card.className = 'house-card';

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
  }
};
