import { apiRequest } from '../core';
import type { Cart } from '../types';

export const cartService = {
  get: () => apiRequest<Cart>('/cart'),
  addItem: (productId: number, quantity = 1) =>
    apiRequest<Cart>(`/cart/items?productId=${productId}&quantity=${quantity}`, { method: 'POST' }),
  updateItem: (productId: number, quantity: number) =>
    apiRequest<Cart>(`/cart/items/${productId}?quantity=${quantity}`, { method: 'PUT' }),
  removeItem: (productId: number) =>
    apiRequest<Cart>(`/cart/items/${productId}`, { method: 'DELETE' }),
  clear: () => apiRequest<void>('/cart', { method: 'DELETE' }),
};
