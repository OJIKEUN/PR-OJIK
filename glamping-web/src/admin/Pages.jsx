import { useState, useEffect } from 'react';
import { getAdminPages, updatePage } from './adminApi';
import './AdminTable.css';
import './Modal.css';

const Pages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const response = await getAdminPages();
      setPages(response.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleEdit = (page) => {
    setEditing(page);
    setFormData({ title: page.title, content: page.content || '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePage(editing.id, formData);
      setEditing(null);
      fetchData();
    } catch (e) { alert('Gagal menyimpan'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="loading">Memuat...</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div><h1>Halaman</h1><p>Edit konten halaman statis</p></div>
      </div>

      {editing ? (
        <div className="page-editor">
          <form onSubmit={handleSubmit}>
            <div className="editor-header">
              <h2>Mengedit: {editing.slug}</h2>
              <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>← Kembali</button>
            </div>
            <div className="form-group">
              <label>Judul</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Konten (HTML)</label>
              <textarea rows="15" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
          </form>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Slug</th>
                <th>Judul</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id}>
                  <td><code>{page.slug}</code></td>
                  <td>{page.title}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(page)}>Edit Konten</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .page-editor { background: white; border-radius: 16px; padding: 2rem; }
        .editor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .editor-header h2 { margin: 0; color: #1f2937; }
        .page-editor .form-group { margin-bottom: 1.5rem; }
        .page-editor label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151; }
        .page-editor input, .page-editor textarea { width: 100%; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 8px; font-family: inherit; }
        .page-editor textarea { font-family: monospace; font-size: 0.9rem; }
        code { background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default Pages;
