import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDetail from './ProductDetail';

const getByIdMock = vi.fn();
const addItemMock = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ token: 'token', isAdmin: false }),
}));

vi.mock('../api/client', () => ({
  products: { getById: (...args: unknown[]) => getByIdMock(...args) },
  cart: { addItem: (...args: unknown[]) => addItemMock(...args) },
}));

describe('ProductDetail', () => {
  it('renders product and adds it to cart', async () => {
    getByIdMock.mockResolvedValueOnce({
      id: 1,
      name: 'Produit Test',
      description: 'Description',
      categoryName: 'Cat',
      price: 99,
      stock: 4,
      imageUrl: '',
    });
    addItemMock.mockResolvedValueOnce({});

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Produit Test')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Ajouter au panier/i }));
    expect(await screen.findByText(/Produit ajouté au panier/i)).toBeInTheDocument();
    expect(addItemMock).toHaveBeenCalledWith(1, 1);
  });

  it('shows empty state when product is missing', async () => {
    getByIdMock.mockRejectedValueOnce(new Error('not found'));

    render(
      <MemoryRouter initialEntries={['/products/999']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Produit introuvable/i)).toBeInTheDocument();
  });
});
