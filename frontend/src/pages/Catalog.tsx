import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products, categories, type Product, type Category } from '../api/client';

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
    <div className="container page catalog-page">
      <h1 className="page-title">Catalogue</h1>
      <div className="catalog-toolbar">
        <input
          type="search"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="search-input"
        />
        <select
          value={categoryId}
          onChange={(e) => { setCategoryId(e.target.value === '' ? '' : Number(e.target.value)); setPage(0); }}
          className="filter-select"
        >
          <option value="">Toutes les catégories</option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <div className="empty-state">
          <span className="loading-spinner" style={{ display: 'block', margin: '2rem auto' }} />
          <p>Chargement du catalogue...</p>
        </div>
      ) : data ? (
        <>
          <p className="catalog-count">{data.totalElements} produit(s)</p>
          <div className="product-grid">
            {(data.content ?? []).map((p) => (
              <div key={p.id} className="product-card card">
                <div className="product-card-body">
                  <span className="product-category">{p.categoryName || '—'}</span>
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-price">{Number(p.price).toFixed(2)} €</p>
                  <Link to={`/products/${p.id}`} className="btn btn-primary btn-block btn-sm">
                    Voir le produit
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {data.totalPages > 1 && (
            <div className="pagination">
              <button type="button" className="btn btn-secondary btn-sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                Précédent
              </button>
              <span className="pagination-info">Page {page + 1} / {data.totalPages}</span>
              <button type="button" className="btn btn-secondary btn-sm" disabled={page >= data.totalPages - 1} onClick={() => setPage((p) => p + 1)}>
                Suivant
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="card empty-state catalog-empty">
          <p>Aucun produit à afficher.</p>
          <p className="catalog-empty-hint">Vérifiez que le backend est démarré (port 8081) et que l’API répond sur <code>/api/products</code>.</p>
        </div>
      )}
      <style>{`
        .catalog-page { min-height: 50vh; }
        .catalog-empty { min-height: 120px; }
        .catalog-empty-hint { font-size: 0.9rem; margin-top: 0.5rem; color: var(--color-text-muted); }
        .catalog-empty code { background: var(--color-border); padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.85em; }
        .catalog-toolbar { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .search-input { flex: 1; min-width: 200px; padding: 0.6rem 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.95rem; }
        .search-input:focus { outline: none; border-color: var(--color-primary); }
        .filter-select { padding: 0.6rem 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm); min-width: 180px; }
        .catalog-count { color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 1rem; }
        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; }
        .product-card { padding: 1.25rem; display: flex; flex-direction: column; }
        .product-card-body { display: flex; flex-direction: column; flex: 1; }
        .product-category { font-size: 0.8rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem; }
        .product-name { font-size: 1.05rem; font-weight: 600; margin-bottom: 0.5rem; line-height: 1.3; }
        .product-price { font-size: 1.2rem; font-weight: 700; color: var(--color-primary); margin-bottom: 1rem; }
        .pagination { display: flex; align-items: center; gap: 1rem; margin-top: 2rem; justify-content: center; flex-wrap: wrap; }
        .pagination-info { font-size: 0.9rem; color: var(--color-text-muted); }
      `}</style>
    </div>
  );
}
