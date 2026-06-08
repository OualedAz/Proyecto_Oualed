/* ============================================================
   gesCasesRurals - Admin Gantt Calendar Controller
   ============================================================ */

window.calendarioPage = {
  currentDate: new Date(),
  months: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],

  async init() {
    this.setupControls();
    await this.renderCalendar();
  },

  setupControls() {
    const prevBtn = document.getElementById('scheduler-prev-btn');
    const nextBtn = document.getElementById('scheduler-next-btn');
    const refreshBtn = document.getElementById('scheduler-refresh-btn');

    if (prevBtn) {
      prevBtn.onclick = async () => {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        await this.renderCalendar();
      };
    }

    if (nextBtn) {
      nextBtn.onclick = async () => {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        await this.renderCalendar();
      };
    }

    if (refreshBtn) {
      refreshBtn.onclick = async () => {
        await this.renderCalendar();
      };
    }
  },

  async renderCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // 1. Update Month Label
    const label = document.getElementById('scheduler-month-label');
    if (label) label.textContent = `${this.months[month]} ${year}`;

    // 2. Calculate days in month
    const totalDays = new Date(year, month + 1, 0).getDate();

    // 3. Generate Table Headers (Days 1 to totalDays)
    const theadRow = document.getElementById('scheduler-thead-days');
    if (!theadRow) return;
    
    // Clear old day columns (keep first column which is "Casa Rural")
    theadRow.innerHTML = '<th class="house-col">Casa Rural</th>';
    
    for (let day = 1; day <= totalDays; day++) {
      const th = document.createElement('th');
      th.style.width = '32px';
      
      // Mark weekend headers
      const dayOfWeek = new Date(year, month, day).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        th.style.backgroundColor = '#eae7e0';
      }
      
      th.textContent = day;
      theadRow.appendChild(th);
    }

    // 4. Fetch active houses and bookings in parallel
    const tbody = document.getElementById('scheduler-tbody-houses');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="32" class="text-center">Cargando disponibilidad...</td></tr>';

    try {
      const houses = await window.api.get('/casas');
      tbody.innerHTML = '';

      for (const house of houses) {
        const tr = document.createElement('tr');
        
        // House name cell
        const nameCell = document.createElement('td');
        nameCell.className = 'house-col';
        nameCell.innerHTML = `<strong>${window.utils.sanitizeHTML(house.nombre)}</strong><br><small style="color:var(--text-muted);">${window.utils.formatCurrency(house.precio)}/noche</small>`;
        tr.appendChild(nameCell);

        // Fetch accepted occupied dates for this house
        const occupied = await window.api.get(`/reservas/ocupadas/${house.id}`);
        const parsedRanges = occupied.map(o => ({
          entrada: o.fecha_entrada, // YYYY-MM-DD
          salida: o.fecha_salida   // YYYY-MM-DD
        }));

        // Render day cells
        for (let day = 1; day <= totalDays; day++) {
          const td = document.createElement('td');
          td.className = 'scheduler-day-cell';
          
          // Determine dayOfWeek for weekend highlight
          const dateObj = new Date(year, month, day);
          const dayOfWeek = dateObj.getDay();
          const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
          if (isWeekend) td.classList.add('weekend');

          // Format current date as YYYY-MM-DD (safe format for string matching)
          const cellYear = dateObj.getFullYear();
          const cellMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
          const cellDay = String(dateObj.getDate()).padStart(2, '0');
          const cellDateString = `${cellYear}-${cellMonth}-${cellDay}`;

          // Check if day falls within any reservation range (checkin day is occupied, checkout day is free)
          const isOccupied = parsedRanges.some(range => {
            return (cellDateString >= range.entrada && cellDateString < range.salida);
          });

          if (isOccupied) {
            td.classList.add('occupied');
            td.title = `${house.nombre}: Ocupado`;
          } else {
            td.title = `${house.nombre}: Libre (${day}/${month + 1}/${year})`;
          }

          tr.appendChild(td);
        }

        tbody.appendChild(tr);
      }
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="32" class="text-center" style="color:var(--danger)">Error al cargar calendario: ${err.message}</td></tr>`;
    }
  }
};
