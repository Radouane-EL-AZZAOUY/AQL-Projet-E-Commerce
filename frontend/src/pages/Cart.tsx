import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cart as cartApi, type Cart as CartType } from '../api/client';

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
  if (!data || data.items.length === 0) {
    return (
      <div className="container page">
        <h1 className="page-title">Panier</h1>
        <div className="card empty-state">
          <div className="empty-state-icon">🛒</div>
          <p>Votre panier est vide.</p>
          <Link to="/catalog" className="btn btn-primary" style={{ marginTop: '1rem' }}>Voir le catalogue</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 className="page-title">Panier</h1>
      {error && <div className="alert alert-error">{error}</div>}
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
                    className="cart-qty-input"
                  />
                </td>
                <td>{item.subtotal.toFixed(2)} €</td>
                <td>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemove(item.productId)}>
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
      <style>{`
        .cart-qty-input { width: 64px; padding: 0.4rem 0.5rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm); text-align: center; }
        .cart-footer { margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .cart-total { font-size: 1.15rem; }
      `}</style>
    </div>
  );
}
