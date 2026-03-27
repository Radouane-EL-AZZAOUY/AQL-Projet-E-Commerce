import { useParams } from 'react-router-dom';
import { orders as ordersApi, type Order } from '../api/client';
import AlertMessage from '../components/AlertMessage';
import BackLink from '../components/BackLink';
import LoadingState from '../components/LoadingState';
import OrderStatusBadge from '../components/OrderStatusBadge';
import PageContainer from '../components/PageContainer';
import { useAsyncData } from '../hooks/useAsyncData';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: order, loading, error } = useAsyncData<Order | null>(
    null,
    async () => {
      if (!id || Number.isNaN(Number(id))) {
        throw new Error('Commande introuvable');
      }
      return ordersApi.getById(Number(id));
    },
    [id]
  );

  if (loading && !error) {
    return (
      <PageContainer>
        <LoadingState />
      </PageContainer>
    );
  }
  if (error || !order) {
    return (
      <PageContainer>
        <div className="card">
          <AlertMessage kind="error" message={error || 'Commande introuvable'} />
          <BackLink to="/orders">← Retour aux commandes</BackLink>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackLink to="/orders">← Mes commandes</BackLink>
      <div className="card">
        <h1 className="page-title">Commande #{order.id}</h1>
        <div className="order-meta">
          <p>Date : {new Date(order.createdAt).toLocaleString('fr-FR')}</p>
          <p>
            Statut :{' '}
            <OrderStatusBadge status={order.status} />
          </p>
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
    </PageContainer>
  );
}
