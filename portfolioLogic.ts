import { Project, ContactMessage } from '../types/portfolio';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function filterProjects(
  projects: Project[],
  categoryFilter: string,
  searchQuery: string = ''
): Project[] {
  const query = searchQuery.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesCategory =
      categoryFilter === 'all' || project.category === categoryFilter;

    if (!matchesCategory) return false;
    if (!query) return true;

    const inTitle = project.title.toLowerCase().includes(query);
    const inTagline = project.tagline.toLowerCase().includes(query);
    const inDescription = project.description.toLowerCase().includes(query);
    const inTech = project.techStack.some((tech) =>
      tech.toLowerCase().includes(query)
    );
    const inFeatures = project.features.some((feat) =>
      feat.toLowerCase().includes(query)
    );

    return inTitle || inTagline || inDescription || inTech || inFeatures;
  });
}

export function validateContactForm(message: Partial<ContactMessage>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!message.name || message.name.trim().length < 2) {
    errors.name = 'Please provide your name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!message.email || !emailRegex.test(message.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!message.subject || message.subject.trim().length < 3) {
    errors.subject = 'Please specify a subject for your inquiry.';
  }

  if (!message.message || message.message.trim().length < 10) {
    errors.message = 'Please write a message with at least 10 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function calculateAverageSkill(
  skills: { level: number }[]
): number {
  if (!skills.length) return 0;
  const sum = skills.reduce((acc, curr) => acc + curr.level, 0);
  return Math.round(sum / skills.length);
}

export const DEFAULT_FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

export function isPlaceholderFormEndpoint(endpoint: string): boolean {
  const trimmed = (endpoint || '').trim();
  if (!trimmed) return true;
  return (
    trimmed.includes('YOUR_FORM_ID') ||
    trimmed.includes('FORM_ENDPOINT') ||
    trimmed === 'https://formspree.io/f/'
  );
}

export function buildMailtoUrl(
  recipientEmail: string,
  data: ContactMessage
): string {
  const subject = `[Portfolio Inquiry] ${data.subject.trim()} — from ${data.name.trim()}`;
  const bodyLines = [
    `Name: ${data.name.trim()}`,
    `Email: ${data.email.trim()}`,
    ...(data.telegramOrSocial?.trim()
      ? [`Telegram / Social: ${data.telegramOrSocial.trim()}`]
      : []),
    `Subject: ${data.subject.trim()}`,
    '',
    'Message:',
    data.message.trim(),
  ];

  const params = new URLSearchParams({
    subject,
    body: bodyLines.join('\n'),
  });

  // URLSearchParams encodes spaces as '+', convert to '%20' for standard mailto compatibility
  const queryString = params.toString().replace(/\+/g, '%20');
  return `mailto:${recipientEmail}?${queryString}`;
}

