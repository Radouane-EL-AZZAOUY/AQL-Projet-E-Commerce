import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    register: vi.fn().mockResolvedValue(undefined),
  }),
}));

describe('Register', () => {
  it('renders registration form with all fields', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Identifiant/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /S'inscrire/i })).toBeInTheDocument();
  });

  it('has link to login page', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    const link = screen.getByRole('link', { name: /Se connecter/i });
    expect(link).toHaveAttribute('href', expect.stringContaining('login'));
  });
});
