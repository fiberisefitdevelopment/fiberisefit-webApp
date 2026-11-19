import { redirect } from 'next/navigation'
import { AMAZON_CONTACT_PATH } from '@/lib/amazon-contact'

type PageProps = {
  searchParams?: Promise<{ k?: string | string[] }> | { k?: string | string[] }
}

export default async function AmazonContactRedirect({ searchParams }: PageProps) {
  const params = await Promise.resolve(searchParams)
  const token = Array.isArray(params?.k) ? params?.k[0] : params?.k
  const query = token ? `?k=${encodeURIComponent(token)}` : ''
  redirect(`${AMAZON_CONTACT_PATH}${query}`)
}
