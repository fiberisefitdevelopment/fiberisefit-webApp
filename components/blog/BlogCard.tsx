import Image from 'next/image'
import Link from 'next/link'
import { Article } from '@/lib/shopify/blog'

export default function BlogCard({ article, priority = false }: { article: Article; priority?: boolean }) {
  const date = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  // Strip HTML from excerpt safely
  const excerpt = article.excerptHtml 
    ? article.excerptHtml.replace(/<[^>]+>/g, '') 
    : 'Read the full article to learn more.'

  return (
    <Link href={`/blogs/${article.handle}`} className="group flex flex-col group h-full">
      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-gray-100">
        {article.image ? (
          <Image
            src={article.image.url}
            alt={article.image.altText || article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow">
        <div className="flex gap-2 items-center text-xs text-gray-500 mb-2 font-medium tracking-wide">
          {article.tags?.[0] && (
            <>
              <span className="uppercase text-fyber-emerald-forest font-semibold">{article.tags[0]}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
            </>
          )}
          <span>{date}</span>
        </div>

        <h3 className="text-xl md:text-2xl font-serif font-medium leading-snug mb-3 group-hover:text-fyber-emerald-forest transition-colors">
          {article.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed mt-auto">
          {excerpt}
        </p>
      </div>
    </Link>
  )
}
