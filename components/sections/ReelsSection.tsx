'use client'

import { useState, useRef, useEffect } from 'react'
import ReelCard from './reels/ReelCard'

// Use the 8 new reels from the /reels folder
const reelsData = Array.from({ length: 8 }, (_, i) => ({
  id: `reel-${i + 1}`,
  videoUrl: `/reels/reel${i + 1}.webm`
}))

// Duplicate reels for seamless infinite marquee loop
const duplicatedReels = [...reelsData, ...reelsData]

export default function ReelsSection() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
  const [isGlobalMuted, setIsGlobalMuted] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Auto-play the first reel and unmute it when the section comes into view
          setActiveVideoId(`${duplicatedReels[0].id}-0`)
          setIsGlobalMuted(false)
        } else {
          // Stop playback when the section goes out of view
          setActiveVideoId(null)
          setIsGlobalMuted(true) // Reset mute state
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
      }
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Pause/resume animation on hover
  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  const handleToggleMute = () => {
    setIsGlobalMuted((prev) => !prev)
  }

  const handleActivateReel = (uniqueKey: string) => {
    if (activeVideoId === uniqueKey) {
      // Pause if clicking the same active video
      setActiveVideoId(null)
    } else {
      setActiveVideoId(uniqueKey)
    }
  }

  return (
    <section ref={sectionRef} className="pt-12 md:pt-16 lg:pt-20 pb-0 bg-fyber-ivory-dream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight mb-4">
            Real Stores, Real Recommendations!
          </h2>
        </div>

        {/* Marquee / Scrollable Container */}
        <div
          className="relative overflow-x-auto hide-scrollbar md:overflow-hidden snap-x snap-mandatory flex scroll-smooth"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="flex gap-4 md:gap-6 md:animate-marquee"
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
              width: 'max-content',
            }}
          >
            {duplicatedReels.map((reel, index) => {
              const uniqueKey = `${reel.id}-${index}`
              
              return (
                <div key={uniqueKey} className="snap-center shrink-0">
                  <ReelCard
                  key={uniqueKey}
                  reel={reel}
                  isActive={activeVideoId === uniqueKey}
                  isMuted={isGlobalMuted}
                  onActivate={() => handleActivateReel(uniqueKey)}
                  onToggleMute={handleToggleMute}
                  onHoverStart={() => {
                    // Start playing on hover if not already playing
                    if (activeVideoId !== uniqueKey) {
                      setActiveVideoId(uniqueKey)
                    }
                  }}
                  onHoverEnd={() => {
                    // Do nothing on hover end to keep playing, or we could pause
                  }}
                />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Happy Customers Marquee - Stuck to bottom */}
      <div className="mt-8 md:mt-12 overflow-hidden bg-fyber-ivory-dream">
        <div className="py-4 md:py-5">
          <div className="animate-marquee-text whitespace-nowrap flex">
            {/* Repeat text multiple times for seamless loop */}
            {[...Array(20)].map((_, i) => (
              <span
                key={i}
                className="text-sm md:text-base font-medium tracking-widest text-gray-800 uppercase mx-6 md:mx-10 flex-shrink-0"
              >
                +10000 HAPPY CUSTOMERS
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
