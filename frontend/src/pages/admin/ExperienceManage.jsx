import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiBriefcase } from 'react-icons/fi';
import PageHeader from '../../components/admin/PageHeader';
import FormModal from '../../components/admin/FormModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Skeleton from '../../components/ui/Skeleton';
import { experienceAPI } from '../../api/services';

const emptyForm = { company: '', role: '', duration: '', description: '', order: 0 };

const ExperienceManage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    experienceAPI
      .getAll()
      .then(({ data }) => setItems(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      company: item.company,
      role: item.role,
      duration: item.duration,
      description: item.description || '',
      order: item.order || 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await experienceAPI.update(editing._id, form);
        toast.success('Experience updated');
      } else {
        await experienceAPI.create(form);
        toast.success('Experience added');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await experienceAPI.delete(deleteTarget._id);
      toast.success('Deleted successfully');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Experience"
        subtitle="Manage your work experience"
        action={
          <button onClick={openCreate} className="btn-primary !py-2.5">
            <FiPlus size={15} /> Add Experience
          </button>
        }
      />

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="glass-card-hover p-5 flex items-start gap-4">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-primary-400">
                <FiBriefcase size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{item.role}</p>
                <p className="text-slate-400 text-sm">{item.company}</p>
                <p className="text-slate-500 text-xs mt-1">{item.duration}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(item)} className="text-slate-400 hover:text-primary-400">
                  <FiEdit2 size={15} />
                </button>
                <button onClick={() => setDeleteTarget(item)} className="text-slate-400 hover:text-red-400">
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-slate-500 text-sm">No experience entries yet.</p>}
        </div>
      )}

      <FormModal open={modalOpen} title={editing ? 'Edit Experience' : 'Add Experience'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="input-field"
          />
          <input
            required
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="input-field"
          />
          <input
            required
            placeholder="Duration (e.g. Jan 2025 - Present)"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="input-field"
          />
          <textarea
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field resize-none"
          />
          <input
            type="number"
            placeholder="Display order"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className="input-field"
          />
          <button type="submit" disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Delete role at "${deleteTarget?.company}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default ExperienceManage;
