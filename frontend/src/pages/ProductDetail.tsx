import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { products, cart } from '../api/client';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [product, setProduct] = useState<Awaited<ReturnType<typeof products.getById>> | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || Number.isNaN(Number(id))) {
      setLoading(false);
      setProduct(null);
      return;
    }
    products
      .getById(Number(id))
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || !token) return;
    setMessage('');
    try {
      await cart.addItem(product.id, quantity);
      setMessage('Produit ajouté au panier.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Erreur');
    }
  };

  if (loading) {
    return (
      <div className="container page">
        <div className="empty-state"><span className="loading-spinner" style={{ display: 'block', margin: '2rem auto' }} /></div>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="container page">
        <div className="card">
          <p>Produit introuvable.</p>
          <Link to="/catalog" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Retour au catalogue</Link>
        </div>
      </div>
    );
  }

  const maxQty = Math.max(0, product.stock);

  return (
    <div className="container page">
      <Link to="/catalog" className="back-link">← Retour au catalogue</Link>
      <div className="product-detail card">
        <div className="product-detail-main">
          <span className="product-category">{product.categoryName || '—'}</span>
          <h1 className="product-detail-title">{product.name}</h1>
          <p className="product-detail-price">{product.price.toFixed(2)} €</p>
          {product.description && <p className="product-detail-desc">{product.description}</p>}
          <p className="product-detail-stock">En stock : {product.stock} unité(s)</p>
          {token && product.stock > 0 && (
            <div className="product-detail-actions">
              <div className="form-group" style={{ marginBottom: '0.75rem', maxWidth: 100 }}>
                <label>Quantité</label>
                <input
                  type="number"
                  min={1}
                  max={maxQty}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(maxQty, Number(e.target.value) || 1)))}
                />
              </div>
              <button type="button" className="btn btn-primary" onClick={handleAddToCart}>
                Ajouter au panier
              </button>
              {message && <p className={message.startsWith('Produit') ? 'alert alert-success' : 'alert alert-error'} style={{ marginTop: '0.5rem', marginBottom: 0 }}>{message}</p>}
            </div>
          )}
          {!token && <p className="product-detail-login">Connectez-vous pour ajouter ce produit au panier.</p>}
        </div>
      </div>
      <style>{`
        .back-link { display: inline-block; margin-bottom: 1rem; font-size: 0.9rem; color: var(--color-text-muted); }
        .back-link:hover { color: var(--color-primary); }
        .product-detail { max-width: 560px; padding: 1.75rem; }
        .product-detail-main { }
        .product-category { font-size: 0.8rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .product-detail-title { font-size: 1.5rem; font-weight: 700; margin: 0.35rem 0 0.5rem; }
        .product-detail-price { font-size: 1.5rem; font-weight: 700; color: var(--color-primary); margin-bottom: 1rem; }
        .product-detail-desc { color: var(--color-text-muted); margin-bottom: 1rem; line-height: 1.5; }
        .product-detail-stock { font-size: 0.9rem; margin-bottom: 1rem; }
        .product-detail-actions { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 0.75rem; }
        .product-detail-login { color: var(--color-text-muted); font-size: 0.9rem; }
      `}</style>
    </div>
  );
}
