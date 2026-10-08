'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'

const slides = [
  {
    id: 1,
    productImage: '/unnamed-2.png',
    productName: 'Boost Energy Capsules',
    productPrice: '₹6999.00',
    backgroundColor: 'bg-[#FF6B6B]',
    rightImage: '/Replace_the_girl_202601061238.jpg',
    headline: 'BOOST YOUR ENERGY LEVELS!',
  },
  {
    id: 2,
    productImage: '/unnamed-3.png',
    productName: 'Daily Wellness Blend',
    productPrice: '₹9999.00',
    backgroundColor: 'bg-[#7C9885]',
    rightImage: '/yoga-man-young-man-doing-yoga-loft-sunrise.jpg',
    headline: 'FIND YOUR INNER BALANCE',
  },
  {
    id: 3,
    productImage: '/unnamed-4.png',
    productName: 'Focus & Clarity Formula',
    productPrice: '₹2599.00',
    backgroundColor: 'bg-[#5B8BA0]',
    rightImage: '/bannerImage5.png',
    headline: 'SHARPEN YOUR MIND',
  },
]

export default function ProductShowcaseSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  const slide = slides[currentSlide]

  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
        {/* Left Side - Product */}
        <div className={`relative w-full md:w-1/2 ${slide.backgroundColor} flex flex-col items-center justify-center p-8 transition-colors duration-500`}>
          {/* Product Image */}
          <div className="relative w-48 h-64 md:w-56 md:h-72 lg:w-64 lg:h-80 mb-6">
            <Image
              src={slide.productImage}
              alt={slide.productName}
              fill
              className="object-contain drop-shadow-2xl transition-opacity duration-500"
              priority
            />
          </div>

          {/* Product Info */}
          <h3 className="text-white text-lg md:text-xl font-medium mb-2 text-center transition-opacity duration-500">
            {slide.productName}
          </h3>
          <p className="text-white/90 text-base md:text-lg transition-opacity duration-500">
            {slide.productPrice}
          </p>

          {/* Navigation Arrow - Right */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-10"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Navigation Arrow - Left */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Hero Image */}
        <div className="relative w-full md:w-1/2 min-h-[300px] md:min-h-full overflow-hidden">
          <Image
            src={slide.rightImage}
            alt={slide.headline}
            fill
            className="object-cover transition-opacity duration-500"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Headline */}
          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight transition-opacity duration-500">
              {slide.headline}
            </h2>
          </div>
        </div>
      </div>
    </section>
  )
}

