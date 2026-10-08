'use client'

import Image from 'next/image'

const blogPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
    date: 'JANUARY 20, 2025',
    title: 'THE POWER OF OMEGA-3: WHY YOU NEED IT IN YOUR DIET',
    excerpt: 'Omega-3 fatty acids are essential fats that play a critical role in maintaining overall health. Unlike some nutrients that your body can produce, Omega-3s must come from your diet or...',
    slug: '/blog/omega-3-power',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    date: 'JANUARY 19, 2025',
    title: 'FEEL BETTER EVERY DAY: SUPPLEMENTS FOR A HAPPIER, HEALTHIER YOU',
    excerpt: 'Life can be demanding, and feeling your best every day can sometimes feel like a challenge. But what if there was a simple way to boost your energy, mood, and...',
    slug: '/blog/feel-better-every-day',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    date: 'JANUARY 19, 2025',
    title: 'THE SCIENCE BEHIND QUALITY: INSIDE OUR SUPPLEMENT LABORATORY',
    excerpt: 'When it comes to supplements, quality is everything. That\'s why we\'ve made it our mission to ensure every product you purchase meets the highest standards of safety and efficacy. At...',
    slug: '/blog/science-behind-quality',
  },
]

export default function BlogSection() {
  return (
    <section className="w-full bg-white pt-0 pb-16 md:pb-20 lg:pb-24" style={{ willChange: 'auto', backfaceVisibility: 'hidden' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="group">
              {/* Image */}
              <a href={post.slug} className="block relative aspect-[16/9] overflow-hidden mb-6">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </a>

              {/* Content */}
              <div className="space-y-4">
                {/* Date */}
                <p className="text-xs tracking-widest text-gray-500 uppercase">
                  {post.date}
                </p>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold tracking-wide uppercase leading-tight">
                  <a href={post.slug} className="hover:text-gray-600 transition-colors">
                    {post.title}
                  </a>
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Read More Link */}
                <a 
                  href={post.slug}
                  className="inline-block text-sm font-semibold tracking-widest uppercase border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
                >
                  READ MORE
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

