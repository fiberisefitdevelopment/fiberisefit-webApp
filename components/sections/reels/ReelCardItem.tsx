'use client'

import { useRef, useEffect, useState } from 'react'

import { Play, Volume2, VolumeX } from 'lucide-react'

interface Reel {
  id: string
  videoUrl: string
}

interface ReelCardProps {
  reel: Reel
  isActive: boolean
  isMuted: boolean
  onActivate: () => void
  onFocus: () => void
  onToggleMute: () => void
}

export default function ReelCard({
  reel,
  isActive,
  isMuted,
  onActivate,
  onFocus,
  onToggleMute,
}: ReelCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // State for lazy loading
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Intersection Observer for focus (autoplay) and lazy loading
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // We use a threshold array to track detailed visibility changes
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If we cross the 60% visibility mark, we become the active reel
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          onFocus()
        }
        
        // Lazy load the video if it's near the viewport (10% visible)
        if (entry.isIntersecting && !hasLoaded) {
          const video = videoRef.current
          if (video && !video.src) {
            video.src = reel.videoUrl
            video.load()
            setHasLoaded(true)
          }
        }
      },
      {
        root: null, // relative to viewport
        rootMargin: '200px', // start loading slightly before it enters fully
        threshold: [0.1, 0.6], // Trigger at 10% (load) and 60% (play)
      }
    )

    observer.observe(container)

    return () => {
      if (container) observer.unobserve(container)
    }
  }, [hasLoaded, onFocus, reel.videoUrl])

  // Handle play/pause and muted state based on active state
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // IMPORTANT: Set muted state BEFORE calling play() to avoid browser blocking
    video.muted = isMuted

    if (isActive) {
      // Small timeout to prevent play() promise interruption errors
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true)
        }).catch((error) => {
          console.log('Video play interrupted or failed:', error)
          
          // Fallback: If browser blocks unmuted autoplay (NotAllowedError),
          // immediately mute it and try playing again so the user at least sees the video
          if (error.name === 'NotAllowedError' && !isMuted) {
            console.log('Falling back to muted autoplay due to browser policy')
            video.muted = true
            video.play().then(() => {
              setIsPlaying(true)
            }).catch(e => console.log('Muted fallback also failed', e))
          } else {
            setIsPlaying(false)
          }
        })
      }
    } else {
      video.pause()
      video.currentTime = 0 // Reset to start when not active
      setIsPlaying(false)
    }
  }, [isActive, isMuted])

  return (
    <div
      ref={containerRef}
      className="flex-shrink-0 group cursor-pointer snap-center sm:snap-start"
      onClick={onActivate}
    >
      <div
        className="relative aspect-[9/16] bg-gray-200 rounded-3xl overflow-hidden shadow-lg w-[280px] md:w-[320px] transition-transform duration-300 ease-out origin-center"
        style={{
          // Slightly scale up the active reel for a premium feel
          transform: isActive ? 'scale(1)' : 'scale(0.95)',
          opacity: isActive ? 1 : 0.7,
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
            preload="none" // Handled manually
          />
          
          {/* Gradient Overlay - only show when not playing */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-200 ease-out rounded-3xl ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
          />
        </div>

        {/* Play Icon (when not playing) */}
        {!isPlaying && hasLoaded && (
          <div className="absolute top-3 left-3 pointer-events-none z-10">
            <div className="bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg p-2 md:p-2.5 transition-all duration-200 ease-out">
              <Play
                className="text-white ml-0.5 drop-shadow-lg w-4 h-4 md:w-5 md:h-5"
                fill="currentColor"
              />
            </div>
          </div>
        )}

        {/* Audio Toggle Button */}
        {isActive && hasLoaded && isPlaying && (
          <div 
            className="absolute top-3 right-4 z-20 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation() // Prevent toggling play/pause when toggling audio
              onToggleMute()
            }}
          >
            <div className="bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-lg p-2 md:p-2.5 transition-all duration-200">
              {videoRef.current?.muted || isMuted ? (
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
