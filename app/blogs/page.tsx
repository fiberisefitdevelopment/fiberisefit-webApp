import type { Metadata } from 'next'
import { getBlogArticles } from '@/lib/shopify/blog'
import BlogCard from '@/components/blog/BlogCard'

export const metadata: Metadata = {
  title: 'Insights & Wellness Journal | Fiberise Fit',
  description: 'Explore the latest research, wellness tips, and dietary insights from the Fiberise expert scientific team.',
}

// ISR Revalidation: rebuild page in background every hour
export const revalidate = 3600

export default async function BlogsIndexPage() {
  const { articles } = await getBlogArticles(24) // Fetch up to 24 blogs initially

  return (
    <div className="w-full bg-white pt-24 pb-20 md:pt-32 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-charcoal mb-6 tracking-tight leading-tight">
            Wellness Journal
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl font-light">
            Insights on science-backed nutrition, metabolic health, and elevating your everyday routine.
          </p>
        </div>

        {/* Blogs Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-16">
            {articles.map((article, index) => (
              <BlogCard 
                key={article.id} 
                article={article} 
                priority={index <= 2} // LCP priority for top 3
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">
            <p className="text-lg">No articles found right now. Check back soon!</p>
          </div>
        )}

      </div>
    </div>
  )
}
