import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue(undefined),
  }),
}));

describe('Login', () => {
  it('renders login form with username and password fields', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByText(/Connexion/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Identifiant/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
  });

  it('has link to register page', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const link = screen.getByRole('link', { name: /S'inscrire/i });
    expect(link).toHaveAttribute('href', expect.stringContaining('register'));
  });
});
