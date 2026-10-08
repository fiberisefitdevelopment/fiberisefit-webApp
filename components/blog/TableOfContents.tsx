'use client'

import { useEffect, useState } from 'react'
import { TOCItem } from '@/lib/blog/parser'
import { cn } from '@/lib/utils'

export default function TableOfContents({ toc }: { toc: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Collect all IDs
    const allIds: string[] = []
    toc.forEach((item) => {
      allIds.push(item.id)
      item.children?.forEach((child) => allIds.push(child.id))
    })

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting entry
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) {
          setActiveId(visible.target.id)
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0.1 }
    )

    allIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [toc])

  if (toc.length === 0) return null

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
      // Auto-collapse on mobile after clicking (optional polish)
    }
  }

  return (
    <details className="w-full group" open>
      <summary className="text-sm font-bold tracking-widest uppercase mb-1 md:mb-2 text-gray-900 flex items-center justify-between gap-2 cursor-pointer list-none select-none">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Table of Contents
        </div>
        <span className="transition-transform duration-200 group-open:rotate-180 md:hidden">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </summary>
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-x-6 md:gap-y-3 text-sm font-medium pt-3 md:pt-4 border-t border-gray-200 md:border-transparent mt-3 md:mt-0">
        {toc.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleScroll(e, item.id)}
            className={cn(
              'transition-all duration-200 inline-block',
              'hover:text-black hover:translate-x-1 md:hover:translate-x-0 md:hover:-translate-y-[1px]',
              activeId === item.id ? 'text-black font-bold underline underline-offset-4 decoration-gray-300' : 'text-gray-500'
            )}
          >
            {index + 1}. {item.title}
          </a>
        ))}
      </div>
    </details>
  )
}
