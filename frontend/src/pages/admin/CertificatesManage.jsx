import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiUpload, FiRefreshCw } from 'react-icons/fi';
import PageHeader from '../../components/admin/PageHeader';
import FormModal from '../../components/admin/FormModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Skeleton from '../../components/ui/Skeleton';
import { certificationsAPI } from '../../api/services';
import { getUploadUrl } from '../../api/axios';

const emptyForm = {
  name: '',
  organization: '',
  issueDate: '',
  credentialId: '',
  credentialUrl: '',
  skills: '',
  description: '',
};

const CertificatesManage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    certificationsAPI
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
    setForm({
      name: item.name,
      organization: item.organization,
      issueDate: item.issueDate ? item.issueDate.slice(0, 10) : '',
      credentialId: item.credentialId || '',
      credentialUrl: item.credentialUrl || '',
      skills: Array.isArray(item.skills) ? item.skills.join(', ') : item.skills || '',
      description: item.description || '',
    });
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
        await certificationsAPI.update(editing._id, fd);
        toast.success('Certificate updated');
      } else {
        await certificationsAPI.create(fd);
        toast.success('Certificate added');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleFetchDetails = async () => {
    if (!form.credentialUrl.trim()) {
      toast.error('Paste a Coursera credential URL first');
      return;
    }

    setFetchingDetails(true);
    try {
      const { data } = await certificationsAPI.fetchFromUrl(form.credentialUrl.trim());
      const details = data.data;

      setForm((current) => ({
        ...current,
        name: details.name || current.name,
        organization: details.organization || current.organization,
        issueDate: details.issueDate || current.issueDate,
        credentialId: details.credentialId || details.credentialCode || current.credentialId,
        credentialUrl: details.credentialUrl || current.credentialUrl,
        skills: Array.isArray(details.skills) && details.skills.length ? details.skills.join(', ') : current.skills,
        description: details.description || current.description,
      }));
      toast.success('Certificate details fetched');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not fetch certificate details');
    } finally {
      setFetchingDetails(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await certificationsAPI.delete(deleteTarget._id);
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
        title="Certificates"
        subtitle="Manage your certifications"
        action={
          <button onClick={openCreate} className="btn-primary !py-2.5">
            <FiPlus size={15} /> Add Certificate
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
                  <img src={getUploadUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-slate-500 text-xs mt-1">{item.organization}</p>
                {item.credentialId && <p className="text-slate-500 text-xs mt-1">ID {item.credentialId}</p>}
                {item.skills?.length > 0 && (
                  <p className="text-slate-400 text-xs mt-2 line-clamp-1">Skills: {item.skills.join(', ')}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  {item.credentialUrl && (
                    <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-primary-400 text-xs">
                      <FiExternalLink size={13} />
                    </a>
                  )}
                  <div className="flex gap-3 ml-auto">
                    <button onClick={() => openEdit(item)} className="text-slate-400 hover:text-primary-400">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => setDeleteTarget(item)} className="text-slate-400 hover:text-red-400">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-slate-500 text-sm col-span-full">No certificates added yet.</p>}
        </div>
      )}

      <FormModal
        open={modalOpen}
        title={editing ? 'Edit Certificate' : 'Add Certificate'}
        onClose={() => setModalOpen(false)}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="Certificate Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
          />
          <input
            required
            placeholder="Organization"
            value={form.organization}
            onChange={(e) => setForm({ ...form, organization: e.target.value })}
            className="input-field"
          />
          <input
            required
            type="date"
            value={form.issueDate}
            onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
            className="input-field"
          />
          <input
            placeholder="Credential ID"
            value={form.credentialId}
            onChange={(e) => setForm({ ...form, credentialId: e.target.value })}
            className="input-field"
          />
          <div className="flex gap-2">
            <input
              placeholder="Credential URL"
              value={form.credentialUrl}
              onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
              className="input-field flex-1"
            />
            <button
              type="button"
              onClick={handleFetchDetails}
              disabled={fetchingDetails}
              className="btn-secondary !px-4 disabled:opacity-60"
              title="Fetch certificate details"
            >
              <FiRefreshCw size={15} className={fetchingDetails ? 'animate-spin' : ''} />
              {fetchingDetails ? 'Fetching' : 'Fetch'}
            </button>
          </div>
          <input
            placeholder="Skills (comma separated)"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            className="input-field"
          />
          <textarea
            placeholder="Credential description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field min-h-28 resize-y"
          />
          <label className="btn-secondary cursor-pointer !py-2.5 w-full justify-center">
            <FiUpload size={15} /> {imageFile ? imageFile.name : 'Upload Certificate Image or PDF'}
            <input
              type="file"
              accept="image/*,.pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                setImageFile(file);
                setImagePreview(file && file.type.startsWith('image/') ? URL.createObjectURL(file) : '');
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
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default CertificatesManage;
