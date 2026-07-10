import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiSave, FiUpload } from 'react-icons/fi';
import PageHeader from '../../components/admin/PageHeader';
import Skeleton from '../../components/ui/Skeleton';
import { settingsAPI } from '../../api/services';
import { getUploadUrl } from '../../api/axios';

const emptyForm = {
  websiteTitle: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  themeColor: '#3B82F6',
  footerText: '',
};

const SettingsManage = () => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [currentLogo, setCurrentLogo] = useState('');
  const [currentFavicon, setCurrentFavicon] = useState('');

  useEffect(() => {
    settingsAPI
      .get()
      .then(({ data }) => {
        const s = data.data;
        setForm({
          websiteTitle: s.websiteTitle || '',
          seoTitle: s.seoTitle || '',
          seoDescription: s.seoDescription || '',
          seoKeywords: (s.seoKeywords || []).join(', '),
          themeColor: s.themeColor || '#3B82F6',
          footerText: s.footerText || '',
        });
        setCurrentLogo(s.logo || '');
        setCurrentFavicon(s.favicon || '');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'seoKeywords') {
          fd.append(k, JSON.stringify(v.split(',').map((s) => s.trim()).filter(Boolean)));
        } else {
          fd.append(k, v);
        }
      });
      if (logoFile) fd.append('logo', logoFile);
      if (faviconFile) fd.append('favicon', faviconFile);

      const { data } = await settingsAPI.update(fd);
      setCurrentLogo(data.data.logo || '');
      setCurrentFavicon(data.data.favicon || '');
      setLogoFile(null);
      setFaviconFile(null);
      toast.success('Settings updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Settings" subtitle="Configure your website" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure global website settings" />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-semibold mb-1">General</h3>
          <input
            placeholder="Website Title"
            value={form.websiteTitle}
            onChange={(e) => setForm({ ...form, websiteTitle: e.target.value })}
            className="input-field"
          />
          <textarea
            placeholder="Footer Text"
            rows={2}
            value={form.footerText}
            onChange={(e) => setForm({ ...form, footerText: e.target.value })}
            className="input-field resize-none"
          />
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-400">Theme Color</label>
            <input
              type="color"
              value={form.themeColor}
              onChange={(e) => setForm({ ...form, themeColor: e.target.value })}
              className="w-12 h-9 rounded-lg bg-transparent border border-white/10 cursor-pointer"
            />
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="font-semibold mb-1">Logo & Favicon</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-2">Logo</p>
              <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 mb-2 flex items-center justify-center overflow-hidden">
                {(logoFile && <img src={URL.createObjectURL(logoFile)} className="w-full h-full object-cover" alt="" />) ||
                  (currentLogo && <img src={getUploadUrl(currentLogo)} className="w-full h-full object-cover" alt="" />)}
              </div>
              <label className="btn-secondary cursor-pointer !py-2 !px-3 text-xs">
                <FiUpload size={12} /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setLogoFile(e.target.files[0])} />
              </label>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-2">Favicon</p>
              <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 mb-2 flex items-center justify-center overflow-hidden">
                {(faviconFile && <img src={URL.createObjectURL(faviconFile)} className="w-full h-full object-cover" alt="" />) ||
                  (currentFavicon && <img src={getUploadUrl(currentFavicon)} className="w-full h-full object-cover" alt="" />)}
              </div>
              <label className="btn-secondary cursor-pointer !py-2 !px-3 text-xs">
                <FiUpload size={12} /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setFaviconFile(e.target.files[0])} />
              </label>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="font-semibold mb-1">SEO</h3>
          <input
            placeholder="SEO Title"
            value={form.seoTitle}
            onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
            className="input-field"
          />
          <textarea
            placeholder="SEO Description"
            rows={2}
            value={form.seoDescription}
            onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
            className="input-field resize-none"
          />
          <input
            placeholder="SEO Keywords (comma separated)"
            value={form.seoKeywords}
            onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })}
            className="input-field"
          />
        </div>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          <FiSave size={15} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default SettingsManage;
