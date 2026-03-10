import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it('renders home page at root', () => {
    render(
      <HashRouter>
        <App />
      </HashRouter>
    );
    expect(screen.getByText(/Bienvenue sur E-Commerce/i)).toBeInTheDocument();
  });
});
