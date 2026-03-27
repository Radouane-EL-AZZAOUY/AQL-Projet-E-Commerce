import { Link } from 'react-router-dom';
import { orders as ordersApi, type Order } from '../api/client';
import AlertMessage from '../components/AlertMessage';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import OrderStatusBadge from '../components/OrderStatusBadge';
import PageContainer from '../components/PageContainer';
import { useAsyncData } from '../hooks/useAsyncData';

export default function MyOrders() {
  const { data: list, loading, error } = useAsyncData<Order[]>(
    [],
    () => ordersApi.myOrders(),
    []
  );

  if (loading) {
    return (
      <PageContainer>
        <LoadingState />
      </PageContainer>
    );
  }
  if (error) {
    return (
      <PageContainer>
        <AlertMessage kind="error" message={error} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
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
                <OrderStatusBadge status={o.status} />
              </div>
              <Link to={`/orders/${o.id}`} className="btn btn-secondary btn-sm">Détail</Link>
            </article>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
