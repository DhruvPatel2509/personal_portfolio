import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { FiUpload, FiSave, FiFileText } from 'react-icons/fi';
import PageHeader from '../../components/admin/PageHeader';
import Skeleton from '../../components/ui/Skeleton';
import { aboutAPI } from '../../api/services';
import { getUploadUrl } from '../../api/axios';

const emptyForm = {
  name: '',
  title: '',
  bio: '',
  phone: '',
  email: '',
  location: '',
  socialLinks: { github: '', linkedin: '', twitter: '', instagram: '' },
  typingRoles: [],
};

const AboutManage = () => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [currentPhoto, setCurrentPhoto] = useState('');
  const [currentResume, setCurrentResume] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [typingInput, setTypingInput] = useState('');
  const resumeInputRef = useRef(null);

  useEffect(() => {
    aboutAPI
      .get()
      .then(({ data }) => {
        const a = data.data;
        setForm({
          name: a.name || '',
          title: a.title || '',
          bio: a.bio || '',
          phone: a.phone || '',
          email: a.email || '',
          location: a.location || '',
          socialLinks: { github: '', linkedin: '', twitter: '', instagram: '', ...a.socialLinks },
          typingRoles: a.typingRoles || [],
        });
        setCurrentPhoto(a.profilePhoto || '');
        setCurrentResume(a.resume || '');
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const addTypingRole = () => {
    if (!typingInput.trim()) return;
    setForm((f) => ({ ...f, typingRoles: [...f.typingRoles, typingInput.trim()] }));
    setTypingInput('');
  };

  const removeTypingRole = (i) => {
    setForm((f) => ({ ...f, typingRoles: f.typingRoles.filter((_, idx) => idx !== i) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'socialLinks' || key === 'typingRoles') {
          fd.append(key, JSON.stringify(value));
        } else {
          fd.append(key, value);
        }
      });
      if (photoFile) fd.append('profilePhoto', photoFile);

      const { data } = await aboutAPI.update(fd);
      setCurrentPhoto(data.data.profilePhoto || '');
      setPhotoFile(null);
      setPhotoPreview('');
      toast.success('About info updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    const fd = new FormData();
    fd.append('resume', resumeFile);
    try {
      const { data } = await aboutAPI.uploadResume(fd);
      setCurrentResume(data.data.resume);
      setResumeFile(null);
      if (resumeInputRef.current) resumeInputRef.current.value = '';
      toast.success('Resume uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Resume upload failed');
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="About" subtitle="Manage your personal information" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="About" subtitle="Manage your personal information" />

      <form onSubmit={handleSave} className="space-y-8">
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-5">Profile Photo</h3>
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
              {photoPreview || currentPhoto ? (
                <img
                  src={photoPreview || getUploadUrl(currentPhoto)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <label className="btn-secondary cursor-pointer !py-2.5">
              <FiUpload size={15} /> Choose Photo
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="font-semibold mb-1">Basic Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
            />
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field"
            />
          </div>
          <textarea
            placeholder="Bio"
            rows={4}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="input-field resize-none"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input-field"
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
            />
            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="font-semibold mb-1">Social Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(form.socialLinks).map((key) => (
              <input
                key={key}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1) + ' URL'}
                value={form.socialLinks[key]}
                onChange={(e) =>
                  setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: e.target.value } })
                }
                className="input-field"
              />
            ))}
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="font-semibold mb-1">Hero Typing Roles</h3>
          <div className="flex gap-3">
            <input
              placeholder="e.g. MERN Developer"
              value={typingInput}
              onChange={(e) => setTypingInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTypingRole())}
              className="input-field"
            />
            <button type="button" onClick={addTypingRole} className="btn-secondary shrink-0 !py-2.5">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.typingRoles.map((role, i) => (
              <span key={i} className="badge flex items-center gap-2">
                {role}
                <button type="button" onClick={() => removeTypingRole(i)} className="text-slate-500 hover:text-red-400">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          <FiSave size={15} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className="glass-card p-6 mt-8">
        <h3 className="font-semibold mb-4">Resume (PDF)</h3>
        {currentResume && (
          <a
            href={getUploadUrl(currentResume)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary-400 text-sm mb-4 hover:text-primary-300"
          >
            <FiFileText size={15} /> View current resume
          </a>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={resumeInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="text-sm text-slate-400"
          />
          <button
            type="button"
            onClick={handleResumeUpload}
            disabled={!resumeFile}
            className="btn-secondary !py-2.5 disabled:opacity-50"
          >
            <FiUpload size={15} /> Upload / Replace
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutManage;
