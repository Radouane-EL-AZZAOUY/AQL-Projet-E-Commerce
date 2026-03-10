import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orders as ordersApi, type Order } from '../api/client';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

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
        <LoadingState />
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
        <EmptyState icon="📦" title="Aucune commande pour le moment.">
          <Link to="/catalog" className="btn btn-primary mt-4">Voir le catalogue</Link>
        </EmptyState>
      ) : (
        <div className="order-list">
          {list.map((o) => (
            <article key={o.id} className="card order-item">
              <div className="order-item-main">
                <strong>Commande #{o.id}</strong>
                <span className="order-date">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</span>
                <span className="order-amount">{o.totalAmount.toFixed(2)} €</span>
                <span className={`badge badge-${o.status === 'CONFIRMED' ? 'success' : o.status === 'CANCELLED' ? 'error' : 'neutral'}`}>
                  {o.status === 'CONFIRMED' ? 'Validée' : o.status === 'CANCELLED' ? 'Annulée' : 'En attente'}
                </span>
              </div>
              <Link to={`/orders/${o.id}`} className="btn btn-secondary btn-sm">Détail</Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
