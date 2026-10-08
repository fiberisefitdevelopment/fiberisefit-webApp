'use client'

import Image from 'next/image'

export const PRESS_LOGOS = [
  {
    src: '/news_logo/business-standard-logo-2.png',
    alt: 'Business Standard logo',
  },
  {
    src: '/news_logo/WhatsApp_Image_2026-03-17_at_13.25.21-removebg-preview.png',
    alt: 'Mid-Day logo',
  },
  {
    src: '/news_logo/Logo_Asian_News_International.svg',
    alt: 'ANI logo',
  },
  {
    src: '/news_logo/WhatsApp_Image_2026-03-17_at_13.25.20-removebg-preview.png',
    alt: 'ABP logo',
  },
  {
    src: '/news_logo/id8MTKItTI_logos.png',
    alt: 'Outlook logo',
  },
  {
    src: '/news_logo/Republic_idhIB8eof8_0.png',
    alt: 'Republic TV logo',
  },
  {
    src: '/news_logo/WhatsApp_Image_2026-03-17_at_13.25.21__1_-removebg-preview.png',
    alt: 'Outlook logo alt',
  },
  {
    src: '/news_logo/d789e0f5-4634-431b-89ca-ce43cf6a9710_1080x1080.jpg',
    alt: 'The Quint logo',
  },
] as const

function PressLogoImage({
  src,
  alt,
  compact,
}: {
  src: string
  alt: string
  compact?: boolean
}) {
  const isRepublic = src === '/news_logo/Republic_idhIB8eof8_0.png'
  const isBusinessStandard = src === '/news_logo/business-standard-logo-2.png'
  const isAbp = src === '/news_logo/WhatsApp_Image_2026-03-17_at_13.25.20-removebg-preview.png'
  const isOutlookMain = src === '/news_logo/id8MTKItTI_logos.png'
  const isOutlookAlt = src === '/news_logo/WhatsApp_Image_2026-03-17_at_13.25.21__1_-removebg-preview.png'

  let imageClassName =
    'h-full w-auto object-contain opacity-80 hover:opacity-100 transition-opacity'

  if (isRepublic || isAbp) {
    imageClassName = compact
      ? 'h-[68%] md:h-[65%] lg:h-[70%] w-auto object-contain opacity-80 hover:opacity-100 transition-opacity'
      : 'h-[60%] md:h-[65%] lg:h-[70%] w-auto object-contain opacity-80 hover:opacity-100 transition-opacity'
  } else if (isOutlookMain || isOutlookAlt) {
    imageClassName = compact
      ? 'h-[78%] md:h-[75%] lg:h-[80%] w-auto object-contain opacity-80 hover:opacity-100 transition-opacity'
      : 'h-[70%] md:h-[75%] lg:h-[80%] w-auto object-contain opacity-80 hover:opacity-100 transition-opacity'
  }

  if (isBusinessStandard) {
    imageClassName = compact
      ? 'h-[125%] md:h-[115%] lg:h-[120%] w-auto object-contain opacity-80 hover:opacity-100 transition-opacity'
      : 'h-[110%] md:h-[115%] lg:h-[120%] w-auto object-contain opacity-80 hover:opacity-100 transition-opacity'
  }

  const heightClass = compact
    ? 'h-8 sm:h-7 md:h-8 lg:h-9'
    : 'h-7 md:h-8 lg:h-9'

  return (
    <div className={`${heightClass} w-auto flex items-center flex-shrink-0`}>
      <Image
        src={src}
        alt={alt}
        width={compact ? 140 : 200}
        height={compact ? 40 : 56}
        className={imageClassName}
      />
    </div>
  )
}

function MarqueeTrack({
  gapClass,
  compact,
}: {
  gapClass: string
  compact?: boolean
}) {
  return (
    <div className={`flex items-center ${gapClass} animate-marquee whitespace-nowrap min-w-max`}>
      {[...Array(2)].map((_, loopIndex) => (
        <div key={loopIndex} className={`flex items-center flex-shrink-0 ${gapClass}`}>
          {PRESS_LOGOS.map((logo, index) => (
            <PressLogoImage
              key={`${loopIndex}-${index}`}
              src={logo.src}
              alt={logo.alt}
              compact={compact}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

type FeaturedOnMarqueeProps = {
  /** Full-width homepage section vs compact strip above product title */
  variant?: 'section' | 'compact'
}

export default function FeaturedOnMarquee({ variant = 'section' }: FeaturedOnMarqueeProps) {
  if (variant === 'compact') {
    return (
      <div
        className="mb-4 md:mb-4 max-md:relative max-md:left-1/2 max-md:w-screen max-md:max-w-[100vw] max-md:-translate-x-1/2 md:w-full md:left-auto md:translate-x-0"
      >
        <div className="w-full bg-white overflow-hidden pt-2 pb-2.5 md:pt-2.5 md:pb-3.5 rounded-none px-4 sm:px-6 md:px-4">
          <p className="text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-[#102333]/60 mb-2 md:mb-2.5 px-0.5">
            Featured on
          </p>
          <div className="overflow-hidden w-full">
            <MarqueeTrack gapClass="gap-7 md:gap-12" compact />
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="w-full bg-[#F5F3EF] py-6 md:py-8 overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-[#102333]/70 mb-4 md:mb-6">
          Featured on
        </p>
        <div className="overflow-hidden">
          <MarqueeTrack gapClass="gap-10 md:gap-16 lg:gap-20" />
        </div>
      </div>
    </section>
  )
}
