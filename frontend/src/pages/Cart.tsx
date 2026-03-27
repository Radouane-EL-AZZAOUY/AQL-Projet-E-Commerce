import { Link } from 'react-router-dom';
import { cart as cartApi, type Cart as CartType } from '../api/client';
import AlertMessage from '../components/AlertMessage';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import PageContainer from '../components/PageContainer';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { useAsyncData } from '../hooks/useAsyncData';

export default function Cart() {
  const { data, setData, loading, error: loadError } = useAsyncData<CartType | null>(
    null,
    () => cartApi.get(),
    []
  );
  const { error: actionError, run } = useAsyncAction();

  const handleUpdate = async (productId: number, quantity: number) => {
    const updated = await run(() => cartApi.updateItem(productId, quantity));
    if (updated) setData(updated);
  };

  const handleRemove = async (productId: number) => {
    const updated = await run(() => cartApi.removeItem(productId));
    if (updated) setData(updated);
  };

  const error = loadError || actionError;

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
  if (!data || data.items.length === 0) {
    return (
      <PageContainer>
        <h1 className="page-title">Panier</h1>
        <EmptyState icon="🛒" title="Votre panier est vide.">
          <Link to="/catalog" className="btn btn-primary mt-4">Voir le catalogue</Link>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="page-title">Panier</h1>
      <div className="card table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Prix unitaire</th>
              <th>Quantité</th>
              <th>Sous-total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.productName}</strong></td>
                <td>{item.unitPrice.toFixed(2)} €</td>
                <td>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => handleUpdate(item.productId, Math.max(1, Number(e.target.value) || 1))}
                    className="input-qty"
                    aria-label={`Quantité pour ${item.productName}`}
                  />
                </td>
                <td>{item.subtotal.toFixed(2)} €</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemove(item.productId)}
                    aria-label={`Supprimer ${item.productName} du panier`}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="cart-footer">
        <p className="cart-total">Total : <strong>{data.totalAmount.toFixed(2)} €</strong></p>
        <Link to="/checkout" className="btn btn-primary">Passer la commande</Link>
      </div>
    </PageContainer>
  );
}
