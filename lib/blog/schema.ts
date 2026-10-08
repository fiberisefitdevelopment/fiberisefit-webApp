import { Article } from '../shopify/blog'
import { FAQItem } from './parser'
import { AuthorProfile } from './authors'

const SITE_URL = 'https://fiberisefit.com'

/**
 * Generates Article, FAQ, and Author JSON-LD schemas
 */
export function generateBlogSchemas(
  article: Article, 
  faqs: FAQItem[], 
  author: AuthorProfile
) {
  const url = `${SITE_URL}/blogs/${article.handle}`

  // 1. Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.seo?.title || article.title,
    description: article.seo?.description || article.excerptHtml?.replace(/<[^>]+>/g, '') || '',
    image: article.image?.url ? [article.image.url] : [],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt, // Shopify doesn't reliably expose updatedAt globally, use publishedAt
    author: [
      {
        '@type': 'Person',
        name: author.name,
        url: author.linkedin || url,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Fiberise Fit',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/fiberisefit%20dark%20logo.png`,
      },
    },
  }

  // 2. FAQ Schema (if FAQs exist)
  let faqSchema = null
  if (faqs.length > 0) {
    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    }
  }

  // Combine multiple schemas
  return `[${JSON.stringify(articleSchema)}${faqSchema ? ',' + JSON.stringify(faqSchema) : ''}]`
}
