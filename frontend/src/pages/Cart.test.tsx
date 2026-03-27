import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cart from './Cart';

const getMock = vi.fn();
const updateItemMock = vi.fn();
const removeItemMock = vi.fn();

vi.mock('../api/client', () => ({
  cart: {
    get: (...args: unknown[]) => getMock(...args),
    updateItem: (...args: unknown[]) => updateItemMock(...args),
    removeItem: (...args: unknown[]) => removeItemMock(...args),
  },
}));

describe('Cart', () => {
  it('shows empty state when cart has no items', async () => {
    getMock.mockResolvedValueOnce({
      id: 1,
      items: [],
      totalAmount: 0,
    });
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );
    expect(await screen.findByText(/Votre panier est vide/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Voir le catalogue/i })).toBeInTheDocument();
  });

  it('updates and removes item when cart has data', async () => {
    getMock.mockResolvedValueOnce({
      id: 1,
      items: [{ id: 1, productId: 10, productName: 'Produit A', unitPrice: 20, quantity: 1, subtotal: 20 }],
      totalAmount: 20,
    });
    updateItemMock.mockResolvedValueOnce({
      id: 1,
      items: [{ id: 1, productId: 10, productName: 'Produit A', unitPrice: 20, quantity: 2, subtotal: 40 }],
      totalAmount: 40,
    });
    removeItemMock.mockResolvedValueOnce({ id: 1, items: [], totalAmount: 0 });

    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    expect(await screen.findByText('Produit A')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Quantité pour Produit A/i), { target: { value: '2' } });
    expect(updateItemMock).toHaveBeenCalledWith(10, 2);
    const amounts = await screen.findAllByText(/40.00 €/i);
    expect(amounts.length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: /Supprimer Produit A du panier/i }));
    expect(removeItemMock).toHaveBeenCalledWith(10);
    expect(await screen.findByText(/Votre panier est vide/i)).toBeInTheDocument();
  });
});
