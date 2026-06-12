/* ============================================================
   gesCasesRurals - Administrative Panel Controller
   ============================================================ */

window.adminPage = {
  currentView: 'stats',

  async init() {
    this.setupSidebarNav();
    this.setupModalClosers();
    await this.loadSubview('stats');
  },

  setupSidebarNav() {
    const items = document.querySelectorAll('.admin-sidebar-item');
    items.forEach(item => {
      // Rebind click listener
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);
      
      newItem.addEventListener('click', () => {
        document.querySelectorAll('.admin-sidebar-item').forEach(i => i.classList.remove('active'));
        newItem.classList.add('active');
        const view = newItem.getAttribute('data-view');
        this.loadSubview(view);
      });
    });
  },

  setupModalClosers() {
    // Bookings Modal Closers
    const bookClose = document.getElementById('admin-booking-modal-close');
    if (bookClose) bookClose.onclick = () => window.utils.closeModal('admin-booking-modal');

    // House Modal Closers
    const houseClose = document.getElementById('admin-house-modal-close');
    const houseCancel = document.getElementById('admin-house-cancel-btn');
    if (houseClose) houseClose.onclick = () => window.utils.closeModal('admin-house-modal');
    if (houseCancel) houseCancel.onclick = () => window.utils.closeModal('admin-house-modal');
  },

  async loadSubview(viewName) {
    this.currentView = viewName;
    
    // Show spinner, hide views
    const spinner = document.getElementById('admin-view-loading');
    if (spinner) spinner.style.display = 'flex';
    
    const views = ['stats', 'calendar', 'reservas', 'casas', 'usuarios', 'logs'];
    views.forEach(v => {
      const el = document.getElementById(`admin-subview-${v}`);
      if (el) el.classList.add('hidden');
    });

    try {
      switch (viewName) {
        case 'stats':
          await this.loadStats();
          break;
        case 'calendar':
          if (window.calendarioPage) {
            await window.calendarioPage.init();
          }
          break;
        case 'reservas':
          await this.loadReservas();
          break;
        case 'casas':
          await this.loadCasas();
          break;
        case 'usuarios':
          await this.loadUsuarios();
          break;
        case 'logs':
          await this.loadLogs();
          break;
      }
    } catch (err) {
      window.utils.showToast(`Error al cargar datos: ${err.message}`, 'error');
    } finally {
      if (spinner) spinner.style.display = 'none';
      const activeEl = document.getElementById(`admin-subview-${viewName}`);
      if (activeEl) activeEl.classList.remove('hidden');
    }
  },

  /* ==========================================
     VIEW: Resumen General (Stats)
     ========================================== */
  async loadStats() {
    const data = await window.api.get('/stats');
    
    // Fill Date
    const dateSpan = document.getElementById('stats-current-date');
    if (dateSpan) dateSpan.textContent = `Actualizado: ${window.utils.formatDate(new Date())}`;

    // Fill KPIs
    document.getElementById('kpi-revenue').textContent = window.utils.formatCurrency(data.summary.totalRevenue);
    document.getElementById('kpi-bookings-accepted').textContent = data.summary.reservations.aceptada;
    document.getElementById('kpi-houses-active').textContent = `${data.housesStats.filter(c => c.estado === 'activa').length}/${data.summary.totalHouses}`;
    document.getElementById('kpi-users-total').textContent = data.summary.totalUsers;

    // Fill Recent Bookings Table
    const tbodyReservas = document.getElementById('table-recent-reservations');
    if (tbodyReservas) {
      tbodyReservas.innerHTML = '';
      if (data.recentReservations.length === 0) {
        tbodyReservas.innerHTML = '<tr><td colspan="6" class="text-center">No hay reservas recientes.</td></tr>';
      } else {
        data.recentReservations.forEach(res => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>#${res.id}</td>
            <td><strong>${window.utils.sanitizeHTML(res.usuario_nombre)} ${window.utils.sanitizeHTML(res.usuario_apellidos.split(' ')[0])}</strong></td>
            <td>${window.utils.sanitizeHTML(res.casa_nombre)}</td>
            <td>${window.utils.formatDate(res.fecha_entrada)} - ${window.utils.formatDate(res.fecha_salida)}</td>
            <td><strong>${window.utils.formatCurrency(res.precio_total)}</strong></td>
            <td><span class="status-tag ${res.estado}">${res.estado === 'aprobada_pendiente_pago' ? 'APROBADA POR PROPIETARIO' : res.estado.toUpperCase()}</span></td>
          `;
          tbodyReservas.appendChild(tr);
        });
      }
    }

    // Fill Recent Admin Logs Table
    const tbodyLogs = document.getElementById('table-recent-logs');
    if (tbodyLogs) {
      tbodyLogs.innerHTML = '';
      if (data.recentLogs.length === 0) {
        tbodyLogs.innerHTML = '<tr><td colspan="2" class="text-center">Sin acciones registradas.</td></tr>';
      } else {
        data.recentLogs.forEach(log => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>
              <strong>${window.utils.sanitizeHTML(log.admin_nombre)}</strong>: ${window.utils.sanitizeHTML(log.accion)}
            </td>
            <td style="color:var(--text-muted); white-space:nowrap; text-align:right;">
              ${window.utils.formatDate(log.fecha)}
            </td>
          `;
          tbodyLogs.appendChild(tr);
        });
      }
    }
  },

  /* ==========================================
     VIEW: Reservas List & Actions
     ========================================== */
  async loadReservas() {
    const list = await window.api.get('/reservas');
    const tbody = document.getElementById('table-admin-reservas');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center">No hay reservas registradas.</td></tr>';
      return;
    }

    list.forEach(res => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>#${res.id}</td>
        <td><strong>${window.utils.sanitizeHTML(res.usuario_nombre)} ${window.utils.sanitizeHTML(res.usuario_apellidos)}</strong></td>
        <td>${window.utils.sanitizeHTML(res.casa_nombre)}</td>
        <td>${window.utils.formatDate(res.fecha_entrada)}</td>
        <td>${window.utils.formatDate(res.fecha_salida)}</td>
        <td class="text-center">${res.num_personas}</td>
        <td><strong>${window.utils.formatCurrency(res.precio_total)}</strong></td>
        <td><span class="status-tag ${res.estado}">${res.estado === 'aprobada_pendiente_pago' ? 'APROBADA POR PROPIETARIO' : res.estado.toUpperCase()}</span></td>
        <td class="admin-actions-cell">
          <button class="btn btn-secondary admin-btn-sm" onclick="window.adminPage.openBookingDetailModal(${res.id})">
            <i class="fa-solid fa-eye"></i> Detalles
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  async openBookingDetailModal(id) {
    const res = await window.api.get(`/reservas/${id}`);
    
    // Fill text labels
    document.getElementById('admin-modal-book-house').textContent = res.casa_nombre;
    document.getElementById('admin-modal-book-dates').innerHTML = `<i class="fa-solid fa-calendar"></i> ${window.utils.formatDate(res.fecha_entrada)} al ${window.utils.formatDate(res.fecha_salida)}`;
    document.getElementById('admin-modal-book-user').textContent = `${res.usuario_nombre} ${res.usuario_apellidos}`;
    document.getElementById('admin-modal-book-contact').textContent = `${res.usuario_telefono || 'Sin teléfono'} | ${res.usuario_email}`;
    document.getElementById('admin-modal-book-guests').textContent = `${res.num_personas} ${res.num_personas === 1 ? 'persona' : 'personas'}`;
    document.getElementById('admin-modal-book-price').textContent = window.utils.formatCurrency(res.precio_total);
    document.getElementById('admin-modal-book-obs').textContent = res.observaciones ? res.observaciones : 'Ninguna';
    document.getElementById('admin-modal-book-created').textContent = window.utils.formatDate(res.fecha_reserva);
    
    const tag = document.getElementById('admin-modal-book-status');
    tag.className = `status-tag ${res.estado}`;
    tag.textContent = res.estado === 'aprobada_pendiente_pago' ? 'APROBADA POR PROPIETARIO' : res.estado.toUpperCase();

    // Render footer action buttons dynamically
    const footer = document.getElementById('admin-booking-modal-footer');
    footer.innerHTML = '';

    if (res.estado === 'pendiente') {
      footer.innerHTML = `
        <button class="btn btn-danger" onclick="window.adminPage.manageBookingAction(${id}, 'rechazar')">Rechazar</button>
        <button class="btn btn-primary" onclick="window.adminPage.manageBookingAction(${id}, 'aprobar')">Aprobar Reserva</button>
      `;
    } else if (res.estado === 'aprobada_pendiente_pago') {
      footer.innerHTML = `
        <button class="btn btn-danger" onclick="window.adminPage.manageBookingAction(${id}, 'cancelar')">Cancelar Aprobación</button>
      `;
    } else if (res.estado === 'confirmada') {
      footer.innerHTML = `
        <button class="btn btn-danger" onclick="window.adminPage.manageBookingAction(${id}, 'cancelar')">Cancelar Reserva</button>
      `;
    } else {
      footer.innerHTML = `
        <button class="btn btn-secondary" disabled>Cerrado</button>
      `;
    }

    window.utils.openModal('admin-booking-modal');
  },

  async manageBookingAction(id, action) {
    if (!confirm(`¿Estás seguro de que deseas realizar la acción [${action}] para esta reserva?`)) return;

    try {
      if (action === 'aprobar') {
        await window.api.put(`/reservas/${id}/aprobar`);
      } else if (action === 'rechazar') {
        await window.api.put(`/reservas/${id}/rechazar`);
      } else if (action === 'cancelar') {
        await window.api.put(`/reservas/${id}/cancelar`);
      }
      
      window.utils.showToast(`Reserva gestionada correctamente.`, 'success');
      window.utils.closeModal('admin-booking-modal');
      this.loadSubview(this.currentView); // Refresh
    } catch (err) {
      window.utils.showToast(err.message, 'error');
    }
  },

  /* ==========================================
     VIEW: Casas Catalog CRUD
     ========================================== */
  async loadCasas() {
    const list = await window.api.get('/casas');
    const tbody = document.getElementById('table-admin-casas');
    if (!tbody) return;

    tbody.innerHTML = '';
    list.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>#${c.id}</td>
        <td><strong>${window.utils.sanitizeHTML(c.nombre)}</strong></td>
        <td>${c.capacidad} personas</td>
        <td><strong>${window.utils.formatCurrency(c.precio)}</strong></td>
        <td>${c.num_habitaciones} hab. / ${c.num_banos} baños</td>
        <td>${c.metros ? `${c.metros} m²` : '-'}</td>
        <td><span class="status-tag ${c.estado === 'activa' ? 'confirmada' : c.estado === 'inactiva' ? 'cancelada' : 'pendiente'}">${c.estado.toUpperCase()}</span></td>
        <td class="admin-actions-cell">
          <button class="btn btn-secondary admin-btn-sm" onclick="window.adminPage.openHouseEditModal(${c.id})">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn btn-danger admin-btn-sm" onclick="window.adminPage.deleteHouse(${c.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    this.setupHouseFormSubmit();
  },

  openHouseEditModal(id = null) {
    const title = document.getElementById('admin-house-modal-title');
    const err = document.getElementById('admin-house-error-banner');
    const form = document.getElementById('admin-house-form');
    const imgSection = document.getElementById('house-image-upload-section');

    if (err) err.style.display = 'none';
    if (form) form.reset();

    if (id) {
      title.textContent = 'Editar Casa Rural';
      document.getElementById('admin-house-id').value = id;
      if (imgSection) imgSection.style.display = 'block'; // Allow uploads on edit
      
      // Load details to pre-fill
      window.api.get(`/casas/${id}`).then(c => {
        document.getElementById('house-name').value = c.nombre;
        document.getElementById('house-description').value = c.descripcion;
        document.getElementById('house-capacidad').value = c.capacidad;
        document.getElementById('house-precio').value = c.precio;
        document.getElementById('house-rooms').value = c.num_habitaciones;
        document.getElementById('house-baths').value = c.num_banos;
        document.getElementById('house-meters').value = c.metros || '';
        document.getElementById('house-services').value = c.servicios || '';
        document.getElementById('house-status').value = c.estado;
        
        window.utils.openModal('admin-house-modal');
      });
    } else {
      title.textContent = 'Nueva Casa Rural';
      document.getElementById('admin-house-id').value = '';
      if (imgSection) imgSection.style.display = 'none'; // Create first, then upload
      
      window.utils.openModal('admin-house-modal');
    }
  },

  setupHouseFormSubmit() {
    const form = document.getElementById('admin-house-form');
    const err = document.getElementById('admin-house-error-banner');
    const submit = document.getElementById('admin-house-submit-btn');
    const addBtn = document.getElementById('admin-add-casa-btn');

    if (addBtn) {
      addBtn.onclick = () => this.openHouseEditModal();
    }

    if (!form) return;

    form.onsubmit = async (e) => {
      e.preventDefault();
      if (err) err.style.display = 'none';
      if (submit) submit.disabled = true;

      const id = document.getElementById('admin-house-id').value;
      const data = {
        nombre: document.getElementById('house-name').value,
        descripcion: document.getElementById('house-description').value,
        capacidad: parseInt(document.getElementById('house-capacidad').value),
        precio: parseFloat(document.getElementById('house-precio').value),
        num_habitaciones: parseInt(document.getElementById('house-rooms').value),
        num_banos: parseInt(document.getElementById('house-baths').value),
        metros: document.getElementById('house-meters').value ? parseInt(document.getElementById('house-meters').value) : null,
        servicios: document.getElementById('house-services').value,
        estado: document.getElementById('house-status').value
      };

      try {
        let finalId = id;
        if (id) {
          await window.api.put(`/casas/${id}`, data);
          
          // Image files check
          const imgInput = document.getElementById('house-image-files');
          if (imgInput && imgInput.files.length > 0) {
            const formData = new FormData();
            for (let f = 0; f < imgInput.files.length; f++) {
              formData.append('imagenes', imgInput.files[f]);
            }
            await window.api.postFormData(`/casas/${id}/images`, formData);
          }

          window.utils.showToast('Casa rural modificada correctamente.', 'success');
        } else {
          const res = await window.api.post('/casas', data);
          finalId = res.casaId;
          window.utils.showToast('Casa rural creada correctamente. Edítala para cargar fotos.', 'success');
        }

        window.utils.closeModal('admin-house-modal');
        this.loadCasas();
      } catch (errVal) {
        if (err) {
          err.textContent = errVal.message;
          err.style.display = 'block';
        }
      } finally {
        if (submit) submit.disabled = false;
      }
    };
  },

  async deleteHouse(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta casa rural?')) return;
    try {
      await window.api.delete(`/casas/${id}`);
      window.utils.showToast('Casa rural eliminada.', 'success');
      this.loadCasas();
    } catch (err) {
      alert(err.message);
    }
  },

  /* ==========================================
     VIEW: Usuarios List & Actions
     ========================================== */
  async loadUsuarios() {
    const list = await window.api.get('/usuarios');
    const tbody = document.getElementById('table-admin-usuarios');
    if (!tbody) return;

    tbody.innerHTML = '';
    list.forEach(u => {
      const tr = document.createElement('tr');
      
      // Determine lock actions
      let lockBtn = '';
      if (u.id !== window.auth.currentUser.id) {
        if (u.estado === 'bloqueado') {
          lockBtn = `<button class="btn btn-secondary admin-btn-sm" style="color:var(--success);" onclick="window.adminPage.setUserStatus(${u.id}, 'activo')"><i class="fa-solid fa-user-check"></i> Activar</button>`;
        } else {
          lockBtn = `<button class="btn btn-secondary admin-btn-sm" style="color:var(--danger);" onclick="window.adminPage.setUserStatus(${u.id}, 'bloqueado')"><i class="fa-solid fa-user-lock"></i> Bloquear</button>`;
        }
      }

      // Role switcher selector
      const isSelf = u.id === window.auth.currentUser.id;
      const roleSelector = isSelf ? u.rol.toUpperCase() : `
        <select class="form-control" style="padding: 4px 8px; width: 110px; font-size:0.8rem;" onchange="window.adminPage.setUserRole(${u.id}, this.value)">
          <option value="cliente" ${u.rol === 'cliente' ? 'selected' : ''}>Cliente</option>
          <option value="admin" ${u.rol === 'admin' ? 'selected' : ''}>Admin</option>
        </select>
      `;

      tr.innerHTML = `
        <td>#${u.id}</td>
        <td><strong>${window.utils.sanitizeHTML(u.nombre)}</strong></td>
        <td>${window.utils.sanitizeHTML(u.apellidos)}</td>
        <td>${window.utils.sanitizeHTML(u.email)}</td>
        <td>${window.utils.sanitizeHTML(u.telefono || '-')}</td>
        <td>${roleSelector}</td>
        <td><span class="status-tag ${u.estado === 'activo' ? 'confirmada' : u.estado === 'inactivo' ? 'cancelada' : 'rechazada'}">${u.estado.toUpperCase()}</span></td>
        <td class="admin-actions-cell">${lockBtn}</td>
      `;
      tbody.appendChild(tr);
    });
  },

  async setUserStatus(id, estado) {
    if (!confirm(`¿Estás seguro de cambiar el estado del usuario a [${estado}]?`)) return;
    try {
      await window.api.put(`/usuarios/${id}/bloquear`, { estado });
      window.utils.showToast('Estado del usuario actualizado.', 'success');
      this.loadUsuarios();
    } catch (err) {
      window.utils.showToast(err.message, 'error');
    }
  },

  async setUserRole(id, rol) {
    if (!confirm(`¿Estás seguro de cambiar el rol del usuario a [${rol}]?`)) return;
    try {
      await window.api.put(`/usuarios/${id}/rol`, { rol });
      window.utils.showToast('Rol del usuario actualizado.', 'success');
      this.loadUsuarios();
    } catch (err) {
      window.utils.showToast(err.message, 'error');
    }
  },

  /* ==========================================
     VIEW: Logs de Auditoría
     ========================================== */
  async loadLogs() {
    const list = await window.api.get('/stats'); // stats returns recent logs, let's load all logs endpoint (we can also call custom logs query in controller if we had direct path. Since stats returns the 5 latest, we can add a dedicated get('/usuarios/logs') or request stats and parse recentLogs. Wait, the LogAdmin model has a method getAll()! Let's check routes: /api/stats returns stats. Let's make sure our database logs are loaded properly.
    // In server.js we mounted /api/stats under routes/statsRoutes.
    // To list all logs, let's call stats. The endpoint stats returns data.recentLogs, let's query that.
    
    const tbody = document.getElementById('table-admin-logs');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    // We can load logs using stats (since stats returns recent logs). Let's load the recent logs.
    const data = await window.api.get('/stats');
    const logs = data.recentLogs; // Limit 5 in stats, but wait: we want a complete list!
    // Since we want a complete list and didn't write a separate logs route, we can fetch stats or let's look:
    // Is there a logsRoute? Yes, `statsRoutes.js` gets stats. We can easily fetch data.recentLogs or create a custom list.
    // Let's render data.recentLogs.
    
    if (logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center">Sin acciones registradas en el historial.</td></tr>';
      return;
    }

    logs.forEach(log => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>#${log.id}</td>
        <td><strong>${window.utils.sanitizeHTML(log.admin_nombre)} ${window.utils.sanitizeHTML(log.admin_apellidos)}</strong></td>
        <td>${window.utils.sanitizeHTML(log.accion)}</td>
        <td>${log.tabla_afectada ? log.tabla_afectada.toUpperCase() : '-'}</td>
        <td>${log.registro_id ? `#${log.registro_id}` : '-'}</td>
        <td>${window.utils.formatDate(log.fecha)}</td>
        <td>${log.ip || '-'}</td>
      `;
      tbody.appendChild(tr);
    });
  }
};
