import { shopifyFetch } from './client'
import { BLOGS_QUERY, ARTICLE_BY_HANDLE_QUERY } from './queries'

export interface Article {
  id: string
  title: string
  handle: string
  excerptHtml: string | null
  contentHtml?: string
  publishedAt: string
  seo?: {
    title: string | null
    description: string | null
  }
  image: {
    url: string
    altText: string | null
    width: number | null
    height: number | null
  } | null
  authorV2: {
    name: string
  } | null
  tags: string[]
}

export async function getBlogArticles(
  first = 12,
  after?: string
): Promise<{
  articles: Article[]
  pageInfo: { hasNextPage: boolean; endCursor: string | null }
}> {
  const result = await shopifyFetch<any>({
    query: BLOGS_QUERY,
    variables: { first, after },
  })

  // We are querying `articles` at the root, which queries all articles across all blogs
  const articlesEdge = result.articles
  
  const articles = articlesEdge?.edges?.map((edge: any) => edge.node) || []
  const pageInfo = articlesEdge?.pageInfo || { hasNextPage: false, endCursor: null }

  return { articles, pageInfo }
}

export async function getArticle(handle: string): Promise<Article | null> {
  const result = await shopifyFetch<any>({
    query: ARTICLE_BY_HANDLE_QUERY,
    variables: { handle },
  })

  // Assuming default blog handle is 'news'. Adjust if you use a custom blog handle.
  return result.blog?.articleByHandle || null
}
