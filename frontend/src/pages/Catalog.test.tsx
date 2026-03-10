import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Catalog from './Catalog';

vi.mock('../api/client', () => ({
  products: {
    list: vi.fn().mockResolvedValue({
      content: [
        { id: 1, name: 'Produit A', price: 10, stock: 5, categoryName: 'Cat1' },
        { id: 2, name: 'Produit B', price: 20, stock: 3, categoryName: 'Cat2' },
      ],
      totalPages: 1,
      totalElements: 2,
    }),
  },
  categories: {
    list: vi.fn().mockResolvedValue([
      { id: 1, name: 'Cat1' },
      { id: 2, name: 'Cat2' },
    ]),
  },
}));

describe('Catalog', () => {
  it('renders catalog title and product count after load', async () => {
    render(
      <BrowserRouter>
        <Catalog />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: /Catalogue/i })).toBeInTheDocument();
    expect(await screen.findByText(/2 produit\(s\)/i)).toBeInTheDocument();
    expect(screen.getByText('Produit A')).toBeInTheDocument();
    expect(screen.getByText('Produit B')).toBeInTheDocument();
  });

  it('has search input and category filter', async () => {
    render(
      <BrowserRouter>
        <Catalog />
      </BrowserRouter>
    );
    await screen.findByText(/2 produit\(s\)/i);
    expect(screen.getByPlaceholderText(/Rechercher un produit/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Filtrer par catégorie/i })).toBeInTheDocument();
  });

  it('links to product detail pages', async () => {
    render(
      <BrowserRouter>
        <Catalog />
      </BrowserRouter>
    );
    await screen.findByText(/2 produit\(s\)/i);
    const links = screen.getAllByRole('link', { name: /Voir le produit/i });
    expect(links[0]).toHaveAttribute('href', expect.stringContaining('/products/1'));
    expect(links[1]).toHaveAttribute('href', expect.stringContaining('/products/2'));
  });
});
