import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orders as ordersApi, type Order } from '../api/client';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    setOrder(null);
    if (!id || Number.isNaN(Number(id))) {
      setLoading(false);
      setError('Commande introuvable');
      return;
    }
    setLoading(true);
    ordersApi
      .getById(Number(id))
      .then(setOrder)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading && !error) {
    return (
      <div className="container page">
        <div className="empty-state"><span className="loading-spinner" style={{ display: 'block', margin: '2rem auto' }} /></div>
      </div>
    );
  }
  if (error || !order) {
    return (
      <div className="container page">
        <div className="card">
          <div className="alert alert-error">{error || 'Commande introuvable'}</div>
          <Link to="/orders" className="btn btn-secondary">Mes commandes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <Link to="/orders" className="back-link">← Mes commandes</Link>
      <div className="card">
        <h1 className="page-title">Commande #{order.id}</h1>
        <div className="order-meta">
          <p>Date : {new Date(order.createdAt).toLocaleString('fr-FR')}</p>
          <p>Statut : <span className={`badge badge-${order.status === 'CONFIRMED' ? 'success' : order.status === 'CANCELLED' ? 'error' : 'neutral'}`}>
            {order.status === 'CONFIRMED' ? 'Validée' : order.status === 'CANCELLED' ? 'Annulée' : 'En attente'}
          </span></p>
          <p className="order-total">Total : <strong>{order.totalAmount.toFixed(2)} €</strong></p>
        </div>
        <h3 className="card-header">Détail des articles</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Sous-total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unitPrice.toFixed(2)} €</td>
                  <td>{item.subtotal.toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .back-link { display: inline-block; margin-bottom: 1rem; font-size: 0.9rem; color: var(--color-text-muted); }
        .back-link:hover { color: var(--color-primary); }
        .order-meta { margin-bottom: 1.5rem; }
        .order-meta p { margin-bottom: 0.35rem; }
        .order-total { font-size: 1.1rem; margin-top: 0.5rem; }
      `}</style>
    </div>
  );
}
