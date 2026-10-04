import React, { useState } from 'react';
import { Award, BriefcaseBusiness, Camera, GraduationCap, ImagePlus, Link, Plus, Sparkles, Trash2, UserRound } from 'lucide-react';
import { authApi } from '../services/auth';
import { emptyProfile } from '../utils/profile';

function ProfileField({ label, value, onChange, required = false, type = 'text', options, multiline = false, placeholder }) {
  const shared = {
    value: value ?? '',
    required,
    placeholder,
    onChange: event => onChange(event.target.value),
  };

  return (
    <label className="profile-setup-field">
      <span>{label} {!required && <small style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</small>}</span>
      {options ? (
        <select {...shared}>
          <option value="" disabled>Select {label.toLowerCase()}</option>
          {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : multiline ? (
        <textarea {...shared} rows={3} />
      ) : (
        <input {...shared} type={type} />
      )}
    </label>
  );
}

function readResizedImage(file) {
  if (file.size > 10_000_000) {
    return Promise.reject(new Error('Choose an image smaller than 10 MB.'));
  }
  if (!file.type.startsWith('image/')) {
    return Promise.reject(new Error('Choose an image file.'));
  }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return Promise.reject(new Error('Use a JPG, PNG, or WebP image.'));
  }

  return createImageBitmap(file).then(bitmap => {
    const scale = Math.min(1, 1200 / bitmap.width, 1200 / bitmap.height);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Could not process this image. Try another file.'));
          return;
        }
        if (blob.size > 1_000_000) {
          reject(new Error('Image is too large after compression. Choose a smaller image.'));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Could not read this image file.'));
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.82);
    });
  });
}

