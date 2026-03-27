import { beforeEach, describe, expect, it, vi } from 'vitest';
import { admin, api, auth, cart, categories, orders, products } from './client';

describe('api client helpers', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('adds authorization header when token exists', async () => {
    localStorage.setItem('token', 'abc-token');
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    } as Response);

    await api('/products');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/products',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer abc-token',
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('throws backend error message when request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      statusText: 'Bad Request',
      json: async () => ({ message: 'Invalid payload' }),
    } as Response);

    await expect(api('/test')).rejects.toThrow('Invalid payload');
  });

  it('calls product and category endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);

    await products.list(1, 12, 'phone', 2);
    await products.getById(10);
    await categories.list();

    expect(fetchMock).toHaveBeenCalledWith('/api/products?page=1&size=12&search=phone&categoryId=2', expect.any(Object));
    expect(fetchMock).toHaveBeenCalledWith('/api/products/10', expect.any(Object));
    expect(fetchMock).toHaveBeenCalledWith('/api/categories', expect.any(Object));
  });

  it('calls cart and order endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);

    await cart.get();
    await cart.addItem(5, 3);
    await cart.updateItem(5, 1);
    await cart.removeItem(5);
    await cart.clear();
    await orders.create([{ productId: 5, quantity: 2 }]);
    await orders.confirm(7);
    await orders.myOrders();
    await orders.getById(7);

    expect(fetchMock).toHaveBeenCalledWith('/api/cart', expect.any(Object));
    expect(fetchMock).toHaveBeenCalledWith('/api/cart/items?productId=5&quantity=3', expect.objectContaining({ method: 'POST' }));
    expect(fetchMock).toHaveBeenCalledWith('/api/cart/items/5?quantity=1', expect.objectContaining({ method: 'PUT' }));
    expect(fetchMock).toHaveBeenCalledWith('/api/cart/items/5', expect.objectContaining({ method: 'DELETE' }));
    expect(fetchMock).toHaveBeenCalledWith('/api/orders', expect.objectContaining({ method: 'POST' }));
    expect(fetchMock).toHaveBeenCalledWith('/api/orders/7/confirm', expect.objectContaining({ method: 'POST' }));
    expect(fetchMock).toHaveBeenCalledWith('/api/orders/7', expect.any(Object));
  });

  it('calls admin endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);

    await admin.products.list(0, 20);
    await admin.products.getById(1);
    await admin.products.create({ name: 'P', price: 10, stock: 3 });
    await admin.products.update(1, { name: 'P2' });
    await admin.products.delete(1);
    await admin.products.updateStock(1, 8);
    await admin.categories.list();
    await admin.categories.create({ name: 'C1' });
    await admin.categories.update(1, { name: 'C2' });
    await admin.categories.delete(1);
    await admin.orders.list();
    await admin.orders.getById(2);
    await admin.orders.updateStatus(2, 'CONFIRMED');
    await auth.login('user', 'pass');
    await auth.register('u', 'u@x.com', 'secret');

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/products?page=0&size=20', expect.any(Object));
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/categories', expect.any(Object));
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/orders/2/status', expect.objectContaining({ method: 'PATCH' }));
    expect(fetchMock).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({ method: 'POST' }));
    expect(fetchMock).toHaveBeenCalledWith('/api/auth/register', expect.objectContaining({ method: 'POST' }));
  });
});
