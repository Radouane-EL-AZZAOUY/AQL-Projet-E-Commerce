import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Layout from './Layout';

function TestOutlet() {
  return <div data-testid="outlet">Page content</div>;
}

describe('Layout', () => {
  it('renders logo and main content', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<TestOutlet />} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('E-Commerce')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toHaveTextContent('Page content');
  });

  it('shows login and register links when not authenticated', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<TestOutlet />} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /Connexion/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Inscription/i })).toBeInTheDocument();
  });

  it('shows catalog link', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<TestOutlet />} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /Catalogue/i })).toBeInTheDocument();
  });
});
