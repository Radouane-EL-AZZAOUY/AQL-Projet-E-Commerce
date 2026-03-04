/**
 * Base URL for backend API.
 * In dev: Vite proxy forwards /api to backend (see vite.config.ts).
 * Swagger UI: /api/swagger-ui/index.html (proxied to backend).
 */
const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.error || data?.message || res.statusText;
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
  return data as T;
}

export const auth = {
  login: (username: string, password: string) =>
    api<{ token: string; username: string; role: string; userId: number }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  register: (username: string, email: string, password: string) =>
    api<{ token: string; username: string; role: string; userId: number }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),
};

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId?: number;
  categoryName?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalAmount: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId: number;
  username: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
  totalAmount: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const products = {
  list: (page = 0, size = 12, search?: string, categoryId?: number) => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (search) params.set('search', search);
    if (categoryId != null) params.set('categoryId', String(categoryId));
    return api<{ content: Product[]; totalPages: number; totalElements: number; page: number; size: number; first: boolean; last: boolean }>(`/products?${params}`);
  },
  getById: (id: number) => api<Product>(`/products/${id}`),
};

export const categories = {
  list: () => api<Category[]>('/categories'),
};

export const cart = {
  get: () => api<Cart>('/cart'),
  addItem: (productId: number, quantity = 1) =>
    api<Cart>(`/cart/items?productId=${productId}&quantity=${quantity}`, { method: 'POST' }),
  updateItem: (productId: number, quantity: number) =>
    api<Cart>(`/cart/items/${productId}?quantity=${quantity}`, { method: 'PUT' }),
  removeItem: (productId: number) =>
    api<Cart>(`/cart/items/${productId}`, { method: 'DELETE' }),
  clear: () => api<void>('/cart', { method: 'DELETE' }),
};

export const orders = {
  create: (items: { productId: number; quantity: number }[]) =>
    api<Order>('/orders', { method: 'POST', body: JSON.stringify({ items }) }),
  confirm: (orderId: number) =>
    api<Order>(`/orders/${orderId}/confirm`, { method: 'POST' }),
  myOrders: () => api<Order[]>('/orders'),
  getById: (id: number) => api<Order>(`/orders/${id}`),
};

export const admin = {
  products: {
    list: (page = 0, size = 20) =>
      api<{ content: Product[]; totalPages: number; totalElements: number }>(`/admin/products?page=${page}&size=${size}`),
    getById: (id: number) => api<Product>(`/admin/products/${id}`),
    create: (body: Partial<Product> & { name: string; price: number; stock: number }) =>
      api<Product>('/admin/products', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: number, body: Partial<Product>) =>
      api<Product>(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: number) => api<void>(`/admin/products/${id}`, { method: 'DELETE' }),
    updateStock: (id: number, stock: number) =>
      api<Product>(`/admin/products/${id}/stock?stock=${stock}`, { method: 'PATCH' }),
  },
  categories: {
    list: () => api<Category[]>('/admin/categories'),
    create: (body: { name: string }) =>
      api<Category>('/admin/categories', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: number, body: { name: string }) =>
      api<Category>(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: number) => api<void>(`/admin/categories/${id}`, { method: 'DELETE' }),
  },
  orders: {
    list: () => api<Order[]>('/admin/orders'),
    getById: (id: number) => api<Order>(`/admin/orders/${id}`),
    updateStatus: (id: number, status: string) =>
      api<Order>(`/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },
};
