import { useState, useEffect } from 'react';
import { admin, type Product, type Category } from '../../api/client';

export default function AdminProducts() {
  const [data, setData] = useState<{ content: Product[]; totalPages: number } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: 0, stock: 0, categoryId: '' as number | '' });

  const loadProducts = () => {
    setLoading(true);
    admin.products
      .list(page, 20)
      .then((res) => setData({ content: res.content, totalPages: res.totalPages }))
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    admin.categories.list().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => loadProducts(), [page]);

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Le nom est requis'); return; }
    setError('');
    setSuccess('');
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        categoryId: form.categoryId === '' ? undefined : form.categoryId,
      };
      if (editing) {
        await admin.products.update(editing.id, payload);
        setSuccess('Produit mis à jour.');
      } else {
        await admin.products.create(payload);
        setSuccess('Produit créé.');
      }
      setEditing(null);
      setForm({ name: '', description: '', price: 0, stock: 0, categoryId: '' });
      loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce produit ? Il ne sera plus visible dans le catalogue.')) return;
    setError('');
    try {
      await admin.products.delete(id);
      setSuccess('Produit supprimé.');
      loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, categoryId: p.categoryId ?? '' });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: 0, stock: 0, categoryId: '' });
  };

  return (
    <div className="container page">
      <h1 className="page-title">Admin — Produits</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card admin-form-card">
        <h3 className="card-header">{editing ? 'Modifier le produit' : 'Nouveau produit'}</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Nom</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nom du produit" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description (optionnel)" />
          </div>
          <div className="form-group">
            <label>Catégorie</label>
            <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value === '' ? '' : Number(e.target.value) }))}>
              <option value="">— Aucune —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Prix (€)</label>
            <input type="number" step="0.01" min={0} value={form.price || ''} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))} />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" min={0} value={form.stock || ''} onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) || 0 }))} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Enregistrer</button>
            {editing && <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Annuler</button>}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state"><span className="loading-spinner" style={{ display: 'block', margin: '2rem auto' }} /></div>
      ) : data && (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.categoryName || '—'}</td>
                    <td>{p.price.toFixed(2)} €</td>
                    <td>{p.stock}</td>
                    <td>
                      <button type="button" className="btn btn-secondary btn-sm" style={{ marginRight: '0.5rem' }} onClick={() => openEdit(p)}>Modifier</button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.totalPages > 1 && (
            <div className="pagination">
              <button type="button" className="btn btn-secondary btn-sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Précédent</button>
              <span className="pagination-info">Page {page + 1} / {data.totalPages}</span>
              <button type="button" className="btn btn-secondary btn-sm" disabled={page >= data.totalPages - 1} onClick={() => setPage((p) => p + 1)}>Suivant</button>
            </div>
          )}
        </>
      )}
      <style>{`
        .admin-form-card { margin-bottom: 1.5rem; }
        .form-row { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
        .pagination { display: flex; align-items: center; gap: 1rem; margin-top: 1.5rem; }
        .pagination-info { font-size: 0.9rem; color: var(--color-text-muted); }
      `}</style>
    </div>
  );
}
