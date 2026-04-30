const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// Restaurants
export const getRestaurants = () => request('/api/restaurants');
export const getRestaurant = (id) => request(`/api/restaurants/${id}`);
export const getRestaurantReviews = (id) => request(`/api/restaurants/${id}/reviews`);

// Users
export const getUsers = () => request('/api/users');
export const createUser = (body) => request('/api/users', { method: 'POST', body: JSON.stringify(body) });

// Reservations
export const getReservations = () => request('/api/reservations');
export const createReservation = (body) => request('/api/reservations', { method: 'POST', body: JSON.stringify(body) });
export const updateReservation = (id, body) => request(`/api/reservations/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const cancelReservation = (id) => request(`/api/reservations/${id}/cancel`, { method: 'PATCH' });
export const deleteReservation = (id) => request(`/api/reservations/${id}`, { method: 'DELETE' });

// Reviews
export const getReviews = () => request('/api/reviews');
export const createReview = (body) => request('/api/reviews', { method: 'POST', body: JSON.stringify(body) });
export const updateReview = (id, body) => request(`/api/reviews/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteReview = (id) => request(`/api/reviews/${id}`, { method: 'DELETE' });

// Platforms
export const getPlatforms = () => request('/api/platforms');
export const getRestaurantPlatforms = () => request('/api/restaurant-platforms');

// Dashboard
export const getDashboardStats = () => request('/api/dashboard/stats');
