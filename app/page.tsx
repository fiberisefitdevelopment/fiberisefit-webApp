import dynamic from 'next/dynamic'
import HeroSection from '@/components/sections/HeroSection'
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection'
import FAQSection from '@/components/sections/FAQSection'

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

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': 'Fiberise Fit',
  'url': 'https://fiberisefit.com/'
}

const ITEM_LIST_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  'name': 'Featured Products',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Transformation Pack',
      'url': 'https://fiberisefit.com/products/transformation-pack'
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Starter Pack',
      'url': 'https://fiberisefit.com/products/starter-pack'
    },
    {
      '@type': 'ListItem',
      'position': 3,
      'name': 'Ultimate Pack',
      'url': 'https://fiberisefit.com/products/ultimate-pack'
    }
  ]
}

const DOCTOR_RECOMMENDATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Review',
      'author': {
        '@type': 'Physician',
        'name': 'Dr Mohammad Kaukab',
        'affiliation': {
          '@type': 'MedicalOrganization',
          'name': 'Centre for Sight'
        }
      },
      'reviewBody': 'Maintaining energy and focus during calorie restriction can be challenging. The inclusion of L-Carnitine L-Tartrate and L-Tyrosine may help support metabolic efficiency and mental clarity, which often improves dietary adherence.',
      'itemReviewed': {
        '@type': 'WebPage',
        'name': 'Fiberise Fit Homepage',
        'url': 'https://fiberisefit.com/'
      }
    },
    {
      '@type': 'Review',
      'author': {
        '@type': 'Physician',
        'name': 'Dr Deepak Agrawal',
        'affiliation': {
          '@type': 'MedicalOrganization',
          'name': 'AIIMS New Delhi'
        }
      },
      'reviewBody': 'Approaches that support satiety, gut health, and metabolic balance using nutritionally derived ingredients can be valuable adjuncts to lifestyle-based weight management. What differentiates this formulation is that it focuses on the biological drivers of appetite rather than relying on stimulants or harsh appetite suppressants. Supporting satiety through soluble fiber and gut signaling is a safer and more sustainable approach to weight management.',
      'itemReviewed': {
        '@type': 'WebPage',
        'name': 'Fiberise Fit Homepage',
        'url': 'https://fiberisefit.com/'
      }
    },
    {
      '@type': 'Review',
      'author': {
        '@type': 'Physician',
        'name': 'Dr Swati Singh',
        "affiliation": {
          "@type": "Organization",
          "name": "New Delhi"
        }
      },
      'reviewBody': 'Sustainable weight management begins with appetite control. A formulation like FYBER that promotes natural satiety through soluble fiber can help individuals manage portion sizes and cravings more effectively while maintaining a strong safety profile.',
      'itemReviewed': {
        '@type': 'WebPage',
        'name': 'Fiberise Fit Homepage',
        'url': 'https://fiberisefit.com/'
      }
    },
    {
      '@type': 'Review',
      'author': {
        '@type': 'Physician',
        'name': 'Dr Manish Pant',
        "affiliation": {
          "@type": "Organization",
          "name": "UNDP"
        }
      },
      'reviewBody': 'The combination of prebiotic fiber with probiotic support is a thoughtful approach. By supporting gut microbiome balance and SCFA signalling, formulations like FYBER may assist in appetite regulation and metabolic stability safely. Unlike many weight management products that rely on stimulants, FYBER works through natural physiological pathways such as gastric distention and delayed gastric emptying, making it suitable for regular and long-term use without being habit forming.',
      'itemReviewed': {
        '@type': 'WebPage',
        'name': 'Fiberise Fit Homepage',
        'url': 'https://fiberisefit.com/'
      }
    }
  ]
}

export default function Home() {
  return (
    <div className="w-full">
      {/* SEO Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ITEM_LIST_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(DOCTOR_RECOMMENDATION_SCHEMA) }}
      />

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
