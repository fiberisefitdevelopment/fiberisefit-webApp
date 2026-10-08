'use client'

import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'

const features = [
  {
    icon: '/icons/Group 642.svg',
    title: 'Mobilises Fat',
    description: "Supports the body's natural fat-utilisation pathways",
    position: 'left-top',
  },
  {
    icon: '/icons/Group 639.svg',
    title: 'Controls Hunger',
    description: 'Helps you feel satisfied, longer.',
    position: 'left-middle',
  },
  {
    icon: '/icons/Group 644.svg',
    title: 'Improves Energy Levels',
    description: 'Clean support for mental and physical clarity.',
    position: 'left-bottom',
  },
  {
    icon: '/icons/Group 643.svg',
    title: 'Reduces Caloric Intake',
    description: "Encourages mindful eating through better fullness.",
    position: 'right-top',
  },
  {
    icon: '/icons/Group 640.svg',
    title: 'Pre-Biotic',
    description: 'Nourishes beneficial gut bacteria naturally.',
    position: 'right-middle',
  },
  {
    icon: '/icons/Group 638.svg',
    title: 'Pro-Biotic',
    description: 'Supports a balanced and resilient gut ecosystem.',
    position: 'right-bottom',
  },
]

export default function VideoSection() {
  const leftFeatures = features.filter(f => f.position.startsWith('left'))
  const rightFeatures = features.filter(f => f.position.startsWith('right'))
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
      { rootMargin: '200px' }
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
    <section className="w-full bg-fyber-ivory-dream py-10 md:py-14 lg:py-16">
      {/* Section Title */}
      <h2 className="text-center text-xl md:text-2xl lg:text-3xl font-semibold tracking-wider uppercase mb-8 md:mb-12">
        <span className="md:hidden">SCIENCE MEETS<br />EVERYDAY CONTROL</span>
        <span className="hidden md:inline">SCIENCE MEETS EVERYDAY CONTROL</span>
      </h2>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-3 items-center">
          {/* Left Features */}
          <div className="flex flex-col gap-6 md:gap-8">
            {leftFeatures.map((feature, index) => (
              <div key={index} className="text-center lg:text-center">
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 relative">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    fill
                    className="object-contain opacity-50"
                  />
                </div>
                <h3 className="text-xs md:text-sm font-semibold tracking-wider uppercase mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600 max-w-[200px] mx-auto leading-tight">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Center Video — lazy loaded */}
          <div ref={containerRef} className="relative flex items-center justify-center order-first lg:order-none">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden border-0 border-none shadow-none ring-0">
              {isVisible ? (
                <video
                  ref={videoRef}
                  loop
                  muted
                  playsInline
                  preload="none"
                  className="w-full h-full object-cover border-0 outline-none"
                >
                  <source src="/videos/conversion.webm" type="video/webm" />
                </video>
              ) : (
                <div className="w-full h-full bg-gray-100 animate-pulse" />
              )}
            </div>
          </div>

          {/* Right Features */}
          <div className="flex flex-col gap-6 md:gap-8">
            {rightFeatures.map((feature, index) => (
              <div key={index} className="text-center lg:text-center">
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 relative">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    fill
                    className="object-contain opacity-70"
                  />
                </div>
                <h3 className="text-xs md:text-sm font-semibold tracking-wider uppercase mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600 max-w-[200px] mx-auto leading-tight">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
