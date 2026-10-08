'use client'

import { useRef, useState, useEffect } from 'react'

export default function FullWidthVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [isVisible])

  return (
    <section ref={containerRef} className="w-full m-0 p-0">
      <div className="relative w-full h-screen md:h-screen aspect-[9/16] md:aspect-[21/9]">
        {/* Video — lazy loaded */}
        {isVisible ? (
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="none"
            className="w-full h-full object-cover"
          >
            <source src="/videos/sustainable-video.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-full bg-gray-900" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text Content */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          style={{ fontFamily: 'QuadratGrotesk, sans-serif' }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-white mb-8 md:mb-10 lg:mb-12 tracking-tight">
          Natural Origins , Scientific Discipline
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-white/90 tracking-[0.2em] uppercase mb-8 md:mb-10 leading-[1.8] md:leading-[2]">
          Exceptionally sourced natural ingredients, <br />  elevated through science to meet the highest standards.          </p>
        </div>
      </div>
    </section>
  )
}
