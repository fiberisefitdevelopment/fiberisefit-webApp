'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

interface Reel {
  id: string
  videoUrl: string
}

interface ReelCardProps {
  reel: Reel
  isActive: boolean
  isMuted: boolean
  onActivate: () => void
  onToggleMute: () => void
  onHoverStart: () => void
  onHoverEnd: () => void
}

export default function ReelCard({
  reel,
  isActive,
  isMuted,
  onActivate,
  onToggleMute,
  onHoverStart,
  onHoverEnd,
}: ReelCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // State for lazy loading
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  // Intersection Observer for lazy loading
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        rootMargin: '200px', // Load video slightly before it comes into view
        threshold: 0,
      }
    )

    observer.observe(container)

    return () => {
      if (container) observer.unobserve(container)
    }
  }, [])

  // Handle play/pause based on active state and intersection
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isActive && isIntersecting) {
      // Small timeout to prevent play() promise interruption errors
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Video play interrupted or failed:', error)
        })
      }
    } else {
      video.pause()
    }
  }, [isActive, isIntersecting])

  // Handle video source loading
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // If it's intersecting and hasn't loaded yet, set the source
    if (isIntersecting && !hasLoaded) {
      video.src = reel.videoUrl
      video.load()
      setHasLoaded(true)
    }
  }, [isIntersecting, hasLoaded, reel.videoUrl])

  // Ensure muted state is updated (especially for unmuting)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Changing the muted property directly bypasses some React state batching issues with video elements
    video.muted = isMuted
  }, [isMuted])

  return (
    <div
      ref={containerRef}
      className="flex-shrink-0 group cursor-pointer"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={onActivate}
    >
      <div
        className="relative aspect-[9/16] bg-gray-200 rounded-3xl overflow-hidden shadow-lg w-[200px] md:w-[240px] lg:w-[280px] transition-all duration-300 ease-out origin-center"
        style={{
          transform: 'scaleY(1)',
          transition: 'transform 300ms ease-out',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scaleY(1.08)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scaleY(1)'
        }}
      >
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          {/* Skeleton/Loading State */}
          {!hasLoaded && (
            <div className="w-8 h-8 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
          )}

          <video
            ref={videoRef}
            className={`w-full h-full object-cover transition-opacity duration-300 ${hasLoaded ? 'opacity-100' : 'opacity-0'}`}
            loop
            playsInline
            muted={isMuted}
            preload="none" // We handle preload manually with src assignment
          />

          {/* Gradient Overlay - only show when not playing */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-200 ease-out rounded-3xl ${isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
          />
        </div>

        {/* Play Icon (when not active) */}
        {!isActive && hasLoaded && (
          <div className="absolute top-3 left-3 pointer-events-none z-10">
            <div className="bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg p-2 md:p-2.5 group-hover:bg-white/30 transition-all duration-200 ease-out">
              <Play
                className="text-white ml-0.5 drop-shadow-lg w-4 h-4 md:w-5 md:h-5"
                fill="currentColor"
              />
            </div>
          </div>
        )}

        {/* Pause Icon (when active) */}
        {isActive && hasLoaded && (
          <div className="absolute top-3 left-3 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg p-2 md:p-2.5">
              <Pause
                className="w-4 h-4 md:w-5 md:h-5 text-white drop-shadow-lg"
                fill="currentColor"
              />
            </div>
          </div>
        )}

        {/* Audio Toggle Button */}
        {isActive && hasLoaded && (
          <div
            className="absolute top-3 right-4 z-20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation() // Prevent toggling play/pause when toggling audio
              onToggleMute()
            }}
          >
            <div className="bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-lg p-2 md:p-2.5 transition-all duration-200">
              {isMuted ? (
                <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
