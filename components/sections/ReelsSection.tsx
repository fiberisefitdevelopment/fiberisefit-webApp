'use client'

import { useState, useRef, useEffect } from 'react'
import ReelCard from './reels/ReelCard'
import { buildHomepageReels } from '@/lib/reels-config'

const duplicatedReels = (() => {
  const reelsData = buildHomepageReels()
  return [...reelsData, ...reelsData]
})()

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
          setActiveVideoId(`${duplicatedReels[0].id}-0`)
          setIsGlobalMuted(true)
        } else {
          setActiveVideoId(null)
          setIsGlobalMuted(true)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)
  const handleToggleMute = () => {
    setIsGlobalMuted((prev) => !prev)
  }

  const handleActivateReel = (uniqueKey: string) => {
    if (activeVideoId === uniqueKey) {
      setActiveVideoId(null)
    } else {
      setActiveVideoId(uniqueKey)
      setIsGlobalMuted(false)
    }
  }

  return (
    <section ref={sectionRef} className="pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16 lg:pb-20 bg-fyber-ivory-dream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight mb-4">
            Real Stores, Real Recommendations!
          </h2>
        </div>

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
                    if (activeVideoId !== uniqueKey) {
                      setActiveVideoId(uniqueKey)
                    }
                    setIsGlobalMuted(false)
                  }}
                  onHoverEnd={() => {}}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
