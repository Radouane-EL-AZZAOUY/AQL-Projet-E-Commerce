import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cart from './Cart';

vi.mock('../api/client', () => ({
  cart: {
    get: vi.fn().mockResolvedValue({
      id: 1,
      items: [],
      totalAmount: 0,
    }),
  },
}));

describe('Cart', () => {
  it('shows empty state when cart has no items', async () => {
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );
    expect(await screen.findByText(/Votre panier est vide/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Voir le catalogue/i })).toBeInTheDocument();
  });
});
