import type { ReactElement } from 'react';
import { render, type RenderResult } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

interface RouterRenderOptions {
  initialEntries?: Array<string | { pathname: string; state?: unknown }>;
}

interface RouteRenderOptions extends RouterRenderOptions {
  path: string;
}

export function renderWithRouter(ui: ReactElement, options: RouterRenderOptions = {}): RenderResult {
  return render(<MemoryRouter initialEntries={options.initialEntries}>{ui}</MemoryRouter>);
}

export function renderWithRoute(ui: ReactElement, options: RouteRenderOptions): RenderResult {
  const { path, initialEntries = ['/'] } = options;
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path={path} element={ui} />
      </Routes>
    </MemoryRouter>
  );
}
