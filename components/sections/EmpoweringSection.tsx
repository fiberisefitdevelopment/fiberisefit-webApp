'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export default function EmpoweringSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const enableMobileAnimation = false

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // For mobile, we currently disable the scroll-based animation entirely
      if (isMobile && !enableMobileAnimation) {
        setScrollProgress(0)
        setIsInView(false)
        return
      }

      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const containerTop = rect.top
      const containerHeight = rect.height
      const windowHeight = window.innerHeight

      // Check if section is in view for sticky/fixed effect
      const inView = containerTop <= 0 && containerTop > -(containerHeight - windowHeight)
      setIsInView(inView)

      // Calculate progress based on how far we've scrolled through the container
      if (isMobile && enableMobileAnimation) {
        // Mobile: Track scroll from when container enters viewport
        // Animation starts immediately when container top reaches viewport top (containerTop <= 0)
        if (containerTop <= 0) {
          // Calculate scroll distance: when sticky, containerTop goes from 0 to -(containerHeight - windowHeight)
          const scrolled = Math.abs(containerTop) // How far container has scrolled up
          const maxScroll = containerHeight - windowHeight // 220vh - 100vh = 120vh
          // Slow down animation significantly by using only a small part of the scroll distance
          // Use 35% of max scroll to complete animation, making it much slower (takes ~3x scroll)
          const animationScrollDistance = maxScroll * 0.35 // Use 35% of available scroll for very slow animation
          const progress = animationScrollDistance > 0 ? Math.min(1, scrolled / animationScrollDistance) : 0
          setScrollProgress(progress)
        } else {
          setScrollProgress(0)
        }
      } else {
        // Desktop: original calculation
        if (containerTop <= 0) {
          const scrolled = Math.abs(containerTop)
          const scrollableDistance = containerHeight - windowHeight
          const progress = scrollableDistance > 0 ? Math.min(1, scrolled / scrollableDistance) : 0
          setScrollProgress(progress)
        } else {
          setScrollProgress(0)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  const scrollToNext = () => {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
  }

  // Yellow circle (LEFT) - appears first (0-50% scroll), moves from bottom to top and exits (desktop only)
  const yellowProgress = Math.min(1, scrollProgress * 2) // 0->1 during first 50%
  // For desktop: percentage-based top positioning
  const yellowY = 110 - (yellowProgress * 130) // 110% -> -20% (exits at top)
  // For mobile: animation disabled, keep translateY static
  const yellowTranslateY = isMobile && enableMobileAnimation ? (60 - (yellowProgress * 60)) : 0
  const yellowOpacity = yellowProgress < 0.9 ? (yellowProgress > 0.05 ? 1 : 0) : Math.max(0, 1 - (yellowProgress - 0.9) * 10)

  // Blue circle (RIGHT) - appears AFTER yellow exits (50-100% scroll)
  const blueProgress = Math.max(0, Math.min(1, (scrollProgress - 0.5) * 2)) // 0->1 during second 50%
  const blueY = 110 - (blueProgress * 130) // 110% -> -20% (exits at top)
  // For mobile: animation disabled, keep translateY static
  const blueTranslateY = isMobile && enableMobileAnimation ? (60 - (blueProgress * 60)) : 0
  const blueOpacity = blueProgress < 0.9 ? (blueProgress > 0.05 ? 1 : 0) : Math.max(0, 1 - (blueProgress - 0.9) * 10)

  // On mobile: animation disabled, keep section non-fixed
  const isAnimationActive = isMobile && enableMobileAnimation && scrollProgress > 0 && scrollProgress < 1
  const animationEnded = isMobile && enableMobileAnimation && scrollProgress >= 1
  // Only stay fixed during active animation
  const shouldStayFixed = isMobile && isAnimationActive

  // Reduce container height after animation to eliminate extra space
  const getContainerHeight = () => {
    if (isMobile && !enableMobileAnimation) return 'auto'
    if (isMobile && animationEnded) return '100vh' // Minimal height after animation
    if (isMobile) return '220vh' // Full height during animation
    return '400vh' // Desktop height
  }

  return (
    <div 
      ref={containerRef} 
      className="relative m-0 p-0 md:h-[400vh]"
      style={{ height: getContainerHeight() }}
    >
      {/* Mobile: Fixed during and after animation to keep text stuck, Desktop: Fixed/absolute positioning */}
      <div 
        className={`${isMobile && !shouldStayFixed ? 'static' : 'md:static'} top-0 left-0 w-full h-auto md:h-screen bg-[#F5F3EF] flex flex-col items-center justify-center md:justify-start pt-0 md:pt-20 px-4 pb-0 overflow-hidden md:overflow-visible z-20`}
        style={isMobile ? {
          position: shouldStayFixed ? 'fixed' : 'static',
          // Prevent layout shifts and flickering
          transform: shouldStayFixed ? 'translateZ(0)' : 'none',
          backfaceVisibility: 'hidden',
          // Prevent repaints that cause flickering
          willChange: shouldStayFixed ? 'transform' : 'auto',
        } : {
          position: isInView ? 'fixed' : 'absolute',
          height: 'auto',
          ...(!isInView && scrollProgress >= 1 ? { top: 'auto', bottom: 0 } : {})
        }}
      >
        
          {/* Yellow Circle - LEFT SIDE */}
          <div 
            className="absolute left-4 md:left-12 lg:left-20 z-30"
            style={isMobile ? {
              top: '50%',
              transform: `translateY(calc(-50% + ${yellowTranslateY}vh))`,
              opacity: yellowOpacity,
              transition: 'opacity 0.2s ease-out',
            } : {
              top: `${yellowY}%`,
              transform: 'translateY(-50%)',
              opacity: yellowOpacity,
              transition: 'opacity 0.2s ease-out',
            }}
          >
            <div className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 overflow-visible">
              <div className="absolute inset-0 bg-[#102333] rounded-full shadow-2xl" />
              <div className="absolute inset-0 flex items-center justify-center overflow-visible">
                <Image
                  src="/team-photos/lime and lemon mockup front.png"
                  alt="Fyber - Lime and lemon supplement product"
                  width={600}
                  height={900}
                  className="w-96 md:w-[28rem] lg:w-[36rem] h-auto drop-shadow-2xl -rotate-12"
                  style={{ maxWidth: 'none' }}
                  priority
                />
              </div>
            </div>
          </div>

        {/* Blue Circle - RIGHT SIDE */}
        <div 
          className="absolute right-4 md:right-12 lg:right-20 z-30"
          style={isMobile ? {
            top: '50%',
            transform: `translateY(calc(-50% + ${blueTranslateY}vh))`,
            opacity: blueOpacity,
            transition: 'opacity 0.2s ease-out',
          } : {
            top: `${blueY}%`,
            transform: 'translateY(-50%)',
            opacity: blueOpacity,
            transition: 'opacity 0.2s ease-out',
          }}
        >
          <div className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 overflow-visible">
            <div className="absolute inset-0 bg-[#168B6A] rounded-full shadow-2xl" />
            <div className="absolute inset-0 flex items-center justify-center overflow-visible">
              <Image
                src="/team-photos/unflavoured mockup front.png"
                alt="Fyber - Unflavoured supplement product"
                width={600}
                height={900}
                className="w-96 md:w-[28rem] lg:w-[36rem] h-auto drop-shadow-2xl rotate-6"
                style={{ maxWidth: 'none' }}
                priority
              />
            </div>
          </div>
        </div>

        {/* Text Content - Sticky/fixed on mobile, original positioning on desktop */}
        <div className={`max-w-5xl mx-auto text-center relative z-10 px-4 mb-0 pb-0 ${
          isMobile 
            ? 'absolute inset-0 flex flex-col items-center justify-center' 
            : 'mt-0 md:mt-32 lg:mt-40'
        }`}>
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] mb-4 md:mb-12 lg:mb-16">
            MADE FOR THE<br /><span className="block mt-1.5 md:mt-3 lg:mt-5">INTELLIGENT</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-gray-700 max-w-xl mx-auto mb-0 md:mb-6 leading-relaxed tracking-wide text-center !text-center md:!text-left">
            At Fiberise, we create health solutions with purpose and precision. Every formulation is built using the highest quality, clinically researched ingredients—selected for real biological impact, not trends or marketing appeal. We believe in functional science that supports long-term wellness, metabolic health, and longevity. No fillers. No shortcuts. Just intelligent, evidence-driven nutrition designed to elevate health over time.
          </p>

          {/* CTA Button */}
          {/* <a
            href="/about"
            className="inline-block bg-black text-white px-8 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors mb-8"
          >
            ABOUT US
          </a> */}

          {/* Scroll Down Arrow */}
          <div className="mt-2 md:mt-6 mb-0 pb-0">
            <button
              onClick={scrollToNext}
              className="text-gray-600 hover:text-black transition-colors"
              aria-label="Scroll down"
            >
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Featured On Marquee */}
        {/* <div className="absolute bottom-0 left-0 right-0 bg-[#F5F3EF] pt-10 pb-10 z-40">
          <p className="text-center text-xs tracking-[0.3em] uppercase text-gray-500 mb-8">
            Available on
          </p>
          <div className="overflow-hidden">
            <div className="flex animate-marquee-brands items-center">
              {[...Array(4)].map((_, setIndex) => (
<div key={setIndex} className="flex items-center flex-shrink-0">
                    <div className="flex-shrink-0 mx-10 md:mx-14 lg:mx-20">
                      <Image src="/icons/51URc01.svg" alt="Zepto" width={250} height={120} className="h-16 md:h-20 lg:h-24 w-auto" />
                    </div>
                    <div className="flex-shrink-0 mx-10 md:mx-14 lg:mx-20">
                      <Image src="/icons/D43OX01.svg" alt="Flipkart" width={250} height={120} className="h-16 md:h-20 lg:h-24 w-auto" />
                    </div>
                    <div className="flex-shrink-0 mx-10 md:mx-14 lg:mx-20">
                      <Image src="/icons/GYlYk01.svg" alt="Blinkit" width={250} height={120} className="h-16 md:h-20 lg:h-24 w-auto" />
                    </div>
                    <div className="flex-shrink-0 mx-10 md:mx-14 lg:mx-20">
                      <Image src="/icons/IZPNV01.svg" alt="Amazon" width={250} height={120} className="h-16 md:h-20 lg:h-24 w-auto" />
                    </div>
                    <div className="flex-shrink-0 mx-10 md:mx-14 lg:mx-20">
                      <Image src="/icons/uQkTe01.svg" alt="JioMart" width={250} height={120} className="h-16 md:h-20 lg:h-24 w-auto" />
                    </div>
                    <div className="flex-shrink-0 mx-10 md:mx-14 lg:mx-20">
                      <Image src="/icons/O2S3S01.svg" alt="Instamart" width={250} height={120} className="h-16 md:h-20 lg:h-24 w-auto" />
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

