import dynamic from 'next/dynamic'
import HeroSection from '@/components/sections/HeroSection'
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection'

import type { Metadata } from 'next'
import ReelsSection from '@/components/sections/ReelsSection'

// Below-fold sections — dynamically imported to reduce initial JS bundle
const PressMarqueeSection = dynamic(() => import('@/components/sections/PressMarqueeSection'))
const MeditationImageSection = dynamic(() => import('@/components/sections/MeditationImageSection'))
const VideoSection = dynamic(() => import('@/components/sections/VideoSection'))
const ImageTextSection = dynamic(() => import('@/components/sections/ImageTextSection'))
const JourneySection = dynamic(() => import('@/components/sections/JourneySection'))
const RitualSection = dynamic(() => import('@/components/sections/RitualSection'))
const EnergyResetSection = dynamic(() => import('@/components/sections/EnergyResetSection'))
const EmpoweringSection = dynamic(() => import('@/components/sections/EmpoweringSection'))
const FullWidthVideoSection = dynamic(() => import('@/components/sections/FullWidthVideoSection'))
const TestimonialCarouselSection = dynamic(() => import('@/components/sections/TestimonialCarouselSection'))

export const metadata: Metadata = {
  title: 'Fiber Supplement for Weight Loss | Fat Burner | Ozempic Alternative',
  description:
    "Smart health ecosystem powered by AI & innovation. Fiberise is India's science-backed fiber supplement for weight control. A natural fat burning supplement with prebiotic + probiotic support from trusted by doctors. No stimulants. Free shipping.",
  keywords:
    'ozempic, fat burner, fiber supplement, weight control supplements, weight lose supplement, fat burning supplements',
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
  return (
    <div className="w-full">
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
      <TestimonialCarouselSection />
    </div>
  )
}
