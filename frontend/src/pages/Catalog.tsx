import { useState } from 'react';
import { Link } from 'react-router-dom';
import { products, categories, type Product, type Category } from '../api/client';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ProductImage from '../components/ProductImage';
import { useAsyncData } from '../hooks/useAsyncData';

export default function Catalog() {
  const [catsFallback] = useState<Category[]>([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const { data: cats } = useAsyncData<Category[]>(
    catsFallback,
    () => categories.list(),
    [],
    () => ''
  );
  const { data, loading, error } = useAsyncData<{ content: Product[]; totalPages: number; totalElements: number } | null>(
    null,
    async () => {
      const res = await products.list(page, 12, search || undefined, categoryId === '' ? undefined : categoryId);
      const content = Array.isArray(res?.content) ? res.content : [];
      return {
        content,
        totalPages: res?.totalPages ?? 0,
        totalElements: res?.totalElements ?? content.length,
      };
    },
    [page, search, categoryId],
    (err) => (err instanceof Error ? err.message : String(err))
  );

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
                  <ProductImage src={p.imageUrl} alt={p.name} />
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
