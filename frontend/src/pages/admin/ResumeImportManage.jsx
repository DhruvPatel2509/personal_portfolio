import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FiFileText, FiSave, FiTrash2, FiUpload } from 'react-icons/fi';
import PageHeader from '../../components/admin/PageHeader';
import { resumeImportAPI } from '../../api/services';

const SKILL_CATEGORIES = ['Programming', 'Frontend', 'Backend', 'Database', 'Tools', 'Currently Learning'];

const emptyDraft = {
  about: {
    name: '',
    title: '',
    bio: '',
    phone: '',
    email: '',
    location: '',
    socialLinks: { github: '', linkedin: '', twitter: '', instagram: '' },
    typingRoles: [],
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
};

const ResumeImportManage = () => {
  const [file, setFile] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [rawText, setRawText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);
  const hasReviewedData =
    draft.about.name.trim() ||
    draft.about.title.trim() ||
    draft.about.bio.trim() ||
    draft.education.some((item) => item.degree?.trim() && item.college?.trim() && item.duration?.trim()) ||
    draft.experience.some((item) => item.company?.trim() && item.role?.trim() && item.duration?.trim()) ||
    draft.projects.some((item) => item.title?.trim() && item.description?.trim() && item.techStack?.some((tech) => tech.trim())) ||
    draft.skills.some((item) => item.name?.trim() && item.category?.trim());

  const updateAbout = (key, value) => {
    setDraft((current) => ({ ...current, about: { ...current.about, [key]: value } }));
  };

  const updateSocial = (key, value) => {
    setDraft((current) => ({
      ...current,
      about: {
        ...current.about,
        socialLinks: { ...current.about.socialLinks, [key]: value },
      },
    }));
  };

  const updateListItem = (listName, index, key, value) => {
    setDraft((current) => ({
      ...current,
      [listName]: current[listName].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const removeListItem = (listName, index) => {
    setDraft((current) => ({
      ...current,
      [listName]: current[listName].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const addListItem = (listName, item) => {
    setDraft((current) => ({ ...current, [listName]: [...current[listName], item] }));
  };

  const parseResume = async () => {
    if (!file) return;
    setParsing(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await resumeImportAPI.parse(formData);
      setDraft({
        about: { ...emptyDraft.about, ...data.data.about },
        education: data.data.education || [],
        experience: data.data.experience || [],
        projects: data.data.projects || [],
        skills: data.data.skills || [],
      });
      setRawText(data.data.rawText || '');
      toast.success('Resume details extracted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Resume import failed');
    } finally {
      setParsing(false);
    }
  };

  const applyImport = async () => {
    setSaving(true);
    try {
      await resumeImportAPI.apply(draft);
      toast.success('Imported details saved');
      setFile(null);
      setDraft(emptyDraft);
      setRawText('');
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Resume Import" subtitle="Upload a resume, review the extracted details, then save them" />

      <div className="glass-card p-6 space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept=".txt,text/plain,application/pdf"
            onChange={(e) => setFile(e.target.files[0] || null)}
            className="text-sm text-slate-400"
          />
          <button
            type="button"
            onClick={parseResume}
            disabled={!file || parsing}
            className="btn-primary !py-2.5 disabled:opacity-50"
          >
            <FiUpload size={15} /> {parsing ? 'Extracting...' : 'Extract Details'}
          </button>
        </div>
        <p className="text-xs text-slate-500">
          PDF and TXT resumes can be parsed into editable fields. You can still upload the final public PDF from the About page.
        </p>
      </div>

      <div className="space-y-8">
        <section className="glass-card p-6 space-y-4">
          <h3 className="font-semibold">Basic Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="Name" value={draft.about.name} onChange={(e) => updateAbout('name', e.target.value)} className="input-field" />
            <input placeholder="Title" value={draft.about.title} onChange={(e) => updateAbout('title', e.target.value)} className="input-field" />
          </div>
          <textarea placeholder="Bio" rows={4} value={draft.about.bio} onChange={(e) => updateAbout('bio', e.target.value)} className="input-field resize-none" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input placeholder="Phone" value={draft.about.phone} onChange={(e) => updateAbout('phone', e.target.value)} className="input-field" />
            <input placeholder="Email" value={draft.about.email} onChange={(e) => updateAbout('email', e.target.value)} className="input-field" />
            <input placeholder="Location" value={draft.about.location} onChange={(e) => updateAbout('location', e.target.value)} className="input-field" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(draft.about.socialLinks).map((key) => (
              <input
                key={key}
                placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} URL`}
                value={draft.about.socialLinks[key]}
                onChange={(e) => updateSocial(key, e.target.value)}
                className="input-field"
              />
            ))}
          </div>
        </section>

        <EditableSection
          title="Education"
          items={draft.education}
          emptyText="No education detected."
          onAdd={() => addListItem('education', { degree: '', college: '', university: '', duration: '', grade: '', order: draft.education.length })}
          onRemove={(index) => removeListItem('education', index)}
          renderItem={(item, index) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input placeholder="Degree" value={item.degree} onChange={(e) => updateListItem('education', index, 'degree', e.target.value)} className="input-field" />
              <input placeholder="College" value={item.college} onChange={(e) => updateListItem('education', index, 'college', e.target.value)} className="input-field" />
              <input placeholder="University" value={item.university || ''} onChange={(e) => updateListItem('education', index, 'university', e.target.value)} className="input-field" />
              <input placeholder="Duration" value={item.duration} onChange={(e) => updateListItem('education', index, 'duration', e.target.value)} className="input-field" />
              <input placeholder="Grade / CGPA" value={item.grade || ''} onChange={(e) => updateListItem('education', index, 'grade', e.target.value)} className="input-field sm:col-span-2" />
            </div>
          )}
        />

        <EditableSection
          title="Experience"
          items={draft.experience}
          emptyText="No experience detected."
          onAdd={() => addListItem('experience', { company: '', role: '', duration: '', description: '', order: draft.experience.length })}
          onRemove={(index) => removeListItem('experience', index)}
          renderItem={(item, index) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input placeholder="Role" value={item.role} onChange={(e) => updateListItem('experience', index, 'role', e.target.value)} className="input-field" />
              <input placeholder="Company" value={item.company} onChange={(e) => updateListItem('experience', index, 'company', e.target.value)} className="input-field" />
              <input placeholder="Duration" value={item.duration} onChange={(e) => updateListItem('experience', index, 'duration', e.target.value)} className="input-field sm:col-span-2" />
              <textarea placeholder="Description" rows={3} value={item.description || ''} onChange={(e) => updateListItem('experience', index, 'description', e.target.value)} className="input-field resize-none sm:col-span-2" />
            </div>
          )}
        />

        <EditableSection
          title="Projects"
          items={draft.projects}
          emptyText="No projects detected."
          onAdd={() =>
            addListItem('projects', {
              title: '',
              description: '',
              techStack: [],
              features: [],
              githubUrl: '',
              liveUrl: '',
              featured: false,
              displayOrder: draft.projects.length,
            })
          }
          onRemove={(index) => removeListItem('projects', index)}
          renderItem={(item, index) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input placeholder="Title" value={item.title} onChange={(e) => updateListItem('projects', index, 'title', e.target.value)} className="input-field" />
              <input placeholder="Tech stack (comma separated)" value={(item.techStack || []).join(', ')} onChange={(e) => updateListItem('projects', index, 'techStack', e.target.value.split(',').map((tech) => tech.trim()).filter(Boolean))} className="input-field" />
              <input placeholder="Live URL" value={item.liveUrl || ''} onChange={(e) => updateListItem('projects', index, 'liveUrl', e.target.value)} className="input-field" />
              <input placeholder="GitHub URL" value={item.githubUrl || ''} onChange={(e) => updateListItem('projects', index, 'githubUrl', e.target.value)} className="input-field" />
              <textarea placeholder="Description" rows={3} value={item.description || ''} onChange={(e) => updateListItem('projects', index, 'description', e.target.value)} className="input-field resize-none sm:col-span-2" />
              <textarea placeholder="Features (one per line)" rows={3} value={(item.features || []).join('\n')} onChange={(e) => updateListItem('projects', index, 'features', e.target.value.split('\n').map((feature) => feature.trim()).filter(Boolean))} className="input-field resize-none sm:col-span-2" />
              <label className="flex items-center gap-2 text-sm text-slate-400">
                <input type="checkbox" checked={Boolean(item.featured)} onChange={(e) => updateListItem('projects', index, 'featured', e.target.checked)} className="accent-primary-500" />
                Featured project
              </label>
            </div>
          )}
        />

        <EditableSection
          title="Skills"
          items={draft.skills}
          emptyText="No skills detected."
          onAdd={() => addListItem('skills', { category: 'Frontend', name: '', icon: '', progress: 70, order: draft.skills.length })}
          onRemove={(index) => removeListItem('skills', index)}
          renderItem={(item, index) => (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <select value={item.category} onChange={(e) => updateListItem('skills', index, 'category', e.target.value)} className="input-field">
                {SKILL_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input placeholder="Skill" value={item.name} onChange={(e) => updateListItem('skills', index, 'name', e.target.value)} className="input-field sm:col-span-2" />
              <input type="number" min="0" max="100" placeholder="Progress" value={item.progress} onChange={(e) => updateListItem('skills', index, 'progress', Number(e.target.value))} className="input-field" />
            </div>
          )}
        />

        {rawText && (
          <details className="glass-card p-6">
            <summary className="cursor-pointer text-sm font-medium text-slate-300">
              <FiFileText className="inline mr-2" size={15} /> View extracted text
            </summary>
            <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap text-xs text-slate-500">{rawText}</pre>
          </details>
        )}

        <button type="button" onClick={applyImport} disabled={saving || !hasReviewedData} className="btn-primary disabled:opacity-60">
          <FiSave size={15} /> {saving ? 'Saving...' : 'Save Reviewed Details'}
        </button>
      </div>
    </div>
  );
};

const EditableSection = ({ title, items, emptyText, onAdd, onRemove, renderItem }) => (
  <section className="glass-card p-6 space-y-4">
    <div className="flex items-center justify-between gap-3">
      <h3 className="font-semibold">{title}</h3>
      <button type="button" onClick={onAdd} className="btn-secondary !py-2.5">
        Add
      </button>
    </div>
    {items.length === 0 ? (
      <p className="text-sm text-slate-500">{emptyText}</p>
    ) : (
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-xl border border-white/10 p-4">
            <div className="flex justify-end mb-3">
              <button type="button" onClick={() => onRemove(index)} className="text-slate-400 hover:text-red-400">
                <FiTrash2 size={15} />
              </button>
            </div>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    )}
  </section>
);

export default ResumeImportManage;
