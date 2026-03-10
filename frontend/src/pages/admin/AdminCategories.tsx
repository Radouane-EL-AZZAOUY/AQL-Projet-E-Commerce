import { useState, useEffect } from 'react';
import { admin, type Category } from '../../api/client';
import Modal from '../../components/Modal';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';

export default function AdminCategories() {
  const [list, setList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [newName, setNewName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);

  const load = () => {
    setLoading(true);
    admin.categories
      .list()
      .then(setList)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur'))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const handleCreate = async (name: string) => {
    if (!name.trim()) return;
    setError('');
    setSuccess('');
    try {
      await admin.categories.create({ name: name.trim() });
      setNewName('');
      setSuccess('Catégorie créée.');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const startEdit = (c: Category) => {
    setEditing(c);
    setEditName(c.name);
    setIsEditModal(true);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editing || !editName.trim()) return;
    setError('');
    setSuccess('');
    try {
      await admin.categories.update(editing.id, { name: editName.trim() });
      closeModal();
      setSuccess('Catégorie mise à jour.');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const openCreateModal = () => {
    setEditing(null);
    setEditName('');
    setIsEditModal(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditModal(false);
    setEditing(null);
    setEditName('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    setError('');
    try {
      await admin.categories.delete(id);
      setSuccess('Catégorie supprimée.');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  return (
    <div className="container page">
      <h1 className="page-title">Admin — Catégories</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="flex justify-end mb-4">
        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          Nouvelle catégorie
        </button>
      </div>

      {loading ? (
        <LoadingState />
      ) : list.length === 0 ? (
        <EmptyState title="Aucune catégorie. Ajoutez-en une ci-dessus." />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => startEdit(c)}
                      className="cursor-pointer font-medium text-left hover:text-primary transition-colors"
                    >
                      {c.name}
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(c.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditModal ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
      >
        <div className="form-group mb-4">
          <label htmlFor="category-name">Nom</label>
          <input
            id="category-name"
            value={isEditModal ? editName : newName}
            onChange={(e) =>
              isEditModal ? setEditName(e.target.value) : setNewName(e.target.value)
            }
            placeholder="Nom de la catégorie"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={closeModal}>
            Annuler
          </button>
          {isEditModal ? (
            <button type="button" className="btn btn-primary" onClick={handleUpdate}>
              Enregistrer
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleCreate(newName)}
            >
              Ajouter
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
}
