import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiUpload, FiX, FiSearch, FiStar } from 'react-icons/fi';
import PageHeader from '../../components/admin/PageHeader';
import FormModal from '../../components/admin/FormModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Skeleton from '../../components/ui/Skeleton';
import { projectsAPI } from '../../api/services';
import { getUploadUrl } from '../../api/axios';
import { useDebounce } from '../../hooks/useDebounce';

const emptyForm = {
  title: '',
  description: '',
  githubUrl: '',
  liveUrl: '',
  challenges: '',
  learnings: '',
  featured: false,
  displayOrder: 0,
};

const ProjectsManage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    projectsAPI
      .getAll({ search: debouncedSearch || undefined, limit: 50 })
      .then(({ data }) => setProjects(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [debouncedSearch]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setTechStack([]);
    setFeatures([]);
    setExistingImages([]);
    setNewImages([]);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({
      title: project.title,
      description: project.description,
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      challenges: project.challenges || '',
      learnings: project.learnings || '',
      featured: project.featured,
      displayOrder: project.displayOrder || 0,
    });
    setTechStack(project.techStack || []);
    setFeatures(project.features || []);
    setExistingImages(project.images || []);
    setNewImages([]);
    setModalOpen(true);
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    setTechStack((t) => [...t, techInput.trim()]);
    setTechInput('');
  };
  const addFeature = () => {
    if (!featureInput.trim()) return;
    setFeatures((f) => [...f, featureInput.trim()]);
    setFeatureInput('');
  };

  const handleNewImages = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const removeExistingImage = async (imagePath) => {
    if (!editing) {
      setExistingImages((imgs) => imgs.filter((i) => i !== imagePath));
      return;
    }
    try {
      await projectsAPI.deleteImage(editing._id, imagePath);
      setExistingImages((imgs) => imgs.filter((i) => i !== imagePath));
      toast.success('Image removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('techStack', JSON.stringify(techStack));
      fd.append('features', JSON.stringify(features));
      newImages.forEach((file) => fd.append('images', file));

      if (editing) {
        await projectsAPI.update(editing._id, fd);
        toast.success('Project updated');
      } else {
        await projectsAPI.create(fd);
        toast.success('Project added');
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
      await projectsAPI.delete(deleteTarget._id);
      toast.success('Project deleted');
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
        title="Projects"
        subtitle="Manage your portfolio projects"
        action={
          <button onClick={openCreate} className="btn-primary !py-2.5">
            <FiPlus size={15} /> Add Project
          </button>
        }
      />

      <div className="relative max-w-sm mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field !pl-11"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div key={project._id} className="glass-card-hover overflow-hidden">
              <div className="aspect-video bg-black/30 relative">
                {project.images?.[0] && (
                  <img src={getUploadUrl(project.images[0])} alt={project.title} className="w-full h-full object-cover" />
                )}
                {project.featured && (
                  <span className="absolute top-2 left-2 badge !bg-gradient-primary !text-white !border-0 text-[10px] flex items-center gap-1">
                    <FiStar size={10} /> Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-medium text-sm mb-1">{project.title}</p>
                <p className="text-slate-500 text-xs line-clamp-2 mb-3">{project.description}</p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => openEdit(project)} className="text-slate-400 hover:text-primary-400">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(project)} className="text-slate-400 hover:text-red-400">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p className="text-slate-500 text-sm col-span-full">No projects found.</p>}
        </div>
      )}

      <FormModal
        open={modalOpen}
        title={editing ? 'Edit Project' : 'Add Project'}
        onClose={() => setModalOpen(false)}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-field"
          />
          <textarea
            required
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field resize-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="GitHub URL"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              className="input-field"
            />
            <input
              placeholder="Live Demo URL"
              value={form.liveUrl}
              onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
              className="input-field"
            />
          </div>

          {/* Tech stack tags */}
          <div>
            <label className="text-xs text-slate-400 mb-2 block">Tech Stack</label>
            <div className="flex gap-2 mb-2">
              <input
                placeholder="e.g. React"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                className="input-field"
              />
              <button type="button" onClick={addTech} className="btn-secondary shrink-0 !py-2.5">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, i) => (
                <span key={i} className="badge flex items-center gap-2">
                  {tech}
                  <button
                    type="button"
                    onClick={() => setTechStack((t) => t.filter((_, idx) => idx !== i))}
                    className="text-slate-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="text-xs text-slate-400 mb-2 block">Features</label>
            <div className="flex gap-2 mb-2">
              <input
                placeholder="e.g. JWT authentication"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="input-field"
              />
              <button type="button" onClick={addFeature} className="btn-secondary shrink-0 !py-2.5">
                Add
              </button>
            </div>
            <ul className="space-y-1">
              {features.map((f, i) => (
                <li key={i} className="flex items-center justify-between text-sm bg-white/5 rounded-lg px-3 py-2">
                  {f}
                  <button
                    type="button"
                    onClick={() => setFeatures((arr) => arr.filter((_, idx) => idx !== i))}
                    className="text-slate-500 hover:text-red-400"
                  >
                    <FiX size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <textarea
            placeholder="Challenges faced"
            rows={2}
            value={form.challenges}
            onChange={(e) => setForm({ ...form, challenges: e.target.value })}
            className="input-field resize-none"
          />
          <textarea
            placeholder="What I learned"
            rows={2}
            value={form.learnings}
            onChange={(e) => setForm({ ...form, learnings: e.target.value })}
            className="input-field resize-none"
          />

          {/* Images */}
          <div>
            <label className="text-xs text-slate-400 mb-2 block">Images</label>
            {existingImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {existingImages.map((img) => (
                  <div key={img} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={getUploadUrl(img)} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="btn-secondary cursor-pointer !py-2.5 w-full justify-center">
              <FiUpload size={15} /> {newImages.length > 0 ? `${newImages.length} file(s) selected` : 'Upload Images (multiple)'}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleNewImages} />
            </label>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="accent-primary-500 w-4 h-4"
              />
              Featured project
            </label>
            <input
              type="number"
              placeholder="Display order"
              value={form.displayOrder}
              onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
              className="input-field !w-40"
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Project'}
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

export default ProjectsManage;
