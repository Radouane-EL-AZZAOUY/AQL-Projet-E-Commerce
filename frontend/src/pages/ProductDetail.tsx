import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { products, cart } from '../api/client';
import BackLink from '../components/BackLink';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ProductImage from '../components/ProductImage';

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
        <LoadingState />
      </div>
    );
  }
  if (!product) {
    return (
      <div className="container page">
        <EmptyState title="Produit introuvable.">
          <Link to="/catalog" className="btn btn-secondary mt-4">Retour au catalogue</Link>
        </EmptyState>
      </div>
    );
  }

  const maxQty = Math.max(0, product.stock);

  return (
    <div className="container page">
      <BackLink to="/catalog">Retour au catalogue</BackLink>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Product image */}
          <div className="bg-slate-100 flex items-center justify-center min-h-[280px] lg:min-h-[400px] aspect-square lg:aspect-auto overflow-hidden">
            <ProductImage
              src={product.imageUrl}
              alt={product.name}
              iconClassName="w-24 h-24 mx-auto text-slate-400"
              placeholderLabel="Image produit"
            />
          </div>

          {/* Product info */}
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
            <span className="inline-block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              {product.categoryName || '—'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-primary mb-6">{product.price.toFixed(2)} €</p>

            {product.description && (
              <p className="text-slate-600 leading-relaxed mb-4">{product.description}</p>
            )}
            <p className="text-sm text-slate-500 mb-6">
              En stock : <span className="font-semibold text-slate-700">{product.stock}</span> unité(s)
            </p>

            {token && product.stock > 0 && (
              <div className="mt-auto pt-6 border-t border-slate-200">
                <div className="flex flex-wrap items-end gap-4">
                  <div className="form-group mb-0 flex-1 min-w-[100px] max-w-[120px]">
                    <label htmlFor="product-qty">Quantité</label>
                    <input
                      id="product-qty"
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
                </div>
                {message && (
                  <p className={`mt-4 mb-0 ${message.startsWith('Produit') ? 'alert alert-success' : 'alert alert-error'}`}>
                    {message}
                  </p>
                )}
              </div>
            )}
            {!token && (
              <p className="text-slate-500 text-sm mt-6">
                Connectez-vous pour ajouter ce produit au panier.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
