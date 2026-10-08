'use client'

import { useState, useCallback } from 'react'

const testimonials = [
  {
    id: 1,
    name: 'Divya',
    quote: '"The bloating is just gone! I was able to notice the changes faster than I expected."',
    rating: 5,
  },
  {
    id: 2,
    name: 'Juhi',
    quote: '"Overeating problem has gone away immediately."',
    rating: 5,
  },
  {
    id: 3,
    name: 'Yash',
    quote: '"I thought my energy will get low but I am able to continue with my daily tasks."',
    rating: 5,
  },
]

export default function TestimonialCarouselSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prevTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  const testimonial = testimonials[currentIndex]

  return (
    <section className="w-full bg-[#F5F3EF] py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Navigation Arrows - Outside content */}
        <button
          onClick={prevTestimonial}
          className="absolute left-4 md:left-8 lg:left-16 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-800 transition-colors z-10"
          aria-label="Previous testimonial"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextTestimonial}
          className="absolute right-4 md:right-8 lg:right-16 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-800 transition-colors z-10"
          aria-label="Next testimonial"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Content */}
        <div className="max-w-3xl mx-auto text-center px-12 md:px-16">
          {/* Star Rating */}
          <div className="flex justify-center gap-1 mb-8">
            {[...Array(testimonial.rating)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Quote */}
          <blockquote
            className="text-xl md:text-2xl lg:text-3xl font-normal leading-relaxed mb-8 text-gray-900"
            suppressHydrationWarning
          >
            {testimonial.quote}
          </blockquote>

          {/* Name */}
          <p className="text-base text-gray-600 mb-10">
            {testimonial.name}
          </p>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-gray-800 w-6' : 'bg-gray-400 w-2'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

