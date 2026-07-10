import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import PageHeader from '../../components/admin/PageHeader';
import FormModal from '../../components/admin/FormModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Skeleton from '../../components/ui/Skeleton';
import { skillsAPI } from '../../api/services';

const CATEGORIES = ['Programming', 'Frontend', 'Backend', 'Database', 'Tools', 'Currently Learning'];
const emptyForm = { category: 'Frontend', name: '', icon: '', showProgress: false, progress: 50, order: 0 };

const SkillsManage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadSkills = () => {
    setLoading(true);
    skillsAPI
      .getAll()
      .then(({ data }) => setSkills(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(loadSkills, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (skill) => {
    setEditing(skill);
    setForm({
      category: skill.category,
      name: skill.name,
      icon: skill.icon || '',
      showProgress: !!skill.showProgress,
      progress: skill.progress ?? 50,
      order: skill.order || 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await skillsAPI.update(editing._id, form);
        toast.success('Skill updated');
      } else {
        await skillsAPI.create(form);
        toast.success('Skill added');
      }
      setModalOpen(false);
      loadSkills();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await skillsAPI.delete(deleteTarget._id);
      toast.success('Skill deleted');
      setDeleteTarget(null);
      loadSkills();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Skills"
        subtitle="Manage your technical skills by category"
        action={
          <button onClick={openCreate} className="btn-primary !py-2.5">
            <FiPlus size={15} /> Add Skill
          </button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div key={skill._id} className="glass-card-hover p-5">
              <div className="flex items-start justify-between mb-3">
              <div>
                <span className="badge text-[10px] mb-2 inline-block">{skill.category}</span>
                <p className="font-medium">{skill.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {skill.showProgress ? `With percentage (${skill.progress}%)` : 'Direct skill'}
                </p>
              </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(skill)} className="text-slate-400 hover:text-primary-400">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(skill)} className="text-slate-400 hover:text-red-400">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
              {skill.showProgress && (
                <>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${skill.progress}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{skill.progress}%</p>
                </>
              )}
            </div>
          ))}
          {skills.length === 0 && <p className="text-slate-500 text-sm col-span-full">No skills added yet.</p>}
        </div>
      )}

      <FormModal open={modalOpen} title={editing ? 'Edit Skill' : 'Add Skill'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="input-field"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            required
            placeholder="Skill name (e.g. React.js)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
          />
          <input
            placeholder="Icon name (react-icons) or image URL"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="input-field"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, showProgress: false })}
              className={`btn-secondary justify-center !py-2.5 ${!form.showProgress ? 'border-primary/60 text-primary-200' : ''}`}
            >
              Direct skill
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, showProgress: true })}
              className={`btn-secondary justify-center !py-2.5 ${form.showProgress ? 'border-primary/60 text-primary-200' : ''}`}
            >
              With percentage
            </button>
          </div>
          {form.showProgress && (
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Progress: {form.progress}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={form.progress}
                onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                className="w-full accent-primary-500"
              />
            </div>
          )}
          <input
            type="number"
            placeholder="Display order"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className="input-field"
          />
          <button type="submit" disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Skill'}
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

export default SkillsManage;
