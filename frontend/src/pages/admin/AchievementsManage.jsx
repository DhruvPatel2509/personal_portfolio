import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiUpload } from 'react-icons/fi';
import PageHeader from '../../components/admin/PageHeader';
import FormModal from '../../components/admin/FormModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Skeleton from '../../components/ui/Skeleton';
import { achievementsAPI } from '../../api/services';
import { getUploadUrl } from '../../api/axios';

const emptyForm = { title: '', description: '' };

const AchievementsManage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    achievementsAPI
      .getAll()
      .then(({ data }) => setItems(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description || '' });
    setImageFile(null);
    setImagePreview('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        await achievementsAPI.update(editing._id, fd);
        toast.success('Achievement updated');
      } else {
        await achievementsAPI.create(fd);
        toast.success('Achievement added');
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
      await achievementsAPI.delete(deleteTarget._id);
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
        title="Achievements"
        subtitle="Manage your achievements and recognitions"
        action={
          <button onClick={openCreate} className="btn-primary !py-2.5">
            <FiPlus size={15} /> Add Achievement
          </button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item._id} className="glass-card-hover overflow-hidden">
              <div className="aspect-video bg-black/30">
                {item.image && (
                  <img src={getUploadUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-slate-500 text-xs mt-1 line-clamp-2">{item.description}</p>
                <div className="flex justify-end gap-3 mt-3">
                  <button onClick={() => openEdit(item)} className="text-slate-400 hover:text-primary-400">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(item)} className="text-slate-400 hover:text-red-400">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-slate-500 text-sm col-span-full">No achievements added yet.</p>}
        </div>
      )}

      <FormModal open={modalOpen} title={editing ? 'Edit Achievement' : 'Add Achievement'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-field"
          />
          <textarea
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field resize-none"
          />
          <label className="btn-secondary cursor-pointer !py-2.5 w-full justify-center">
            <FiUpload size={15} /> {imageFile ? imageFile.name : 'Upload Image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                setImageFile(e.target.files[0]);
                setImagePreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </label>
          {imagePreview && <img src={imagePreview} alt="Preview" className="w-full aspect-video object-cover rounded-xl" />}
          <button type="submit" disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default AchievementsManage;
