import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

describe('Home', () => {
  it('renders welcome and catalog link', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText(/Bienvenue sur E-Commerce/i)).toBeInTheDocument();
    const catalogLink = screen.getByRole('link', { name: /Voir le catalogue/i });
    expect(catalogLink).toBeInTheDocument();
    expect(catalogLink).toHaveAttribute('href', expect.stringContaining('catalog'));
  });
});
