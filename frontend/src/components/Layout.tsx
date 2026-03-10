import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setNavOpen(false);
  };

  const closeNav = () => setNavOpen(false);

  return (
    <div className="layout">
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo" onClick={closeNav}>
            E-Commerce
          </Link>
          <button
            type="button"
            className="md:hidden p-2 text-slate-600 hover:text-primary rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setNavOpen((o) => !o)}
            aria-label={navOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={navOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {navOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <nav
            className={`nav ${navOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-full left-0 right-0 md:top-auto md:left-auto md:right-auto bg-white md:bg-transparent border-t md:border-t-0 border-slate-200 md:border-0 py-4 md:py-0 flex-col md:flex-row gap-4 md:gap-6 px-4 md:px-0 shadow-lg md:shadow-none`}
            aria-label="Navigation principale"
          >
            <Link to="/catalog" className="nav-link px-4 md:px-0 py-2 md:py-0" onClick={closeNav}>Catalogue</Link>
            {user ? (
              <>
                {(user.role === 'CLIENT' || user.role === 'ADMIN') && (
                  <>
                    <Link to="/cart" className="nav-link px-4 md:px-0 py-2 md:py-0" onClick={closeNav}>Panier</Link>
                    <Link to="/orders" className="nav-link px-4 md:px-0 py-2 md:py-0" onClick={closeNav}>Mes commandes</Link>
                  </>
                )}
                {isAdmin && (
                  <div className="nav-admin border-t md:border-t-0 border-slate-200 md:border-l md:pl-6 md:ml-2 pt-4 md:pt-0 mt-2 md:mt-0">
                    <Link to="/admin/products" className="nav-link nav-link-admin px-4 md:px-0 py-2 md:py-0" onClick={closeNav}>Produits</Link>
                    <Link to="/admin/categories" className="nav-link nav-link-admin px-4 md:px-0 py-2 md:py-0" onClick={closeNav}>Catégories</Link>
                    <Link to="/admin/orders" className="nav-link nav-link-admin px-4 md:px-0 py-2 md:py-0" onClick={closeNav}>Commandes</Link>
                  </div>
                )}
                <span className="nav-user px-4 md:px-0 py-2 md:py-0">{user.username}</span>
                <button type="button" onClick={handleLogout} className="btn btn-ghost btn-sm nav-btn mx-4 md:mx-0 text-left">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link px-4 md:px-0 py-2 md:py-0" onClick={closeNav}>Connexion</Link>
                <Link to="/register" className="btn btn-primary btn-sm mx-4 md:mx-0" onClick={closeNav}>Inscription</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main id="main-content" className="main" tabIndex={-1}>
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
