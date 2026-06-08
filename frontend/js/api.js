/* ============================================================
   gesCasesRurals - API Wrapper (fetch utility)
   ============================================================ */

const API_BASE_URL = '/api';

window.api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Set headers
    const headers = options.headers || {};
    
    // Auto-inject JWT token if available in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Set JSON content-type if body is JSON (and not FormData)
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        // Formatted validation errors list or single string error
        const errorMessage = data.error || (data.errors ? data.errors.map(e => e.message).join(', ') : 'Error inesperado.');
        const err = new Error(errorMessage);
        err.status = response.status;
        err.errors = data.errors || null;
        throw err;
      }

      return data;
    } catch (err) {
      console.error(`API Request Fail [${options.method || 'GET'} ${endpoint}]:`, err.message);
      throw err;
    }
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  // Specialized FormData call (e.g. for image uploads)
  postFormData(endpoint, formData) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData
      // Let fetch set Content-Type header with boundary automatically for FormData
    });
  }
};
