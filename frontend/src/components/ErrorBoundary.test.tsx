import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

function Thrower() {
  throw new Error('Boom');
}

let consoleErrorSpy: ReturnType<typeof vi.spyOn> | null = null;

afterEach(() => {
  consoleErrorSpy?.mockRestore();
  consoleErrorSpy = null;
});

describe('ErrorBoundary', () => {
  it('renders fallback UI then recovers on retry', () => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(
      <ErrorBoundary>
        <Thrower />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Une erreur est survenue/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Réessayer/i }));
    expect(screen.getByText(/Une erreur est survenue/i)).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <Thrower />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
  });
});
