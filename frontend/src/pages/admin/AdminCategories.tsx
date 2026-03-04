import { useState, useEffect } from 'react';
import { admin, type Category } from '../../api/client';

export default function AdminCategories() {
  const [list, setList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [newName, setNewName] = useState('');

  const load = () => {
    setLoading(true);
    admin.categories
      .list()
      .then(setList)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur'))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setError('');
    setSuccess('');
    try {
      await admin.categories.create({ name: newName.trim() });
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
  };

  const handleUpdate = async () => {
    if (!editing || !editName.trim()) return;
    setError('');
    setSuccess('');
    try {
      await admin.categories.update(editing.id, { name: editName.trim() });
      setEditing(null);
      setEditName('');
      setSuccess('Catégorie mise à jour.');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
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

      <div className="card admin-form-card">
        <h3 className="card-header">Nouvelle catégorie</h3>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
            <label>Nom</label>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nom de la catégorie" />
          </div>
          <button type="button" className="btn btn-primary" onClick={handleCreate}>Ajouter</button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state"><span className="loading-spinner" style={{ display: 'block', margin: '2rem auto' }} /></div>
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
                    {editing?.id === c.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input value={editName} onChange={(e) => setEditName(e.target.value)} style={{ maxWidth: 220 }} onKeyDown={(e) => e.key === 'Enter' && handleUpdate()} />
                        <button type="button" className="btn btn-primary btn-sm" onClick={handleUpdate}>Enregistrer</button>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setEditing(null); setEditName(''); }}>Annuler</button>
                      </div>
                    ) : (
                      <span onClick={() => startEdit(c)} style={{ cursor: 'pointer', fontWeight: 500 }}>{c.name}</span>
                    )}
                  </td>
                  <td>
                    {editing?.id !== c.id && (
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Supprimer</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {list.length === 0 && !loading && (
        <div className="empty-state">
          <p>Aucune catégorie. Ajoutez-en une ci-dessus.</p>
        </div>
      )}
      <style>{`.admin-form-card { margin-bottom: 1.5rem; }`}</style>
    </div>
  );
}
