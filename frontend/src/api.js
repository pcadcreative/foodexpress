// Backend service URLs - Client-side load balancing for all services
const ORDER_SERVICE_URLS = [
  process.env.REACT_APP_ORDER_SERVICE_1 || 'http://localhost:3001',
  process.env.REACT_APP_ORDER_SERVICE_2 || 'http://localhost:3001'
];

const RECOMMENDATION_SERVICE_URLS = [
  process.env.REACT_APP_RECOMMENDATION_SERVICE_1 || 'http://localhost:3002',
  process.env.REACT_APP_RECOMMENDATION_SERVICE_2 || 'http://localhost:3002'
];

// Round-robin load balancing indices
let orderServiceIndex = 0;
let recommendationServiceIndex = 0;

// Get next order service URL (round-robin)
function getOrderServiceURL() {
  const url = ORDER_SERVICE_URLS[orderServiceIndex];
  orderServiceIndex = (orderServiceIndex + 1) % ORDER_SERVICE_URLS.length;
  console.log('🔄 Load Balancing - Using Order Service:', url);
  return url;
}

// Get next recommendation service URL (round-robin)
function getRecommendationServiceURL() {
  const url = RECOMMENDATION_SERVICE_URLS[recommendationServiceIndex];
  recommendationServiceIndex = (recommendationServiceIndex + 1) % RECOMMENDATION_SERVICE_URLS.length;
  console.log('🔄 Load Balancing - Using Recommendation Service:', url);
  return url;
}

const api = {
  signup: async (data) => {
    const response = await fetch(`${getOrderServiceURL()}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  login: async (data) => {
    const response = await fetch(`${getOrderServiceURL()}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getCities: async (token) => {
    const response = await fetch(`${getOrderServiceURL()}/api/cities`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  getRestaurants: async (token, cityId) => {
    const baseUrl = getOrderServiceURL();
    const url = cityId ? `${baseUrl}/api/restaurants?cityId=${cityId}` : `${baseUrl}/api/restaurants`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  getMenu: async (token, restaurantId) => {
    const response = await fetch(`${getOrderServiceURL()}/api/restaurants/${restaurantId}/menu`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  addToCart: async (token, data) => {
    const response = await fetch(`${getOrderServiceURL()}/api/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getCart: async (token) => {
    const response = await fetch(`${getOrderServiceURL()}/api/cart`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  updateCart: async (token, data) => {
    const response = await fetch(`${getOrderServiceURL()}/api/cart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  clearCart: async (token) => {
    const response = await fetch(`${getOrderServiceURL()}/api/cart/clear`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  placeOrder: async (token, data) => {
    const response = await fetch(`${getOrderServiceURL()}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getOrders: async (token) => {
    const response = await fetch(`${getOrderServiceURL()}/api/orders`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  getOrder: async (token, orderId) => {
    const response = await fetch(`${getOrderServiceURL()}/api/orders/${orderId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  getRecommendations: async (userId) => {
    const response = await fetch(`${getRecommendationServiceURL()}/api/recommendations?userId=${userId}`);
    return response.json();
  },
};

export default api;
