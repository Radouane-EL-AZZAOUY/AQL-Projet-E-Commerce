import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            E-Commerce
          </Link>
          <nav className="nav">
            <Link to="/catalog" className="nav-link">Catalogue</Link>
            {user ? (
              <>
                {(user.role === 'CLIENT' || user.role === 'ADMIN') && (
                  <>
                    <Link to="/cart" className="nav-link">Panier</Link>
                    <Link to="/orders" className="nav-link">Mes commandes</Link>
                  </>
                )}
                {isAdmin && (
                  <div className="nav-admin">
                    <Link to="/admin/products" className="nav-link nav-link-admin">Produits</Link>
                    <Link to="/admin/categories" className="nav-link nav-link-admin">Catégories</Link>
                    <Link to="/admin/orders" className="nav-link nav-link-admin">Commandes</Link>
                  </div>
                )}
                <span className="nav-user">{user.username}</span>
                <button type="button" onClick={handleLogout} className="btn btn-ghost btn-sm nav-btn">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Connexion</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Inscription</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <span>Projet fil rouge AQL — Assurance Qualité Logicielle</span>
          <a href="/api/swagger-ui.html" target="_blank" rel="noopener noreferrer" className="footer-link">API Docs (Swagger)</a>
        </div>
      </footer>
    </div>
  );
}
