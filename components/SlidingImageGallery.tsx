'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type SlidingImageGalleryProps = {
  images: string[]
  index: number
  alt: string
  /** Tailwind padding classes for the slide frame, e.g. "sm:p-8". */
  padClassName?: string
  unoptimized?: boolean
  sizes?: string
  onImageError?: (index: number) => void
}

export default function SlidingImageGallery({
  images,
  index,
  alt,
  padClassName = '',
  unoptimized = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  onImageError,
}: SlidingImageGalleryProps) {
  const count = images.length
  const safeIndex = count > 0 ? ((index % count) + count) % count : 0
  // Extra copy of the first slide so the last → first step can move forward
  // instead of rewinding across every image.
  const slides = count > 1 ? [...images, images[0]] : images
  const [visual, setVisual] = useState(safeIndex)
  const [motion, setMotion] = useState(false)
  const prevIndex = useRef(safeIndex)
  const indexRef = useRef(safeIndex)
  indexRef.current = safeIndex
  const imageKey = images.join('|')

  useEffect(() => {
    const next = indexRef.current
    prevIndex.current = next
    setMotion(false)
    setVisual(next)
  }, [imageKey])

  useEffect(() => {
    if (!count) return
    const prev = prevIndex.current
    if (prev === safeIndex) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const forwardWrap = count > 1 && prev === count - 1 && safeIndex === 0
    const backwardWrap = count > 1 && prev === 0 && safeIndex === count - 1
    prevIndex.current = safeIndex

    if (reduceMotion) {
      setMotion(false)
      setVisual(safeIndex)
      return
    }

    if (forwardWrap) {
      setMotion(true)
      setVisual(count)
      return
    }

    if (backwardWrap) {
      setMotion(false)
      setVisual(count)
      let inner = 0
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => {
          setMotion(true)
          setVisual(count - 1)
        })
      })
      return () => {
        cancelAnimationFrame(outer)
        cancelAnimationFrame(inner)
      }
    }

    setMotion(Math.abs(safeIndex - prev) === 1)
    setVisual(safeIndex)
  }, [safeIndex, count])

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== 'transform' || event.target !== event.currentTarget) return
    if (visual !== count) return
    prevIndex.current = 0
    setMotion(false)
    setVisual(0)
  }

  if (!count) return null

  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      <div
        className="flex h-full w-full min-w-0"
        onTransitionEnd={handleTransitionEnd}
        style={{
          transform: `translate3d(-${visual * 100}%, 0, 0)`,
          transition: motion ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        }}
      >
        {slides.map((src, slideIndex) => {
          const imageIndex = count > 0 ? slideIndex % count : 0
          const distance = Math.min(
            Math.abs(imageIndex - safeIndex),
            count - Math.abs(imageIndex - safeIndex)
          )
          const eager = distance <= 1
          return (
            <div
              key={`${src}-${slideIndex}`}
              className={`flex h-full min-w-0 shrink-0 items-center justify-center overflow-hidden ${padClassName}`}
              style={{ flex: '0 0 100%' }}
            >
              <Image
                src={src}
                alt={slideIndex === count ? '' : `${alt} ${imageIndex + 1}`}
                width={1200}
                height={1200}
                unoptimized={unoptimized}
                sizes={sizes}
                draggable={false}
                {...(slideIndex === 0
                  ? { priority: true as const }
                  : { loading: (eager ? 'eager' : 'lazy') as 'eager' | 'lazy' })}
                className="h-full w-full object-contain"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={() => onImageError?.(imageIndex)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
