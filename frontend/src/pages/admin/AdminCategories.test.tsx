import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import AdminCategories from './AdminCategories';

const listMock = vi.fn();
const createMock = vi.fn();

vi.mock('../../api/client', () => ({
  admin: {
    categories: {
      list: (...args: unknown[]) => listMock(...args),
      create: (...args: unknown[]) => createMock(...args),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('AdminCategories', () => {
  it('opens create modal and creates a category', async () => {
    listMock.mockResolvedValue([{ id: 1, name: 'Cat1' }]);
    createMock.mockResolvedValue({});

    render(<AdminCategories />);

    expect(await screen.findByText('Cat1')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Nouvelle catégorie/i }));
    fireEvent.change(screen.getByLabelText(/Nom/i), { target: { value: 'Cat2' } });
    fireEvent.click(screen.getByRole('button', { name: /Ajouter/i }));

    expect(createMock).toHaveBeenCalledWith({ name: 'Cat2' });
  });
});
