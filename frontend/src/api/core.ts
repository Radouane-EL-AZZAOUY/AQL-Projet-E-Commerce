const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.error || data?.message || res.statusText;
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }

  return data as T;
}
