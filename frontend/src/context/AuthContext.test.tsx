import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

const loginApiMock = vi.fn();
const registerApiMock = vi.fn();

vi.mock('../api/client', () => ({
  auth: {
    login: (...args: unknown[]) => loginApiMock(...args),
    register: (...args: unknown[]) => registerApiMock(...args),
  },
}));

function TestConsumer() {
  const { user, isAdmin, login, register, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user?.username ?? 'none'}</span>
      <span data-testid="is-admin">{String(isAdmin)}</span>
      <button type="button" onClick={() => login('u', 'p')}>login</button>
      <button type="button" onClick={() => register('u2', 'u2@test.com', 'p2')}>register</button>
      <button type="button" onClick={logout}>logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('provides null user initially', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('user')).toHaveTextContent('none');
  });

  it('logs in and updates local state', async () => {
    loginApiMock.mockResolvedValueOnce({ token: 't1', username: 'john', role: 'ADMIN', userId: 7 });
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'login' }));
    expect(await screen.findByText('john')).toBeInTheDocument();
    expect(screen.getByTestId('is-admin')).toHaveTextContent('true');
    expect(localStorage.getItem('token')).toBe('t1');
  });

  it('registers then logs out', async () => {
    registerApiMock.mockResolvedValueOnce({ token: 't2', username: 'alice', role: 'CLIENT', userId: 9 });
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'register' }));
    expect(await screen.findByText('alice')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'logout' }));
    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(localStorage.getItem('token')).toBeNull();
  });
});
