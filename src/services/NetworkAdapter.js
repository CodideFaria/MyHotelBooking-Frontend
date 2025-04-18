class NetworkAdapter {
  static #API_URL = 'http://localhost:8887';
  static authCheckCallback = null;

  // Allow registration of the auth check callback
  static setAuthCheckCallback(callback) {
    this.authCheckCallback = callback;
  }

  // Helper that wraps fetch and handles 401 by trying to refresh the token
  async fetchWithRefresh(url, options, attemptedRefresh = false) {
    let response = await fetch(url, options);

    // If unauthorized and we haven't tried refreshing yet
    if (response.status === 401 && !attemptedRefresh) {
      const token = localStorage.getItem('token');
      // Call the refresh endpoint; adjust method and payload as needed
      const refreshUrl = new URL('/api/auth-user', NetworkAdapter.#API_URL);
      const refreshResponse = await fetch(refreshUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (refreshResponse.status === 200) {
        const refreshData = await refreshResponse.json();
        // Update the stored token with the new one received
        localStorage.setItem('token', refreshData.token);
        // Update the Authorization header in the original request options
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${refreshData.token}`,
        };
        // Call the auth check callback to update the auth context
        if (NetworkAdapter.authCheckCallback) {
          NetworkAdapter.authCheckCallback();
        }
        // Retry the original request with the new token (mark refresh as attempted)
        response = await this.fetchWithRefresh(url, options, true);
      } else {
        // If refresh fails, trigger the global auth callback (e.g., log out)
        if (NetworkAdapter.authCheckCallback) {
          NetworkAdapter.authCheckCallback();
        }
      }
    }
    return response;
  }

  async get(endpoint, params = {}) {
    const url = new URL(endpoint, NetworkAdapter.#API_URL);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    try {
      const response = await this.fetchWithRefresh(url.toString(), { headers });
      return await response.json();
    } catch (error) {
      return { data: {}, errors: [error.message] };
    }
  }

  async post(endpoint, data = {}) {
    const url = new URL(endpoint, NetworkAdapter.#API_URL);
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    try {
      const response = await this.fetchWithRefresh(url.toString(), {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { data: {}, errors: [error.message] };
    }
  }

  async put(endpoint, data = {}) {
    const url = new URL(endpoint, NetworkAdapter.#API_URL);
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    try {
      const response = await this.fetchWithRefresh(url.toString(), {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { data: {}, errors: [error.message] };
    }
  }

  async delete(endpoint) {
    const url = new URL(endpoint, NetworkAdapter.#API_URL);
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    try {
      const response = await this.fetchWithRefresh(url.toString(), {
        method: 'DELETE',
        headers,
      });
      return await response.json();
    } catch (error) {
      return { data: {}, errors: [error.message] };
    }
  }

  async patch(endpoint, data = {}) {
    const url = new URL(endpoint, NetworkAdapter.#API_URL);
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    try {
      const response = await this.fetchWithRefresh(url.toString(), {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { data: {}, errors: [error.message] };
    }
  }
}

// Export an instance using the default configuration
export const networkAdapter = new NetworkAdapter();
