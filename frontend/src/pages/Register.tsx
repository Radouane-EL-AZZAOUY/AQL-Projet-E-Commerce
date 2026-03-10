import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page">
      <div className="auth-card">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Inscription</h2>
          <p className="page-subtitle mb-8">Créez un compte pour passer des commandes et suivre votre historique.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="register-username">Identifiant</label>
              <input
                id="register-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={2}
                autoComplete="username"
                placeholder="Choisissez un identifiant"
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-email">Email</label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="votre@email.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-password">Mot de passe</label>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Au moins 6 caractères"
              />
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <button type="submit" className="btn btn-primary btn-block py-3 text-base" disabled={loading}>
              {loading ? <span className="loading-spinner" /> : null}
              {loading ? ' Inscription...' : "S'inscrire"}
            </button>
          </form>
          <p className="auth-switch">
            Déjà inscrit ? <Link to="/login" className="text-primary font-semibold hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
