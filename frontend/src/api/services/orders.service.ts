import { apiRequest } from '../core';
import type { Order } from '../types';

export const ordersService = {
  create: (items: { productId: number; quantity: number }[]) =>
    apiRequest<Order>('/orders', { method: 'POST', body: JSON.stringify({ items }) }),
  confirm: (orderId: number) => apiRequest<Order>(`/orders/${orderId}/confirm`, { method: 'POST' }),
  myOrders: () => apiRequest<Order[]>('/orders'),
  getById: (id: number) => apiRequest<Order>(`/orders/${id}`),
};
