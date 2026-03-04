import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orders as ordersApi, type Order } from '../api/client';

export default function MyOrders() {
  const [list, setList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    ordersApi
      .myOrders()
      .then(setList)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container page">
        <div className="empty-state"><span className="loading-spinner" style={{ display: 'block', margin: '2rem auto' }} /></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container page">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 className="page-title">Mes commandes</h1>
      {list.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📦</div>
          <p>Aucune commande pour le moment.</p>
          <Link to="/catalog" className="btn btn-primary" style={{ marginTop: '1rem' }}>Voir le catalogue</Link>
        </div>
      ) : (
        <div className="order-list">
          {list.map((o) => (
            <div key={o.id} className="card order-item">
              <div className="order-item-main">
                <strong>Commande #{o.id}</strong>
                <span className="order-date">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</span>
                <span className="order-amount">{o.totalAmount.toFixed(2)} €</span>
                <span className={`badge badge-${o.status === 'CONFIRMED' ? 'success' : o.status === 'CANCELLED' ? 'error' : 'neutral'}`}>
                  {o.status === 'CONFIRMED' ? 'Validée' : o.status === 'CANCELLED' ? 'Annulée' : 'En attente'}
                </span>
              </div>
              <Link to={`/orders/${o.id}`} className="btn btn-secondary btn-sm">Détail</Link>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .order-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .order-item { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; }
        .order-item-main { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .order-date { color: var(--color-text-muted); font-size: 0.9rem; }
        .order-amount { font-weight: 600; }
      `}</style>
    </div>
  );
}
