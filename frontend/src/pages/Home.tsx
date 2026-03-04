import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container page">
      <section className="hero">
        <h1 className="hero-title">Bienvenue sur E-Commerce</h1>
        <p className="hero-subtitle">
          Découvrez notre catalogue, ajoutez des articles à votre panier et passez commande en toute simplicité.
        </p>
        <div className="hero-actions">
          <Link to="/catalog" className="btn btn-primary btn-lg">Voir le catalogue</Link>
          <Link to="/register" className="btn btn-secondary btn-lg">Créer un compte</Link>
        </div>
      </section>
      <style>{`
        .hero { text-align: center; padding: 3rem 1rem 4rem; max-width: 560px; margin: 0 auto; }
        .hero-title { font-size: 1.85rem; font-weight: 700; margin-bottom: 0.75rem; letter-spacing: -0.03em; line-height: 1.25; }
        .hero-subtitle { color: var(--color-text-muted); margin-bottom: 1.75rem; font-size: 1.05rem; }
        .hero-actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
        .btn-lg { padding: 0.7rem 1.4rem; font-size: 1rem; }
      `}</style>
    </div>
  );
}
