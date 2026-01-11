import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from './adminApi';
import './AdminTable.css';

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const response = await getSettings();
      setSettings(response.data || {});
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(settings);
      alert('Pengaturan berhasil disimpan!');
    } catch (e) { alert('Gagal menyimpan'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="loading">Memuat...</div>;

  const settingsFields = [
    { key: 'site_name', label: 'Nama Situs' },
    { key: 'site_email', label: 'Email Kontak' },
    { key: 'site_phone', label: 'Nomor Telepon' },
    { key: 'site_address', label: 'Alamat' },
    { key: 'whatsapp_number', label: 'Nomor WhatsApp' },
    { key: 'bank_name', label: 'Nama Bank' },
    { key: 'bank_account', label: 'Nomor Rekening Bank' },
    { key: 'bank_holder', label: 'Nama Pemilik Rekening' },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div><h1>Pengaturan</h1><p>Konfigurasi pengaturan website</p></div>
      </div>

      <div className="settings-card">
        <form onSubmit={handleSubmit}>
          {settingsFields.map((field) => (
            <div key={field.key} className="setting-row">
              <label>{field.label}</label>
              <input
                type="text"
                value={settings[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.label}
              />
            </div>
          ))}
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </form>
      </div>

      <style>{`
        .settings-card { background: white; border-radius: 16px; padding: 2rem; max-width: 600px; }
        .setting-row { display: flex; flex-direction: column; margin-bottom: 1.25rem; }
        .setting-row label { font-size: 0.9rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem; }
        .setting-row input { padding: 0.75rem 1rem; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 1rem; }
        .setting-row input:focus { outline: none; border-color: #10b981; }
        .settings-card .btn-primary { margin-top: 1rem; }
      `}</style>
    </div>
  );
};

export default Settings;
