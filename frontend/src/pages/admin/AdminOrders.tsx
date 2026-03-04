import { useState, useEffect } from 'react';
import { admin, type Order } from '../../api/client';

export default function AdminOrders() {
  const [list, setList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = () => {
    setLoading(true);
    admin.orders
      .list()
      .then(setList)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur'))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const handleStatusChange = async (orderId: number, status: string) => {
    setError('');
    setSuccess('');
    try {
      await admin.orders.updateStatus(orderId, status);
      setSuccess(status === 'CONFIRMED' ? 'Commande validée.' : 'Commande annulée.');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  if (loading) {
    return (
      <div className="container page">
        <div className="empty-state"><span className="loading-spinner" style={{ display: 'block', margin: '2rem auto' }} /></div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 className="page-title">Admin — Commandes</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {list.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📦</div>
          <p>Aucune commande.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id}>
                  <td><strong>#{o.id}</strong></td>
                  <td>{o.username}</td>
                  <td>{new Date(o.createdAt).toLocaleString('fr-FR')}</td>
                  <td>{o.totalAmount.toFixed(2)} €</td>
                  <td>
                    <span className={`badge badge-${o.status === 'CONFIRMED' ? 'success' : o.status === 'CANCELLED' ? 'error' : 'warning'}`}>
                      {o.status === 'CONFIRMED' ? 'Validée' : o.status === 'CANCELLED' ? 'Annulée' : 'En attente'}
                    </span>
                  </td>
                  <td>
                    {o.status === 'PENDING' && (
                      <>
                        <button type="button" className="btn btn-primary btn-sm" style={{ marginRight: '0.5rem' }} onClick={() => handleStatusChange(o.id, 'CONFIRMED')}>
                          Valider
                        </button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleStatusChange(o.id, 'CANCELLED')}>
                          Annuler
                        </button>
                      </>
                    )}
                    {o.status === 'CONFIRMED' && <span className="badge badge-success">Validée</span>}
                    {o.status === 'CANCELLED' && <span className="badge badge-error">Annulée</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
