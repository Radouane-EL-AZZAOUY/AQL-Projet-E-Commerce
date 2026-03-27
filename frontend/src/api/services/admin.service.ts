import { apiRequest } from '../core';
import type { Category, Order, Product } from '../types';

export const adminService = {
  products: {
    list: (page = 0, size = 20) =>
      apiRequest<{ content: Product[]; totalPages: number; totalElements: number }>(`/admin/products?page=${page}&size=${size}`),
    getById: (id: number) => apiRequest<Product>(`/admin/products/${id}`),
    create: (body: Partial<Product> & { name: string; price: number; stock: number }) =>
      apiRequest<Product>('/admin/products', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: number, body: Partial<Product>) =>
      apiRequest<Product>(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: number) => apiRequest<void>(`/admin/products/${id}`, { method: 'DELETE' }),
    updateStock: (id: number, stock: number) =>
      apiRequest<Product>(`/admin/products/${id}/stock?stock=${stock}`, { method: 'PATCH' }),
  },
  categories: {
    list: () => apiRequest<Category[]>('/admin/categories'),
    create: (body: { name: string }) =>
      apiRequest<Category>('/admin/categories', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: number, body: { name: string }) =>
      apiRequest<Category>(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: number) => apiRequest<void>(`/admin/categories/${id}`, { method: 'DELETE' }),
  },
  orders: {
    list: () => apiRequest<Order[]>('/admin/orders'),
    getById: (id: number) => apiRequest<Order>(`/admin/orders/${id}`),
    updateStatus: (id: number, status: string) =>
      apiRequest<Order>(`/admin/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },
};
