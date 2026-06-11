/* ============================================================
   gesCasesRurals - Notifications UI Manager
   ============================================================ */

window.notifications = {
  pollInterval: null,

  init() {
    if (window.auth && window.auth.currentUser) {
      this.startPolling();
    }
    
    // Bind mark all read button
    const markAllBtn = document.getElementById('notif-mark-all-btn');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.markAllAsRead();
      });
    }
  },

  startPolling() {
    this.stopPolling(); // Safety clear
    this.loadUnreadCount();
    // Poll every 45 seconds
    this.pollInterval = setInterval(() => {
      this.loadUnreadCount();
    }, 45000);
  },

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  },

  async loadUnreadCount() {
    if (!window.auth || !window.auth.currentUser) return;
    
    try {
      // Get unread notifications only
      const list = await window.api.get('/notificaciones?unread=true');
      const badge = document.getElementById('notif-count-badge');
      if (!badge) return;

      if (list.length > 0) {
        badge.textContent = list.length;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    } catch (err) {
      console.warn('Failed to load notifications count:', err.message);
    }
  },

  async loadDropdownList() {
    const listItemsContainer = document.getElementById('notif-list-items');
    if (!listItemsContainer) return;

    listItemsContainer.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <i class="fa-solid fa-circle-notch fa-spin" style="color: var(--primary);"></i>
      </div>
    `;

    try {
      const list = await window.api.get('/notificaciones'); // Get recent 50
      
      if (list.length === 0) {
        listItemsContainer.innerHTML = '<div class="notif-empty">No tienes nuevas notificaciones</div>';
        return;
      }

      listItemsContainer.innerHTML = '';
      list.forEach(notif => {
        const item = document.createElement('div');
        item.className = `notif-item ${notif.leida ? '' : 'unread'}`;
        item.innerHTML = `
          ${notif.leida ? '' : '<div class="notif-item-dot"></div>'}
          <div style="flex-grow:1;">
            <p>${notif.mensaje}</p>
            <span style="font-size:0.75rem; color:var(--text-muted); display:block; margin-top:4px;">
              ${window.utils.formatDate(notif.fecha)}
            </span>
          </div>
        `;
        
        // Mark as read on click
        if (!notif.leida) {
          item.addEventListener('click', async () => {
            await this.markAsRead(notif.id);
          });
        }

        listItemsContainer.appendChild(item);
      });
    } catch (err) {
      listItemsContainer.innerHTML = '<div class="notif-empty">Error al cargar notificaciones.</div>';
    }
  },

  async markAsRead(id) {
    try {
      await window.api.put(`/notificaciones/${id}/leida`);
      this.loadUnreadCount();
      this.loadDropdownList();
    } catch (err) {
      console.error('Error marking notification as read:', err.message);
    }
  },

  async markAllAsRead() {
    try {
      await window.api.put('/notificaciones/leidas');
      window.utils.showToast('Todas las notificaciones marcadas como leídas', 'success');
      this.loadUnreadCount();
      this.loadDropdownList();
    } catch (err) {
      console.error('Error marking all notifications as read:', err.message);
    }
  }
};

// Bind init
document.addEventListener('DOMContentLoaded', () => {
  window.notifications.init();
});
