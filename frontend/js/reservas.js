/* ============================================================
   gesCasesRurals - Reservas/Booking Detail Controller
   ============================================================ */

window.reservasPage = {
  casaId: null,
  casaDetails: null,
  occupiedDates: [],

  async init(id) {
    this.casaId = id;
    
    const loadingState = document.getElementById('detail-loading-state');
    const contentWrapper = document.getElementById('detail-content-wrapper');
    if (loadingState) loadingState.classList.remove('hidden');
    if (contentWrapper) contentWrapper.classList.add('hidden');

    try {
      // 1. Fetch details and occupied dates in parallel
      const [details, dates] = await Promise.all([
        window.api.get(`/casas/${id}`),
        window.api.get(`/reservas/ocupadas/${id}`)
      ]);

      this.casaDetails = details;
      this.occupiedDates = dates.map(d => ({
        entrada: new Date(d.fecha_entrada),
        salida: new Date(d.fecha_salida)
      }));

      // 2. Render details
      this.renderDetails();
      
      // 3. Configure form
      this.setupBookingForm();

      if (loadingState) loadingState.classList.add('hidden');
      if (contentWrapper) contentWrapper.classList.remove('hidden');
    } catch (err) {
      console.error(err);
      if (loadingState) {
        loadingState.innerHTML = `
          <div class="text-center" style="padding: 40px 0;">
            <i class="fa-solid fa-circle-exclamation" style="font-size: 3rem; color: var(--danger); margin-bottom: 16px;"></i>
            <h3>Error al cargar detalles de la casa rural</h3>
            <p style="color:var(--text-muted); margin-top:8px;">${err.message}</p>
            <a href="#/casas" class="btn btn-primary" style="margin-top: 16px;">Volver al Catálogo</a>
          </div>
        `;
      }
    }
  },

  renderDetails() {
    const details = this.casaDetails;
    if (!details) return;

    // Fill titles & texts
    document.getElementById('detail-name').textContent = details.nombre;
    document.getElementById('detail-description').textContent = details.descripcion;
    document.getElementById('detail-spec-cap').textContent = details.capacidad;
    document.getElementById('detail-spec-rooms').textContent = details.num_habitaciones;
    document.getElementById('detail-spec-baths').textContent = details.num_banos;
    document.getElementById('detail-widget-price').textContent = window.utils.formatCurrency(details.precio);

    const metersSpan = document.getElementById('detail-spec-meters-span');
    if (details.metros) {
      document.getElementById('detail-spec-meters').textContent = details.metros;
      if (metersSpan) metersSpan.classList.remove('hidden');
    } else {
      if (metersSpan) metersSpan.classList.add('hidden');
    }

    // Render Gallery
    const mainImg = document.getElementById('detail-gallery-main-img');
    const principalImg = details.imagenes.find(img => img.es_principal === 1) || details.imagenes[0];
    const principalImgUrl = principalImg ? principalImg.ruta : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
    
    if (mainImg) {
      mainImg.src = principalImgUrl;
      mainImg.alt = details.nombre;
    }

    // Configure 4 thumbnails
    for (let i = 0; i < 4; i++) {
      const thumb = document.getElementById(`detail-thumb-${i}`);
      if (thumb) {
        const image = details.imagenes[i];
        if (image) {
          thumb.classList.remove('hidden');
          const imgTag = thumb.querySelector('img');
          if (imgTag) imgTag.src = image.ruta;
          
          // click event
          thumb.onclick = () => {
            document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            if (mainImg) mainImg.src = image.ruta;
          };
        } else {
          // Hide thumbnail if no image
          thumb.classList.add('hidden');
        }
      }
    }

    // Render Services/Amenities
    const servicesList = document.getElementById('detail-services-list');
    if (servicesList) {
      servicesList.innerHTML = '';
      const services = details.servicios ? details.servicios.split(',') : [];
      
      if (services.length === 0) {
        servicesList.innerHTML = '<span style="color:var(--text-muted)">No hay servicios registrados.</span>';
      } else {
        services.forEach(service => {
          const item = document.createElement('div');
          item.className = 'service-item';
          
          // Map icons dynamically
          let icon = 'fa-check';
          const sLower = service.trim().toLowerCase();
          if (sLower.includes('wifi')) icon = 'fa-wifi';
          else if (sLower.includes('barbacoa') || sLower.includes('bbq')) icon = 'fa-fire-burner';
          else if (sLower.includes('piscina') || sLower.includes('alberca')) icon = 'fa-water-ladder';
          else if (sLower.includes('jardín') || sLower.includes('patio')) icon = 'fa-tree';
          else if (sLower.includes('chimenea') || sLower.includes('leña')) icon = 'fa-fire';
          else if (sLower.includes('spa') || sLower.includes('jacuzzi') || sLower.includes('sauna')) icon = 'fa-hot-tub-person';
          else if (sLower.includes('parking') || sLower.includes('garaje')) icon = 'fa-square-parking';
          else if (sLower.includes('tv') || sLower.includes('televisión')) icon = 'fa-tv';
          else if (sLower.includes('lavadora')) icon = 'fa-soap';
          else if (sLower.includes('cocina')) icon = 'fa-kitchen-set';

          item.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${window.utils.sanitizeHTML(service.trim())}</span>
          `;
          servicesList.appendChild(item);
        });
      }
    }

    // Populate Guests Select List
    const guestSelect = document.getElementById('booking-guests');
    if (guestSelect) {
      guestSelect.innerHTML = '';
      for (let g = 1; g <= details.capacidad; g++) {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = `${g} ${g === 1 ? 'persona' : 'personas'}`;
        guestSelect.appendChild(opt);
      }
    }
  },

  setupBookingForm() {
    const user = window.auth && window.auth.currentUser;
    const isLoggedIn = !!user;

    const form = document.getElementById('booking-form');
    const entradaInput = document.getElementById('booking-entrada');
    const salidaInput = document.getElementById('booking-salida');
    const submitBtn = document.getElementById('booking-submit-btn');
    const loginPrompt = document.getElementById('booking-widget-prompt-login');
    const errorBanner = document.getElementById('booking-error-banner');

    if (!form || !entradaInput || !salidaInput) return;

    // Reset error message
    if (errorBanner) {
      errorBanner.style.display = 'none';
      errorBanner.textContent = '';
    }

    // Toggle authorization elements
    if (isLoggedIn) {
      if (loginPrompt) loginPrompt.classList.add('hidden');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Reservar Alojamiento';
      }
    } else {
      if (loginPrompt) loginPrompt.classList.remove('hidden');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Inicia sesión para reservar';
      }
    }

    // Set today as min entrada and configure cascade limits
    const todayStr = new Date().toISOString().split('T')[0];
    entradaInput.min = todayStr;
    
    entradaInput.addEventListener('change', () => {
      if (entradaInput.value) {
        const nextDay = new Date(entradaInput.value);
        nextDay.setDate(nextDay.getDate() + 1);
        salidaInput.min = nextDay.toISOString().split('T')[0];
        
        if (!salidaInput.value || salidaInput.value <= entradaInput.value) {
          salidaInput.value = nextDay.toISOString().split('T')[0];
        }
      }
      this.recalculatePrice();
    });

    salidaInput.addEventListener('change', () => {
      this.recalculatePrice();
    });

    // Check query params for quick-search redirects
    const hash = window.location.hash;
    if (hash.includes('?')) {
      const queryStr = hash.split('?')[1];
      const params = new URLSearchParams(queryStr);
      const inVal = params.get('in');
      const outVal = params.get('out');
      
      if (inVal && outVal) {
        entradaInput.value = inVal;
        
        const nextDay = new Date(inVal);
        nextDay.setDate(nextDay.getDate() + 1);
        salidaInput.min = nextDay.toISOString().split('T')[0];
        salidaInput.value = outVal;
        
        this.recalculatePrice();
      }
    }

    // Handle Form Submit
    form.onsubmit = async (e) => {
      e.preventDefault();
      if (!isLoggedIn) return;

      if (errorBanner) errorBanner.style.display = 'none';
      if (submitBtn) submitBtn.disabled = true;

      const reservaData = {
        casa_id: parseInt(this.casaId),
        fecha_entrada: entradaInput.value,
        fecha_salida: salidaInput.value,
        num_personas: parseInt(document.getElementById('booking-guests').value),
        observaciones: document.getElementById('booking-observaciones').value
      };

      try {
        const response = await window.api.post('/reservas', reservaData);
        window.utils.showToast(response.message, 'success');
        window.location.hash = '#/panel'; // Redirect to panel
      } catch (err) {
        if (errorBanner) {
          errorBanner.textContent = err.message;
          errorBanner.style.display = 'block';
        }
        if (submitBtn) submitBtn.disabled = false;
      }
    };
  },

  recalculatePrice() {
    const entradaInput = document.getElementById('booking-entrada');
    const salidaInput = document.getElementById('booking-salida');
    const breakdown = document.getElementById('booking-price-breakdown');
    const errorBanner = document.getElementById('booking-error-banner');
    const submitBtn = document.getElementById('booking-submit-btn');

    if (!entradaInput || !salidaInput || !breakdown || !this.casaDetails) return;

    if (errorBanner) {
      errorBanner.style.display = 'none';
      errorBanner.textContent = '';
    }
    
    // Safety enable if logged in
    const isLoggedIn = !!(window.auth && window.auth.currentUser);
    if (submitBtn && isLoggedIn) submitBtn.disabled = false;

    const entStr = entradaInput.value;
    const salStr = salidaInput.value;

    if (!entStr || !salStr) {
      breakdown.classList.add('hidden');
      return;
    }

    const entradaDate = new Date(entStr);
    const salidaDate = new Date(salStr);

    if (salidaDate <= entradaDate) {
      breakdown.classList.add('hidden');
      return;
    }

    // Check for overlap dates clientside
    const hasOverlap = this.occupiedDates.some(range => {
      return (entradaDate < range.salida && salidaDate > range.entrada);
    });

    if (hasOverlap) {
      breakdown.classList.add('hidden');
      if (errorBanner) {
        errorBanner.textContent = 'La casa rural ya está reservada para las fechas seleccionadas.';
        errorBanner.style.display = 'block';
      }
      if (submitBtn) submitBtn.disabled = true;
      return;
    }

    // Calculate nights
    const diffTime = Math.abs(salidaDate - entradaDate);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const pricePerNight = parseFloat(this.casaDetails.precio);
    const total = pricePerNight * nights;

    // Set texts
    document.getElementById('breakdown-label-nights').textContent = `${window.utils.formatCurrency(pricePerNight)} x ${nights} ${nights === 1 ? 'noche' : 'noches'}`;
    document.getElementById('breakdown-val-nights').textContent = window.utils.formatCurrency(total);
    document.getElementById('breakdown-val-total').textContent = window.utils.formatCurrency(total);

    breakdown.classList.remove('hidden');
  }
};
