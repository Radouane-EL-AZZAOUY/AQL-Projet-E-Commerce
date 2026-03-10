import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cart as cartApi, orders } from '../api/client';
import LoadingState from '../components/LoadingState';

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
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="container page">
      <h1 className="page-title">Valider la commande</h1>
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 max-w-[480px] p-8">
        <p className="page-subtitle mb-6">
          Votre panier sera converti en commande définitive. Une fois validée, la commande ne pourra plus être modifiée.
        </p>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="flex gap-4 flex-wrap">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/cart')}>
            Retour au panier
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? <span className="loading-spinner" /> : null}
            {submitting ? ' Validation...' : 'Confirmer la commande'}
          </button>
        </div>
      </div>
    </div>
  );
}
