import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getArticle, getBlogArticles } from '@/lib/shopify/blog'
import { parseBlogContent } from '@/lib/blog/parser'
import { getAuthorProfile } from '@/lib/blog/authors'
import { generateBlogSchemas } from '@/lib/blog/schema'

import RichText from '@/components/blog/RichText'
import TableOfContents from '@/components/blog/TableOfContents'
import BlogCard from '@/components/blog/BlogCard'

export const revalidate = 3600 // Cache for 1 hour

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const article = await getArticle(params.slug)
  if (!article) return {}

  const title = article.seo?.title || article.title
  const description = article.seo?.description || article.excerptHtml?.replace(/<[^>]+>/g, '') || ''
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.publishedAt,
      tags: article.tags,
      images: article.image ? [{ url: article.image.url }] : [],
    },
  }
}

export default async function BlogDetailPage(props: Props) {
  const params = await props.params
  const article = await getArticle(params.slug)
  if (!article) notFound()

  // 1. Process Content (TOC, IDs injected, FAQs extracted)
  const { html, toc, faqs } = parseBlogContent(article.contentHtml || '')

  // 2. Map Author
  const author = getAuthorProfile(article.authorV2?.name)

  // 3. Generate Schema String
  const schemaStr = generateBlogSchemas(article, faqs, author)

  // 4. Fetch Related Articles (Simple logic: fetch generic articles and exclude current)
  // In a robust implementation, you could filter Shopify query by `query: tag:${article.tags[0]}`
  const { articles: genericArticles } = await getBlogArticles(4)
  const relatedArticles = genericArticles.filter((a) => a.id !== article.id).slice(0, 3)

  // Format Date
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="w-full bg-[#F5F0EB] relative pb-24 pt-24 md:pt-32">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaStr }}
      />

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* White Card Container for Blog */}
        <div className="w-full overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-12 lg:p-16 mb-12">
          
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8 w-full">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span>›</span>
            <Link href="/blogs" className="hover:text-black transition-colors">Blog</Link>
            <span>›</span>
            <span className="text-gray-900 truncate max-w-[200px] md:max-w-none">{article.title}</span>
          </div>
        </nav>

        {/* 1. Header & Title */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-gray-900 tracking-tight leading-[1.15] mb-8">
            {article.title}
          </h1>

          {/* 2. EEAT Author + Review + Date row */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 py-4 mb-10 w-full text-sm">
            {/* Author */}
            <div className="flex items-center gap-4 w-full lg:w-auto bg-white border border-gray-100 rounded-xl p-4 md:p-5 shadow-sm transition-shadow hover:shadow-md duration-200 flex-1">
              <div className="w-12 h-12 rounded-full overflow-hidden relative bg-gray-100 flex-shrink-0">
                <Image src={author.image} alt={author.name} fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900">By {author.name}</span>
                <span className="text-gray-500">{author.role}</span>
              </div>
            </div>

            {/* Reviewer (Hardcoded expert for EEAT boost as per design) */}
            <div className="flex items-center gap-4 w-full lg:w-auto bg-white border border-gray-100 rounded-xl p-4 md:p-5 shadow-sm transition-shadow hover:shadow-md duration-200 flex-1">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900">Reviewed by</span>
                <span className="text-gray-500">Dr. Amit Verma, Medical Advisor</span>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-4 w-full lg:w-auto bg-white border border-gray-100 rounded-xl p-4 md:p-5 shadow-sm transition-shadow hover:shadow-md duration-200 flex-1">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900">Last updated</span>
                <span className="text-gray-500">{publishedDate}</span>
              </div>
            </div>
          </div>
        </header>

        {/* 3. Featured Image */}
        {article.image && (
          <figure className="w-full h-[300px] sm:h-[400px] md:h-[500px] relative rounded-[16px] overflow-hidden mb-12 bg-gray-100 shadow-sm transition-all duration-300">
            <Image
              src={article.image.url}
              alt={article.image.altText || article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </figure>
        )}

        {/* NO SIDEBAR - Center aligned content block */}
        <div className="w-full max-w-[720px] mx-auto flex flex-col gap-12 md:gap-[60px]">
          
          {/* 4. Table of Contents (Inline, full width in text column) */}
          <div className="w-full bg-[#F7F7F7] rounded-[12px] p-5 md:p-6 shadow-sm border border-gray-100 transition-shadow duration-200 hover:shadow-md">
            <TableOfContents toc={toc} />
          </div>

          {/* 5. Rich Text Content */}
          <div className="w-full bg-white">
            <RichText html={html} />
          </div>

          {/* 6. Render Extracted FAQs (Accordion style) */}
          {faqs.length > 0 && (
            <div className="w-full mt-8" id="frequently-asked-questions">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="flex flex-col gap-3">
                {faqs.map((faq, idx) => (
                  <details key={idx} className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden cursor-pointer">
                    <summary className="flex justify-between items-center font-bold p-5 list-none">
                      <span className="text-gray-900 pr-4">{faq.question}</span>
                      <span className="transition group-open:rotate-45 text-2xl leading-none font-light text-gray-500">+</span>
                    </summary>
                    <div className="p-5 pt-0 text-gray-600 leading-relaxed">
                      {faq.answer.replace(/<[^>]+>/g, '')}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* 7. Author Bio Section */}
          <div className="w-full mt-10 p-8 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden relative bg-white flex-shrink-0 flex items-center justify-center border border-gray-100 shadow-sm">
              <Image src={author.image} alt={author.name} fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-lg font-bold text-gray-900 mb-1">About the Author</h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                <strong>{author.name}</strong> is a {author.role}. {author.bio}
              </p>
              {author.linkedin && (
                <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="inline-block w-8 h-8 rounded bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-90 transition">
                  {/* LinkedIn Icon */}
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* 8. Internal Navigation (Prev / Next) */}
          <div className="w-full flex justify-between items-center py-8 border-y border-gray-200 mt-2">
            <Link href="/blogs" className="flex flex-col group max-w-[45%]">
              <span className="text-gray-500 text-sm mb-1 flex items-center gap-2 group-hover:text-black transition">
                <span className="text-lg leading-none">←</span> Previous Article
              </span>
              <span className="font-bold text-gray-900 truncate">Explore Wellness Journal</span>
            </Link>
            <Link href="/blogs" className="flex flex-col items-end group max-w-[45%] text-right">
              <span className="text-gray-500 text-sm mb-1 flex items-center gap-2 group-hover:text-black transition">
                Next Article <span className="text-lg leading-none">→</span>
              </span>
              <span className="font-bold text-gray-900 truncate">More Fiberise Insights</span>
            </Link>
          </div>

        </div>
      </div>
      </div>

      {/* 9. Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="mt-12 w-full bg-[#F5F0EB] py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((rel) => (
                <BlogCard key={rel.id} article={rel} />
              ))}
            </div>

            {/* 10. Newsletter Box CTA */}
            <div className="mt-20 max-w-4xl mx-auto bg-gray-50 border border-gray-200 rounded-2xl flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Stay Updated with Insights</h3>
                  <p className="text-gray-500">Subscribe to our newsletter and never miss an update.</p>
                </div>
              </div>
              <button className="whitespace-nowrap px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95">
                Subscribe Now
              </button>
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
