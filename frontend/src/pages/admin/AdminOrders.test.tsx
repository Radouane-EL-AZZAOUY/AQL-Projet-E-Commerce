import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import AdminOrders from './AdminOrders';

const listMock = vi.fn();
const updateStatusMock = vi.fn();

vi.mock('../../api/client', () => ({
  admin: {
    orders: {
      list: (...args: unknown[]) => listMock(...args),
      updateStatus: (...args: unknown[]) => updateStatusMock(...args),
    },
  },
}));

describe('AdminOrders', () => {
  it('renders orders and updates pending status', async () => {
    listMock
      .mockResolvedValueOnce([
        {
          id: 15,
          userId: 1,
          username: 'john',
          status: 'PENDING',
          createdAt: '2026-03-26T10:00:00Z',
          totalAmount: 88,
          items: [],
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 15,
          userId: 1,
          username: 'john',
          status: 'CONFIRMED',
          createdAt: '2026-03-26T10:00:00Z',
          totalAmount: 88,
          items: [],
        },
      ]);
    updateStatusMock.mockResolvedValueOnce({});

    render(<AdminOrders />);

    expect(await screen.findByText(/#15/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Valider/i }));
    expect(updateStatusMock).toHaveBeenCalledWith(15, 'CONFIRMED');
    expect(await screen.findByText(/Commande validée/i)).toBeInTheDocument();
  });
});
