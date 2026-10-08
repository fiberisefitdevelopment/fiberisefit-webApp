export interface AuthorProfile {
  name: string
  role: string
  bio: string
  image: string
  linkedin?: string
}

/**
 * Maps the flat Shopify 'authorV2.name' to a rich EEAT profile.
 * Add external authors or internal team members here.
 */
export const AUTHOR_PROFILES: Record<string, AuthorProfile> = {
  'Rahul Sharma': {
    name: 'Rahul Sharma',
    role: 'Nutrition Expert & Medical Board',
    bio: 'Rahul Sharma is a leading Nutrition Expert with over 10+ years of experience specializing in metabolic health and sustainable dietary interventions.',
    image: '/authors/rahul.png', // Replace with real asset when available
    linkedin: 'https://linkedin.com/in/placeholder',
  },
  'Fiberise Team': {
    name: 'Fiberise Team',
    role: 'Editorial Board',
    bio: 'The Fiberise Editorial Board comprises health researchers and nutritionists dedicated to simplifying wellness through science-backed education.',
    image: '/fiberisefit%20dark%20logo.png',
  },
}

export function getAuthorProfile(name?: string | null): AuthorProfile {
  const defaultAuthor = AUTHOR_PROFILES['Fiberise Team']
  if (!name) return defaultAuthor

  return AUTHOR_PROFILES[name] || {
    name,
    role: 'Guest Contributor',
    bio: `${name} is a contributing writer focusing on wellness and health at Fiberise Fit.`,
    image: '/fiberisefit%20dark%20logo.png', // Fallback image
  }
}