const sections = [
  {
    key: 'skills',
    title: 'Skills',
    itemLabel: 'Skill',
    icon: Sparkles,
    fields: [
      { key: 'name', label: 'Skill name', placeholder: 'e.g. Product design' },
      { key: 'level', label: 'Level', options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
    ],
  },
  {
    key: 'experience',
    title: 'Experience',
    itemLabel: 'Experience',
    icon: BriefcaseBusiness,
    fields: [
      { key: 'role', label: 'Role', placeholder: 'e.g. Software engineering intern' },
      { key: 'company', label: 'Company' },
      { key: 'period', label: 'Dates', placeholder: 'e.g. Jun 2025 – Aug 2025' },
      { key: 'description', label: 'What did you do?', multiline: true },
      { key: 'skillsUsed', label: 'Skills used (comma-separated)', list: true },
    ],
  },
  {
    key: 'education',
    title: 'Education',
    itemLabel: 'Education',
    icon: GraduationCap,
    fields: [
      { key: 'degree', label: 'Degree or qualification' },
      { key: 'institution', label: 'School or institution' },
      { key: 'period', label: 'Dates', placeholder: 'e.g. 2022 – 2026' },
      { key: 'grade', label: 'Grade or result' },
      { key: 'highlights', label: 'Coursework or highlights', multiline: true },
    ],
  },
  {
    key: 'projects',
    title: 'Projects',
    itemLabel: 'Project',
    icon: Sparkles,
    fields: [
      { key: 'title', label: 'Project name' },
      { key: 'description', label: 'Description', multiline: true },
      { key: 'techStack', label: 'Skills or technologies (comma-separated)', list: true },
      { key: 'github', label: 'Code URL', type: 'url', placeholder: 'https://github.com/…' },
      { key: 'demo', label: 'Live demo URL', type: 'url', placeholder: 'https://…' },
      { key: 'hackathonAward', label: 'Award (optional)' },
      { key: 'stars', label: 'GitHub stars', type: 'number' },
      { key: 'collaborators', label: 'Collaborators', type: 'number' },
    ],
  },
  {
    key: 'certifications',
    title: 'Certifications',
    itemLabel: 'Certification',
    icon: Award,
    fields: [
      { key: 'title', label: 'Certification name' },
      { key: 'issuer', label: 'Issuing organization' },
      { key: 'date', label: 'Date earned' },
      { key: 'credentialUrl', label: 'Credential URL', type: 'url', placeholder: 'https://…' },
    ],
  },
];

export function ProfileSetup({ user, onSaved, onCancel, onLogout, isRequired }) {
  const [profile, setProfile] = useState(() => ({
    ...emptyProfile(),
    ...(user.profile || {}),
    socialLinks: { ...emptyProfile().socialLinks, ...(user.profile?.socialLinks || {}) },
    skills: user.profile?.skills || [],
    experience: user.profile?.experience || [],
    education: user.profile?.education || [],
    projects: user.profile?.projects || [],
    certifications: user.profile?.certifications || [],
  }));
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const updateProfileField = (key, value) => setProfile(current => ({ ...current, [key]: value }));
  const updateSocialLink = (key, value) => setProfile(current => ({
    ...current,
    socialLinks: { ...current.socialLinks, [key]: value },
  }));
  const updateEntry = (section, index, key, value, isList = false) => {
    setProfile(current => ({
      ...current,
      [section]: current[section].map((entry, entryIndex) => {
        if (entryIndex !== index) return entry;
        const normalized = isList
          ? value.split(',').map(item => item.trim()).filter(Boolean)
          : value;
        return { ...entry, [key]: normalized };
      }),
    }));
  };
  const addEntry = section => setProfile(current => {
    const blank = {
      skills: { name: '', level: 'Intermediate' },
      experience: { role: '', company: '', period: '', description: '', skillsUsed: [] },
      education: { degree: '', institution: '', period: '', grade: '', highlights: '' },
      projects: { title: '', description: '', techStack: [], github: '', demo: '', stars: 0, collaborators: 0, hackathonAward: '' },
      certifications: { title: '', issuer: '', date: '', credentialUrl: '' },
    }[section] || {};
    return { ...current, [section]: [...(current[section] || []), { ...blank }] };
  });
  const removeEntry = (section, index) => setProfile(current => ({
    ...current,
    [section]: current[section].filter((_, entryIndex) => entryIndex !== index),
  }));
  const handleImage = async (key, file) => {
    setImageError('');
    if (!file) return;
    try {
      const image = await readResizedImage(file);
      updateProfileField(key, image);
    } catch (imageReadError) {
      setImageError(imageReadError.message);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    setIsSaving(true);
    try {
      const profileToSave = {
        ...profile,
        _completed: true,
        skills: (profile.skills || [])
          .filter(skill => skill.name && skill.name.trim())
          .map(skill => ({ ...skill, verified: false, score: 0, certId: null })),
        experience: (profile.experience || [])
          .filter(item => (item.role && item.role.trim()) || (item.company && item.company.trim()))
          .map((item, index) => ({ ...item, id: `experience-${index + 1}` })),
        education: (profile.education || [])
          .filter(item => (item.degree && item.degree.trim()) || (item.institution && item.institution.trim())),
        projects: (profile.projects || [])
          .filter(item => item.title && item.title.trim())
          .map((item, index) => ({
            ...item,
            id: `project-${index + 1}`,
            stars: Number(item.stars) || 0,
            collaborators: Number(item.collaborators) || 0,
          })),
        certifications: (profile.certifications || [])
          .filter(item => item.title && item.title.trim()),
      };
      const result = await authApi.updateProfile(profileToSave);
      onSaved(result.profile);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="profile-setup-page">
      <form className="profile-setup" onSubmit={handleSubmit}>
        <header className="profile-setup-header">
          <div className="auth-brand-mark" aria-hidden="true">tX</div>
          <p className="auth-eyebrow"><Sparkles size={14} /> {user.role === 'recruiter' ? 'TALENTX RECRUITER' : 'TALENTX PROFILE'}</p>
          <h1>{isRequired
            ? `Welcome, ${user.name}. Let’s build your ${user.role === 'recruiter' ? 'recruiter ' : ''}profile.`
            : 'Edit your profile'}</h1>
          <p className="auth-description">
            Fill in your basic information to get started. All other sections and photos are optional and can be updated at any time.
          </p>
        </header>

        <section className="profile-setup-card">
          <h2><UserRound size={19} /> Basic information</h2>
          <div className="profile-setup-images">
            {[
              { key: 'avatar', label: 'Profile photo (optional)', icon: Camera },
              { key: 'banner', label: 'Cover photo (optional)', icon: ImagePlus },
            ].map(({ key, label, icon: Icon }) => (
              <label className="profile-image-upload" key={key}>
                {profile[key] ? <img src={profile[key]} alt={`${label} preview`} /> : <Icon size={25} />}
                <span>{label} <small>Upload JPG, PNG, or WebP</small></span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={event => {
                    handleImage(key, event.target.files?.[0]);
                    event.target.value = '';
                  }}
                />
              </label>
            ))}
          </div>
          {imageError && <p className="profile-setup-error" role="alert">{imageError}</p>}
          <div className="profile-setup-grid">
            <ProfileField
              label="Professional headline"
              value={profile.title}
              onChange={value => updateProfileField('title', value)}
              required={true}
              placeholder="e.g. Aspiring UX designer / Software Engineer"
            />
            <ProfileField
              label="Target role"
              value={profile.targetRole}
              onChange={value => updateProfileField('targetRole', value)}
              placeholder="e.g. Product designer"
            />
            <ProfileField
              label="Location"
              value={profile.location}
              onChange={value => updateProfileField('location', value)}
              placeholder="City, country"
            />
            <ProfileField
              label="School or university"
              value={profile.university}
              onChange={value => updateProfileField('university', value)}
            />
            <div className="profile-setup-wide">
              <ProfileField
                label="About"
                value={profile.about}
                onChange={value => updateProfileField('about', value)}
                multiline
                placeholder="Tell people about your work, strengths, and goals."
              />
            </div>
          </div>
        </section>

        <section className="profile-setup-card">
          <h2><Link size={19} /> Social links (optional)</h2>
          <div className="profile-setup-grid">
            <ProfileField label="GitHub URL" type="url" value={profile.socialLinks?.github} onChange={value => updateSocialLink('github', value)} placeholder="https://github.com/…" />
            <ProfileField label="LinkedIn URL" type="url" value={profile.socialLinks?.linkedin} onChange={value => updateSocialLink('linkedin', value)} placeholder="https://linkedin.com/in/…" />
            <ProfileField label="Portfolio URL" type="url" value={profile.socialLinks?.portfolio} onChange={value => updateSocialLink('portfolio', value)} placeholder="https://…" />
          </div>
        </section>

        {sections.map(({ key, title, itemLabel, icon: Icon, fields }) => (
          <section className="profile-setup-card" key={key}>
            <div className="profile-setup-section-heading">
              <h2><Icon size={19} /> {title} (optional)</h2>
              <button type="button" className="btn-secondary" onClick={() => addEntry(key)}>
                <Plus size={15} /> Add {title.toLowerCase()}
              </button>
            </div>
            {(!profile[key] || profile[key].length === 0) && (
              <p className="profile-setup-hint" style={{ color: 'var(--text-muted)' }}>
                No {title.toLowerCase()} added yet. Click "+ Add {title.toLowerCase()}" if you want to add any now, or skip this step.
              </p>
            )}
            {(profile[key] || []).map((entry, index) => (
              <div className="profile-setup-entry" key={`${key}-${index}`}>
                <div className="profile-setup-entry-heading">
                  <strong>{itemLabel} {index + 1}</strong>
                  <button type="button" className="profile-remove-entry" onClick={() => removeEntry(key, index)} aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`}>
                    <Trash2 size={15} /> Remove
                  </button>
                </div>
                <div className="profile-setup-grid">
                  {fields.map(field => {
                    const fieldValue = field.list ? (entry[field.key] || []).join(', ') : (entry[field.key] ?? '');
                    return (
                      <ProfileField
                        key={field.key}
                        label={field.label}
                        type={field.type}
                        required={false}
                        options={field.options}
                        multiline={field.multiline}
                        placeholder={field.placeholder}
                        value={fieldValue}
                        onChange={value => updateEntry(key, index, field.key, value, field.list)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        ))}

        {error && <p className="profile-setup-error" role="alert">{error}</p>}
        <div className="profile-setup-actions">
          {isRequired
            ? <button type="button" className="btn-secondary" onClick={onLogout} disabled={isSaving}>Sign out</button>
            : <button type="button" className="btn-secondary" onClick={onCancel} disabled={isSaving}>Cancel</button>}
          <button type="submit" className="auth-submit" disabled={isSaving}>
            {isSaving ? 'Saving profile…' : isRequired ? 'Complete profile and continue' : 'Save profile'}
          </button>
        </div>
      </form>
    </main>
  );
}
