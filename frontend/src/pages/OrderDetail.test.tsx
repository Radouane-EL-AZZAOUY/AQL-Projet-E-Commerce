import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import OrderDetail from './OrderDetail';

const getOrderByIdMock = vi.fn();

vi.mock('../api/client', () => ({
  orders: {
    getById: (...args: unknown[]) => getOrderByIdMock(...args),
  },
}));

describe('OrderDetail', () => {
  it('shows error for invalid order id', async () => {
    render(
      <MemoryRouter initialEntries={['/orders/invalid']}>
        <Routes>
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Commande introuvable/i)).toBeInTheDocument();
  });

  it('renders order detail table', async () => {
    getOrderByIdMock.mockResolvedValueOnce({
      id: 3,
      userId: 1,
      username: 'user',
      status: 'PENDING',
      createdAt: '2026-03-26T10:00:00Z',
      totalAmount: 50,
      items: [{ productId: 1, productName: 'Produit A', quantity: 2, unitPrice: 25, subtotal: 50 }],
    });

    render(
      <MemoryRouter initialEntries={['/orders/3']}>
        <Routes>
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Commande #3/i)).toBeInTheDocument();
    expect(screen.getByText('Produit A')).toBeInTheDocument();
    expect(screen.getByText(/En attente/i)).toBeInTheDocument();
  });
});
