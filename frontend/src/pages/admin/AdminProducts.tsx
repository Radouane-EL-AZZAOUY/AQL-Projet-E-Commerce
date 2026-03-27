import { useState } from 'react';
import { admin, type Product, type Category } from '../../api/client';
import AlertMessage from '../../components/AlertMessage';
import Modal from '../../components/Modal';
import LoadingState from '../../components/LoadingState';
import PageContainer from '../../components/PageContainer';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { useAsyncData } from '../../hooks/useAsyncData';

export default function AdminProducts() {
  const [categoriesFallback] = useState<Category[]>([]);
  const [page, setPage] = useState(0);
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: 0, stock: 0, categoryId: '' as number | '', imageUrl: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: categories } = useAsyncData<Category[]>(
    categoriesFallback,
    () => admin.categories.list(),
    [],
    () => ''
  );
  const { data: listData, loading, error: loadError } = useAsyncData<{ content: Product[]; totalPages: number } | null>(
    null,
    async () => {
      const res = await admin.products.list(page, 20);
      return { content: res.content, totalPages: res.totalPages };
    },
    [page, refreshKey]
  );
  const data = listData;
  const { error: actionError, run, setError: setActionError } = useAsyncAction();

  const handleSave = async () => {
    if (!form.name.trim()) { setActionError('Le nom est requis'); return; }
    setActionError('');
    setSuccess('');
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      categoryId: form.categoryId === '' ? undefined : form.categoryId,
    };
    const saved = await run(() => (
      editing
        ? admin.products.update(editing.id, payload)
        : admin.products.create(payload)
    ));
    if (saved) {
      setSuccess(editing ? 'Produit mis à jour.' : 'Produit créé.');
      handleCloseModal();
      setRefreshKey((k) => k + 1);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce produit ? Il ne sera plus visible dans le catalogue.')) return;
    setActionError('');
    const deleted = await run(() => admin.products.delete(id));
    if (deleted !== undefined) {
      setSuccess('Produit supprimé.');
      setRefreshKey((k) => k + 1);
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

  const error = loadError || actionError;

  return (
    <PageContainer>
      <h1 className="page-title">Admin — Produits</h1>
      {error && <AlertMessage kind="error" message={error} />}
      {success && <AlertMessage kind="success" message={success} />}

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
    </PageContainer>
  );
}
