import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';
import { renderWithRoute } from '../test/utils';

const loginMock = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}));

describe('Login', () => {
  it('shows redirect message when coming from private route', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/login', state: { from: { pathname: '/cart' } } }]}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/accéder à votre panier/i)).toBeInTheDocument();
  });

  it('renders login form with username and password fields', () => {
    renderWithRoute(<Login />, { path: '/' });
    expect(screen.getByText(/Connexion/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Identifiant/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
  });

  it('has link to register page', () => {
    renderWithRoute(<Login />, { path: '/' });
    const link = screen.getByRole('link', { name: /S'inscrire/i });
    expect(link).toHaveAttribute('href', expect.stringContaining('register'));
  });

  it('submits credentials and navigates to target route', async () => {
    loginMock.mockResolvedValueOnce(undefined);

    render(
      <MemoryRouter initialEntries={[{ pathname: '/login', state: { from: { pathname: '/orders' } } }]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={<div>Orders page</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Identifiant/i), { target: { value: 'john' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));

    expect(await screen.findByText('Orders page')).toBeInTheDocument();
    expect(loginMock).toHaveBeenCalledWith('john', 'secret');
  });

  it('shows error when login fails', async () => {
    loginMock.mockRejectedValueOnce(new Error('Bad credentials'));
    renderWithRoute(<Login />, { path: '/' });

    fireEvent.change(screen.getByLabelText(/Identifiant/i), { target: { value: 'john' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));

    expect(await screen.findByText(/Bad credentials/i)).toBeInTheDocument();
  });
});
