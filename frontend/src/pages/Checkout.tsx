import { useNavigate } from 'react-router-dom';
import { cart as cartApi, orders } from '../api/client';
import AlertMessage from '../components/AlertMessage';
import LoadingState from '../components/LoadingState';
import PageContainer from '../components/PageContainer';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { useAsyncData } from '../hooks/useAsyncData';

export default function Checkout() {
  const navigate = useNavigate();
  const { loading, error: loadError } = useAsyncData(
    null,
    async () => {
      const c = await cartApi.get();
      if (!c.items.length) navigate('/cart');
      return null;
    },
    [navigate],
    () => 'Erreur chargement du panier'
  );
  const { loading: submitting, error: submitError, run, setError: setSubmitError } = useAsyncAction();

  const handleConfirm = async () => {
    setSubmitError('');
    await run(async () => {
      const c = await cartApi.get();
      const order = await orders.create(c.items.map((i) => ({ productId: i.productId, quantity: i.quantity })));
      await orders.confirm(order.id);
      await cartApi.clear();
      navigate(`/orders/${order.id}`);
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="page-title">Valider la commande</h1>
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 max-w-[480px] p-8">
        <p className="page-subtitle mb-6">
          Votre panier sera converti en commande définitive. Une fois validée, la commande ne pourra plus être modifiée.
        </p>
        {(loadError || submitError) && <AlertMessage kind="error" message={loadError || submitError} />}
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
    </PageContainer>
  );
}
