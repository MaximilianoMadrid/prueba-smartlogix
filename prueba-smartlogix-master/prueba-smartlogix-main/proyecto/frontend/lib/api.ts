const API_GATEWAY = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = {
  auth: {
    login: `${API_GATEWAY}/api/auth/login`,
    register: `${API_GATEWAY}/api/auth/register`,
  },
  orders: `${API_GATEWAY}/api/orders`,
  inventory: `${API_GATEWAY}/api/inventario`,
  shipping: `${API_GATEWAY}/api/envios`,
  tracking: `${API_GATEWAY}/api/tracking`,
  notifications: `${API_GATEWAY}/api/notificaciones`,
};

export const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});