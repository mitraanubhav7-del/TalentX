export function emptyProfile() {
  return {
    avatar: '',
    banner: '',
    title: '',
    location: '',
    university: '',
    targetRole: '',
    about: '',
    socialLinks: { github: '', linkedin: '', portfolio: '' },
    skills: [{ name: '', level: '' }],
    experience: [{ role: '', company: '', period: '', description: '', skillsUsed: [''] }],
    education: [{ degree: '', institution: '', period: '', grade: '', highlights: '' }],
    projects: [{ title: '', description: '', techStack: [''], github: '', demo: '', stars: 0, collaborators: 0, hackathonAward: '' }],
    certifications: [{ title: '', issuer: '', date: '', credentialUrl: '' }],
  };
}

export function profileIsComplete(profile) {
  if (!profile) return false;
  const hasText = value => typeof value === 'string' && value.trim().length > 0;
  const hasHttpsUrl = value => {
    if (!hasText(value)) return false;
    try {
      return new URL(value).protocol === 'https:';
    } catch {
      return false;
    }
  };
  const hasImage = value => (
    typeof value === 'string'
    && /^data:image\/(?:jpeg|png|webp);base64,[\w+/]+=*$/.test(value)
  );

  return hasImage(profile.avatar)
    && hasImage(profile.banner)
    && ['title', 'location', 'university', 'targetRole', 'about'].every(key => hasText(profile[key]))
    && ['github', 'linkedin', 'portfolio'].every(key => hasHttpsUrl(profile.socialLinks?.[key]))
    && Array.isArray(profile.skills) && profile.skills.length > 0
    && profile.skills.every(skill => hasText(skill.name) && hasText(skill.level))
    && Array.isArray(profile.experience) && profile.experience.length > 0
    && profile.experience.every(item => (
      ['role', 'company', 'period', 'description'].every(key => hasText(item[key]))
      && Array.isArray(item.skillsUsed) && item.skillsUsed.length > 0
      && item.skillsUsed.every(hasText)
    ))
    && Array.isArray(profile.education) && profile.education.length > 0
    && profile.education.every(item => (
      ['degree', 'institution', 'period', 'grade', 'highlights'].every(key => hasText(item[key]))
    ))
    && Array.isArray(profile.projects) && profile.projects.length > 0
    && profile.projects.every(item => (
      hasText(item.title) && hasText(item.description)
      && Array.isArray(item.techStack) && item.techStack.length > 0
      && item.techStack.every(hasText)
      && hasHttpsUrl(item.github) && hasHttpsUrl(item.demo)
    ))
    && Array.isArray(profile.certifications) && profile.certifications.length > 0
    && profile.certifications.every(item => (
      ['title', 'issuer', 'date'].every(key => hasText(item[key]))
      && hasHttpsUrl(item.credentialUrl)
    ));
}
