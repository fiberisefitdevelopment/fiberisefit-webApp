import dynamic from 'next/dynamic'
import HeroSection from '@/components/sections/HeroSection'
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection'
import FAQSection from '@/components/sections/FAQSection'
import { HOMEPAGE_SCHEMAS } from '@/lib/homepage-schema'

import type { Metadata } from 'next'

// Below-fold sections — dynamically imported to reduce initial JS bundle
const ReelsSection = dynamic(() => import('@/components/sections/ReelsSection'))
const PressMarqueeSection = dynamic(() => import('@/components/sections/PressMarqueeSection'))
const MeditationImageSection = dynamic(() => import('@/components/sections/MeditationImageSection'))
const VideoSection = dynamic(() => import('@/components/sections/VideoSection'))
const ImageTextSection = dynamic(() => import('@/components/sections/ImageTextSection'))
const JourneySection = dynamic(() => import('@/components/sections/JourneySection'))
const RitualSection = dynamic(() => import('@/components/sections/RitualSection'))
const EnergyResetSection = dynamic(() => import('@/components/sections/EnergyResetSection'))
const EmpoweringSection = dynamic(() => import('@/components/sections/EmpoweringSection'))
const FullWidthVideoSection = dynamic(() => import('@/components/sections/FullWidthVideoSection'))

export const metadata: Metadata = {
  title: 'FYBER | Science-Backed Appetite Control & Weight Management Supplement',
  description:
    'Discover FYBER by Fiberise Fit, a science-backed fiber supplement designed for appetite control, gut health, craving reduction, and sustainable weight management.',
  keywords:
    'ozempic, fat burner, fiber supplement, weight control supplements, weight lose supplement, fat burning supplements',
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
  return (
    <div className="w-full">
      {HOMEPAGE_SCHEMAS.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Above-the-fold — statically imported for fast LCP */}
      <HeroSection />
      <FeaturedProductsSection />
      {/* Below-the-fold — dynamically imported, zero initial JS cost */}
      <PressMarqueeSection />
      <ReelsSection />
      <MeditationImageSection />
      <VideoSection />
      {/* <ProductShowcaseSection /> */}
      <ImageTextSection />
      <JourneySection />
      <RitualSection />
      <EnergyResetSection />
      <EmpoweringSection />
      <FullWidthVideoSection />
      <FAQSection />
    </div>
  )
}
