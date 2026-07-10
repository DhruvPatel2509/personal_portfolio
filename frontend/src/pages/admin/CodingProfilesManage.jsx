import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiSave, FiGithub, FiLinkedin, FiCode, FiTerminal } from 'react-icons/fi';
import PageHeader from '../../components/admin/PageHeader';
import Skeleton from '../../components/ui/Skeleton';
import { codingProfilesAPI } from '../../api/services';

const FIELDS = [
  { key: 'github', label: 'GitHub URL', icon: FiGithub },
  { key: 'linkedin', label: 'LinkedIn URL', icon: FiLinkedin },
  { key: 'leetcode', label: 'LeetCode URL', icon: FiCode },
  { key: 'hackerrank', label: 'HackerRank URL', icon: FiTerminal },
];

const CodingProfilesManage = () => {
  const [form, setForm] = useState({ github: '', linkedin: '', leetcode: '', hackerrank: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    codingProfilesAPI
      .get()
      .then(({ data }) =>
        setForm({
          github: data.data.github || '',
          linkedin: data.data.linkedin || '',
          leetcode: data.data.leetcode || '',
          hackerrank: data.data.hackerrank || '',
        })
      )
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await codingProfilesAPI.update(form);
      toast.success('Coding profiles updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Coding Profiles" subtitle="Manage links to your coding platform profiles" />

      {loading ? (
        <Skeleton className="h-72" />
      ) : (
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4 max-w-xl">
          {FIELDS.map(({ key, label, icon: Icon }) => (
            <div key={key} className="relative">
              <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                placeholder={label}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="input-field !pl-11"
              />
            </div>
          ))}
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            <FiSave size={15} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CodingProfilesManage;
