'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SKU_RECS } from '@/lib/pack-guide'

const COPIES = 3
const LOOP = Array.from({ length: COPIES }, (_, copy) =>
  SKU_RECS.map((pack, index) => ({ pack, copy, index }))
).flat()

type Pack = (typeof SKU_RECS)[number]

function PackCard({ pack, className }: { pack: Pack; className?: string }) {
  return (
    <article
      className={`flex h-full flex-col border border-[#e8e4dc] rounded-2xl overflow-hidden bg-[#faf8f3] ${className ?? ''}`}
    >
      <Link href={`/products/${pack.handle}`} className="relative block aspect-[16/10] bg-[#0b1c2c]">
        <Image
          src={pack.image}
          alt={pack.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 85vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#868B7A] mb-3">{pack.badge}</p>
        <h3 className="text-xl font-medium">{pack.name}</h3>
        <p className="text-xs text-[#6b6b6b] mt-1">{pack.duration}</p>
        <p className="mt-3 text-lg">
          <span className="font-medium">{pack.price}</span>{' '}
          <span className="text-sm text-[#9a9a9a] line-through">{pack.compare}</span>
        </p>
        <p className="mt-4 text-sm text-[#5c5c5c] leading-relaxed">{pack.when}</p>
        <p className="mt-3 text-xs text-[#6b6b6b] leading-relaxed">{pack.why}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[#1a1a1a]">{pack.bestFor}</p>
        <Link
          href={`/products/${pack.handle}`}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[#1a1a1a] text-white text-xs uppercase tracking-[0.16em] py-3 px-4 hover:bg-black"
        >
          Continue with {pack.name.replace(' Pack', '')}
        </Link>
      </div>
    </article>
  )
}

export default function PackGuideSkuCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const jumpingRef = useRef(false)
  const [active, setActive] = useState(0)

  const setWidth = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return 0
    return el.scrollWidth / COPIES
  }, [])

  const goToMiddleSet = useCallback(() => {
    const el = scrollerRef.current
    const width = setWidth()
    if (!el || width === 0) return
    jumpingRef.current = true
    el.scrollLeft = width
    jumpingRef.current = false
  }, [setWidth])

  const wrapLoop = useCallback(() => {
    const el = scrollerRef.current
    if (!el || jumpingRef.current) return
    const width = setWidth()
    if (width < 8) return

    if (el.scrollLeft < width * 0.5) {
      jumpingRef.current = true
      el.scrollLeft += width
      jumpingRef.current = false
    } else if (el.scrollLeft >= width * 1.5) {
      jumpingRef.current = true
      el.scrollLeft -= width
      jumpingRef.current = false
    }

    const local = ((el.scrollLeft % width) + width) % width
    const card = width / SKU_RECS.length
    if (card > 0) {
      setActive(Math.round(local / card) % SKU_RECS.length)
    }
  }, [setWidth])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const start = () => goToMiddleSet()
    start()
    const raf = requestAnimationFrame(start)

    const onScroll = () => wrapLoop()
    el.addEventListener('scroll', onScroll, { passive: true })

    let lastWidth = setWidth()
    const ro = new ResizeObserver(() => {
      const nextWidth = setWidth()
      if (nextWidth < 8) return
      if (lastWidth < 8) {
        lastWidth = nextWidth
        goToMiddleSet()
        return
      }
      const local = ((el.scrollLeft % lastWidth) + lastWidth) % lastWidth
      jumpingRef.current = true
      el.scrollLeft = nextWidth + (local / lastWidth) * nextWidth
      jumpingRef.current = false
      lastWidth = nextWidth
    })
    ro.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [goToMiddleSet, wrapLoop])

  return (
    <>
      <div className="md:hidden -mx-5">
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory overscroll-x-contain px-5 pb-3"
          style={{ WebkitOverflowScrolling: 'touch' }}
          aria-label="FYBER packs"
        >
          {LOOP.map(({ pack, copy, index }) => (
            <div
              key={`${copy}-${pack.handle}`}
              className="w-[min(82vw,340px)] shrink-0 snap-center"
            >
              <PackCard pack={pack} />
              <span className="sr-only">
                Pack {index + 1} of {SKU_RECS.length}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-4" aria-hidden>
          {SKU_RECS.map((pack, index) => (
            <span
              key={pack.handle}
              className={`h-1.5 rounded-full transition-all ${
                index === active ? 'w-6 bg-[#1a1a1a]' : 'w-1.5 bg-[#d4cfc4]'
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] uppercase tracking-[0.18em] text-[#868B7A]">
          Swipe — loops around
        </p>
      </div>

      <div className="hidden md:grid md:grid-cols-3 gap-5">
        {SKU_RECS.map((pack) => (
          <PackCard key={pack.handle} pack={pack} />
        ))}
      </div>
    </>
  )
}
