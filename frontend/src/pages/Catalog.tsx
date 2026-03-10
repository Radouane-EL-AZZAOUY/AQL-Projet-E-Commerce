import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products, categories, type Product, type Category } from '../api/client';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

export default function Catalog() {
  const [data, setData] = useState<{ content: Product[]; totalPages: number; totalElements: number } | null>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    categories.list().then(setCats).catch(() => setCats([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    products
      .list(page, 12, search || undefined, categoryId === '' ? undefined : categoryId)
      .then((res) => {
        const content = Array.isArray(res?.content) ? res.content : [];
        setData({
          content,
          totalPages: res?.totalPages ?? 0,
          totalElements: res?.totalElements ?? content.length,
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [page, search, categoryId]);

  return (
    <div className="container page min-h-[50vh]">
      <div className="mb-8">
        <h1 className="page-title">Catalogue</h1>
        <div className="catalog-toolbar">
          <input
            type="search"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="search-input"
            aria-label="Rechercher un produit"
          />
          <select
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value === '' ? '' : Number(e.target.value)); setPage(0); }}
            className="filter-select"
            aria-label="Filtrer par catégorie"
          >
            <option value="">Toutes les catégories</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <LoadingState message="Chargement du catalogue..." />
      ) : data ? (
        <>
          <p className="catalog-count">{data.totalElements} produit(s)</p>
          <div className="product-grid">
            {(data.content ?? []).map((p) => (
              <article key={p.id} className="product-card">
                <Link to={`/products/${p.id}`} className="block aspect-square bg-slate-100 overflow-hidden rounded-t-xl">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </Link>
                <div className="product-card-body">
                  <span className="product-category">{p.categoryName || '—'}</span>
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-price">{Number(p.price).toFixed(2)} €</p>
                  <Link to={`/products/${p.id}`} className="btn btn-primary btn-block btn-sm">
                    Voir le produit
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {data.totalPages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                aria-label="Page précédente"
              >
                Précédent
              </button>
              <span className="pagination-info">Page {page + 1} / {data.totalPages}</span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={page >= data.totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Page suivante"
              >
                Suivant
              </button>
            </nav>
          )}
        </>
      ) : (
        <EmptyState title="Aucun produit à afficher.">
          <p className="catalog-empty-hint">
            Vérifiez que le backend est démarré (port 8081) et que l&apos;API répond sur <code>/api/products</code>.
          </p>
        </EmptyState>
      )}
    </div>
  );
}
