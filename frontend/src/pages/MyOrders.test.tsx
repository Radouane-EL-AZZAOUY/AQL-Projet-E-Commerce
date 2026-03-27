import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyOrders from './MyOrders';

const myOrdersMock = vi.fn();

vi.mock('../api/client', () => ({
  orders: {
    myOrders: (...args: unknown[]) => myOrdersMock(...args),
  },
}));

describe('MyOrders', () => {
  it('shows empty state when user has no orders', async () => {
    myOrdersMock.mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <MyOrders />
      </BrowserRouter>
    );

    expect(await screen.findByText(/Aucune commande pour le moment/i)).toBeInTheDocument();
  });

  it('renders an order row when data exists', async () => {
    myOrdersMock.mockResolvedValueOnce([
      {
        id: 12,
        userId: 1,
        username: 'user',
        status: 'CONFIRMED',
        createdAt: '2026-03-26T10:00:00Z',
        totalAmount: 120,
        items: [],
      },
    ]);

    render(
      <BrowserRouter>
        <MyOrders />
      </BrowserRouter>
    );

    expect(await screen.findByText(/Commande #12/i)).toBeInTheDocument();
    expect(screen.getByText(/Validée/i)).toBeInTheDocument();
  });
});
