import { useState } from 'react';
import { admin, type Order } from '../../api/client';
import AlertMessage from '../../components/AlertMessage';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import PageContainer from '../../components/PageContainer';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { useAsyncData } from '../../hooks/useAsyncData';

export default function AdminOrders() {
  const [success, setSuccess] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: list, loading, error: loadError } = useAsyncData<Order[]>(
    [],
    () => admin.orders.list(),
    [refreshKey]
  );
  const { error: actionError, run, setError: setActionError } = useAsyncAction();

  const handleStatusChange = async (orderId: number, status: string) => {
    setActionError('');
    setSuccess('');
    const updated = await run(() => admin.orders.updateStatus(orderId, status));
    if (updated) {
      setSuccess(status === 'CONFIRMED' ? 'Commande validée.' : 'Commande annulée.');
      setRefreshKey((k) => k + 1);
    }
  };

  const error = loadError || actionError;

  if (loading) {
    return (
      <PageContainer>
        <LoadingState />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="page-title">Admin — Commandes</h1>
      {error && <AlertMessage kind="error" message={error} />}
      {success && <AlertMessage kind="success" message={success} />}

      {list.length === 0 ? (
        <EmptyState icon="📦" title="Aucune commande." />
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
                    <OrderStatusBadge status={o.status} pendingVariant="warning" />
                  </td>
                  <td>
                    {o.status === 'PENDING' && (
                      <span className="flex gap-2">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleStatusChange(o.id, 'CONFIRMED')}
                        >
                          Valider
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleStatusChange(o.id, 'CANCELLED')}
                        >
                          Annuler
                        </button>
                      </span>
                    )}
                    {o.status !== 'PENDING' && <OrderStatusBadge status={o.status} pendingVariant="warning" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
}
