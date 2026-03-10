import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cart as cartApi, type Cart as CartType } from '../api/client';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

export default function Cart() {
  const [data, setData] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    cartApi
      .get()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur'))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const handleUpdate = async (productId: number, quantity: number) => {
    try {
      const updated = await cartApi.updateItem(productId, quantity);
      setData(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleRemove = async (productId: number) => {
    try {
      const updated = await cartApi.removeItem(productId);
      setData(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

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
  if (!data || data.items.length === 0) {
    return (
      <div className="container page">
        <h1 className="page-title">Panier</h1>
        <EmptyState icon="🛒" title="Votre panier est vide.">
          <Link to="/catalog" className="btn btn-primary mt-4">Voir le catalogue</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container page">
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
    </div>
  );
}
