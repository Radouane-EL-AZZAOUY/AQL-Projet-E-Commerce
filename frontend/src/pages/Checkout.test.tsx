import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Checkout from './Checkout';

const cartGetMock = vi.fn();
const cartClearMock = vi.fn();
const createOrderMock = vi.fn();
const confirmOrderMock = vi.fn();

vi.mock('../api/client', () => ({
  cart: {
    get: (...args: unknown[]) => cartGetMock(...args),
    clear: (...args: unknown[]) => cartClearMock(...args),
  },
  orders: {
    create: (...args: unknown[]) => createOrderMock(...args),
    confirm: (...args: unknown[]) => confirmOrderMock(...args),
  },
}));

describe('Checkout', () => {
  it('redirects to cart when checkout cart is empty', async () => {
    cartGetMock.mockResolvedValueOnce({ items: [] });

    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/cart" element={<div>Cart page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Cart page')).toBeInTheDocument();
  });

  it('confirms order and navigates to order detail', async () => {
    cartGetMock
      .mockResolvedValueOnce({ items: [{ productId: 1, quantity: 2 }] })
      .mockResolvedValueOnce({ items: [{ productId: 1, quantity: 2 }] });
    createOrderMock.mockResolvedValueOnce({ id: 42 });
    confirmOrderMock.mockResolvedValueOnce({});
    cartClearMock.mockResolvedValueOnce({});

    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/:id" element={<div>Order detail page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: /Valider la commande/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Confirmer la commande/i }));
    expect(await screen.findByText('Order detail page')).toBeInTheDocument();
    expect(createOrderMock).toHaveBeenCalledWith([{ productId: 1, quantity: 2 }]);
    expect(confirmOrderMock).toHaveBeenCalledWith(42);
    expect(cartClearMock).toHaveBeenCalled();
  });
});
