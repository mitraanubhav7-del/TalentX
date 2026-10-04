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
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
  };
}

export function profileIsComplete(profile) {
  if (!profile || typeof profile !== 'object') return false;
  const hasText = value => typeof value === 'string' && value.trim().length > 0;
  return Boolean(
    profile._completed ||
    hasText(profile.title) ||
    hasText(profile.targetRole)
  );
}
