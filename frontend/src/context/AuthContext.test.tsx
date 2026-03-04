import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

function TestConsumer() {
  const { user } = useAuth();
  return <span data-testid="user">{user?.username ?? 'none'}</span>;
}

describe('AuthContext', () => {
  it('provides null user initially', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('user')).toHaveTextContent('none');
  });
});
