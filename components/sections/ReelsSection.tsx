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
  const sectionRef = useRef<HTMLElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const userPlayingRef = useRef(false)
  const lastScrollLeftRef = useRef(0)
  const resumeTimerRef = useRef<number>(0)

  const clearResumeTimer = () => {
    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = 0
    }
  }

  const pauseAutoScroll = () => {
    pausedRef.current = true
    clearResumeTimer()
  }

  const resumeAutoScrollSoon = (delay = 1800) => {
    if (userPlayingRef.current) return
    clearResumeTimer()
    resumeTimerRef.current = window.setTimeout(() => {
      if (userPlayingRef.current) return
      pausedRef.current = false
    }, delay)
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          userPlayingRef.current = false
          pausedRef.current = false
        } else {
          setActiveVideoId(null)
          setIsGlobalMuted(true)
          userPlayingRef.current = false
          pauseAutoScroll()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    let raf = 0
    const tick = () => {
      if (!pausedRef.current && !userPlayingRef.current) {
        el.scrollLeft += 0.75
        const loopAt = el.scrollWidth / 2
        if (loopAt > 0 && el.scrollLeft >= loopAt) {
          el.scrollLeft -= loopAt
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const stop = () => pauseAutoScroll()
    const maybeResume = () => resumeAutoScrollSoon()

    el.addEventListener('pointerdown', stop)
    el.addEventListener('wheel', stop, { passive: true })
    el.addEventListener('touchstart', stop, { passive: true })
    el.addEventListener('pointerup', maybeResume)
    el.addEventListener('touchend', maybeResume, { passive: true })

    return () => {
      el.removeEventListener('pointerdown', stop)
      el.removeEventListener('wheel', stop)
      el.removeEventListener('touchstart', stop)
      el.removeEventListener('pointerup', maybeResume)
      el.removeEventListener('touchend', maybeResume)
      clearResumeTimer()
    }
  }, [])

  const stopUserPlayback = () => {
    if (!userPlayingRef.current) return
    userPlayingRef.current = false
    setIsGlobalMuted(true)
    setActiveVideoId(null)
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    lastScrollLeftRef.current = el.scrollLeft
    const onScroll = () => {
      const delta = Math.abs(el.scrollLeft - lastScrollLeftRef.current)
      lastScrollLeftRef.current = el.scrollLeft
      if (userPlayingRef.current && delta > 6) {
        stopUserPlayback()
        resumeAutoScrollSoon(600)
      }
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const handleToggleMute = () => {
    setIsGlobalMuted((prev) => !prev)
  }

  const handleActivateReel = (uniqueKey: string) => {
    pauseAutoScroll()
    if (activeVideoId === uniqueKey && userPlayingRef.current) {
      userPlayingRef.current = false
      setIsGlobalMuted(true)
      resumeAutoScrollSoon(800)
      return
    }
    userPlayingRef.current = true
    setActiveVideoId(uniqueKey)
    setIsGlobalMuted(false)
  }

  return (
    <section ref={sectionRef} className="pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16 lg:pb-20 bg-fyber-ivory-dream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="mb-4 text-2xl font-bold uppercase tracking-wide text-black md:text-3xl lg:text-4xl">
            Real stories, real recommendations
          </h2>
        </div>

        <div
          ref={scrollerRef}
          className="relative flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide overscroll-x-contain pb-2 -mx-4 sm:-mx-6 px-4 sm:px-6"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
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
                onHoverStart={() => pauseAutoScroll()}
                onHoverEnd={() => resumeAutoScrollSoon(400)}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
