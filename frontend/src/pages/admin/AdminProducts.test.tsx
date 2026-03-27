import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import AdminProducts from './AdminProducts';

const listProductsMock = vi.fn();
const listCategoriesMock = vi.fn();
const createProductMock = vi.fn();

vi.mock('../../api/client', () => ({
  admin: {
    products: {
      list: (...args: unknown[]) => listProductsMock(...args),
      create: (...args: unknown[]) => createProductMock(...args),
      update: vi.fn(),
      delete: vi.fn(),
    },
    categories: {
      list: (...args: unknown[]) => listCategoriesMock(...args),
    },
  },
}));

describe('AdminProducts', () => {
  it('renders list and creates a product', async () => {
    listProductsMock
      .mockResolvedValueOnce({
        content: [{ id: 1, name: 'Prod1', categoryName: 'Cat1', price: 10, stock: 2 }],
        totalPages: 1,
      })
      .mockResolvedValueOnce({
        content: [{ id: 1, name: 'Prod1', categoryName: 'Cat1', price: 10, stock: 2 }],
        totalPages: 1,
      });
    listCategoriesMock.mockResolvedValue([{ id: 1, name: 'Cat1' }]);
    createProductMock.mockResolvedValue({});

    render(<AdminProducts />);

    expect(await screen.findByText('Prod1')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Nouveau produit/i }));
    fireEvent.change(screen.getByLabelText(/Nom/i), { target: { value: 'Prod2' } });
    fireEvent.change(screen.getByLabelText(/Prix/i), { target: { value: '15' } });
    fireEvent.change(screen.getByLabelText(/Stock/i), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /Enregistrer/i }));

    expect(createProductMock).toHaveBeenCalled();
  });
});
