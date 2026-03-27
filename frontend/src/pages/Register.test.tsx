import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Register from './Register';
import { renderWithRoute } from '../test/utils';

const registerMock = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    register: registerMock,
  }),
}));

describe('Register', () => {
  it('renders registration form with all fields', () => {
    renderWithRoute(<Register />, { path: '/' });
    expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Identifiant/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /S'inscrire/i })).toBeInTheDocument();
  });

  it('has link to login page', () => {
    renderWithRoute(<Register />, { path: '/' });
    const link = screen.getByRole('link', { name: /Se connecter/i });
    expect(link).toHaveAttribute('href', expect.stringContaining('login'));
  });

  it('submits form and redirects to home', async () => {
    registerMock.mockResolvedValueOnce(undefined);
    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<div>Home page</div>} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Identifiant/i), { target: { value: 'john' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@test.com' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'secret12' } });
    fireEvent.click(screen.getByRole('button', { name: /S'inscrire/i }));

    expect(await screen.findByText('Home page')).toBeInTheDocument();
    expect(registerMock).toHaveBeenCalledWith('john', 'john@test.com', 'secret12');
  });

  it('shows error on register failure', async () => {
    registerMock.mockRejectedValueOnce(new Error('Username already exists'));
    renderWithRoute(<Register />, { path: '/' });
    fireEvent.change(screen.getByLabelText(/Identifiant/i), { target: { value: 'john' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@test.com' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'secret12' } });
    fireEvent.click(screen.getByRole('button', { name: /S'inscrire/i }));
    expect(await screen.findByText(/Username already exists/i)).toBeInTheDocument();
  });
});
