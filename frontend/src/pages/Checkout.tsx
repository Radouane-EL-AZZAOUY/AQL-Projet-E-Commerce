import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cart as cartApi, orders } from '../api/client';

export default function Checkout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cartApi
      .get()
      .then((c) => {
        if (!c.items.length) navigate('/cart');
      })
      .catch(() => setError('Erreur chargement du panier'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleConfirm = async () => {
    setError('');
    setSubmitting(true);
    try {
      const c = await cartApi.get();
      const order = await orders.create(c.items.map((i) => ({ productId: i.productId, quantity: i.quantity })));
      await orders.confirm(order.id);
      await cartApi.clear();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSubmitting(false);
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
      <h1 className="page-title">Valider la commande</h1>
      <div className="card" style={{ maxWidth: 480 }}>
        <p className="page-subtitle" style={{ marginBottom: '1.25rem' }}>
          Votre panier sera converti en commande définitive. Une fois validée, la commande ne pourra plus être modifiée.
        </p>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="checkout-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/cart')}>
            Retour au panier
          </button>
          <button type="button" className="btn btn-primary" onClick={handleConfirm} disabled={submitting}>
            {submitting ? <span className="loading-spinner" /> : null}
            {submitting ? ' Validation...' : 'Confirmer la commande'}
          </button>
        </div>
      </div>
      <style>{`
        .checkout-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
      `}</style>
    </div>
  );
}
