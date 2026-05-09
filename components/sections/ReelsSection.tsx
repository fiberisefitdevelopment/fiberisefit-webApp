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
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Auto-play the first reel when section comes into view
          // Try unmuted first — ReelCard will fall back to muted if browser blocks it
          setActiveVideoId(`${duplicatedReels[0].id}-0`)
          setIsGlobalMuted(false)
        } else {
          // Stop playback when the section goes out of view
          setActiveVideoId(null)
          setIsGlobalMuted(true)
          setHasUserInteracted(false)
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
    setHasUserInteracted(true)
    if (activeVideoId === uniqueKey) {
      // Pause if clicking the same active video
      setActiveVideoId(null)
    } else {
      setActiveVideoId(uniqueKey)
      // Unmute on user click (this counts as a user gesture)
      setIsGlobalMuted(false)
    }
  }

  return (
    <section ref={sectionRef} className="pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16 lg:pb-20 bg-fyber-ivory-dream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight mb-4">
            Real Stores, Real Recommendations!
          </h2>
        </div>

        {/* Marquee / Scrollable Container */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="flex gap-4 md:gap-6 animate-marquee"
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
              width: 'max-content',
            }}
          >
            {duplicatedReels.map((reel, index) => {
              const uniqueKey = `${reel.id}-${index}`
              
              return (
                <ReelCard
                  key={uniqueKey}
                  reel={reel}
                  isActive={activeVideoId === uniqueKey}
                  isMuted={isGlobalMuted}
                  onActivate={() => handleActivateReel(uniqueKey)}
                  onToggleMute={handleToggleMute}
                  onHoverStart={() => {
                    setHasUserInteracted(true)
                    // Switch to this reel and unmute on hover (user gesture)
                    if (activeVideoId !== uniqueKey) {
                      setActiveVideoId(uniqueKey)
                    }
                    setIsGlobalMuted(false)
                  }}
                  onHoverEnd={() => {
                    // Keep playing on hover end
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>


    </section>
  )
}
