import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const authState = { token: '', isAdmin: false };

vi.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => authState,
}));

describe('App', () => {
  it('renders home page at root', () => {
    authState.token = '';
    authState.isAdmin = false;
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Bienvenue sur E-Commerce/i)).toBeInTheDocument();
  });

  it('redirects private pages to login when not authenticated', async () => {
    authState.token = '';
    authState.isAdmin = false;
    render(
      <MemoryRouter initialEntries={['/cart']}>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByRole('heading', { name: /Connexion/i })).toBeInTheDocument();
  });
});
