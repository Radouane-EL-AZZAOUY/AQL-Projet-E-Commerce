import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const REDIRECT_MESSAGES: Record<string, string> = {
  '/cart': 'Connectez-vous pour accéder à votre panier.',
  '/checkout': 'Connectez-vous pour valider votre commande.',
  '/orders': 'Connectez-vous pour voir vos commandes.',
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
  const redirectMessage = from
    ? REDIRECT_MESSAGES[from] ??
      (from.startsWith('/orders') ? 'Connectez-vous pour voir vos commandes.' : 'Connectez-vous pour accéder à cette page.')
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate(from || '/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page">
      <div className="auth-card">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Connexion</h2>
          <p className="page-subtitle mb-8">
            {redirectMessage ?? 'Accédez à votre compte pour gérer votre panier et vos commandes.'}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-username">Identifiant</label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="Votre identifiant"
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Mot de passe</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <button type="submit" className="btn btn-primary btn-block py-3 text-base" disabled={loading}>
              {loading ? <span className="loading-spinner" /> : null}
              {loading ? ' Connexion...' : 'Se connecter'}
            </button>
          </form>
          <p className="auth-switch">
            Pas encore de compte ? <Link to="/register" className="text-primary font-semibold hover:underline">S&apos;inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
