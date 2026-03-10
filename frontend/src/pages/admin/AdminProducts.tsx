import { useState, useEffect } from 'react';
import { admin, type Product, type Category } from '../../api/client';
import Modal from '../../components/Modal';
import LoadingState from '../../components/LoadingState';

export default function AdminProducts() {
  const [data, setData] = useState<{ content: Product[]; totalPages: number } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: 0, stock: 0, categoryId: '' as number | '', imageUrl: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        imageUrl: form.imageUrl.trim() || undefined,
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
      handleCloseModal();
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
    setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, categoryId: p.categoryId ?? '', imageUrl: p.imageUrl || '' });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: 0, stock: 0, categoryId: '', imageUrl: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: 0, stock: 0, categoryId: '', imageUrl: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="container page">
      <h1 className="page-title">Admin — Produits</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="flex justify-end mb-4">
        <button type="button" className="btn btn-primary" onClick={handleCreate}>
          Nouveau produit
        </button>
      </div>

      {loading ? (
        <LoadingState />
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
                      <button type="button" className="btn btn-secondary btn-sm mr-2" onClick={() => openEdit(p)}>Modifier</button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.totalPages > 1 && (
            <nav className="pagination" aria-label="Pagination produits">
              <button type="button" className="btn btn-secondary btn-sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Précédent</button>
              <span className="pagination-info">Page {page + 1} / {data.totalPages}</span>
              <button type="button" className="btn btn-secondary btn-sm" disabled={page >= data.totalPages - 1} onClick={() => setPage((p) => p + 1)}>Suivant</button>
            </nav>
          )}
        </>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editing ? 'Modifier le produit' : 'Nouveau produit'}
      >
        <div className="form-group mb-4">
          <label htmlFor="product-image">URL de l&apos;image</label>
          <input
            id="product-image"
            type="url"
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            placeholder="https://exemple.com/image.jpg"
          />
        </div>
        <div className="form-row mb-4">
          <div className="form-group">
            <label htmlFor="product-name">Nom</label>
            <input
              id="product-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Nom du produit"
            />
          </div>
          <div className="form-group">
            <label htmlFor="product-desc">Description</label>
            <input
              id="product-desc"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Description (optionnel)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="product-cat">Catégorie</label>
            <select
              id="product-cat"
              value={form.categoryId}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  categoryId: e.target.value === '' ? '' : Number(e.target.value),
                }))
              }
            >
              <option value="">— Aucune —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="product-price">Prix (€)</label>
            <input
              id="product-price"
              type="number"
              step="0.01"
              min={0}
              value={form.price || ''}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  price: Number(e.target.value) || 0,
                }))
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="product-stock">Stock</label>
            <input
              id="product-stock"
              type="number"
              min={0}
              value={form.stock || ''}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  stock: Number(e.target.value) || 0,
                }))
              }
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
            Annuler
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Enregistrer
          </button>
        </div>
      </Modal>
    </div>
  );
}
