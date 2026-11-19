export const AMAZON_CONTACT_TOKEN = 'AMZ-K7P3-Q2N8'
export const AMAZON_CONTACT_PATH = '/contact/marketplace'
export const AMAZON_CONTACT_SITE_URL = 'https://fiberisefit.com'
export const AMAZON_CONTACT_URL = `${AMAZON_CONTACT_SITE_URL}${AMAZON_CONTACT_PATH}?k=${AMAZON_CONTACT_TOKEN}`

export function isAmazonContactToken(value: string | string[] | undefined): boolean {
  const token = Array.isArray(value) ? value[0] : value
  return token === AMAZON_CONTACT_TOKEN
}
