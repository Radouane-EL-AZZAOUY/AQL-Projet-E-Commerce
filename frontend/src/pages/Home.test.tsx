import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Home from './Home';
import { renderWithRouter } from '../test/utils';

describe('Home', () => {
  it('renders welcome and catalog link', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Bienvenue sur E-Commerce/i)).toBeInTheDocument();
    const catalogLink = screen.getByRole('link', { name: /Voir le catalogue/i });
    expect(catalogLink).toBeInTheDocument();
    expect(catalogLink).toHaveAttribute('href', expect.stringContaining('catalog'));
  });
});
