'use client'

import { useEffect, Suspense } from 'react'
import HeroSection from '@/components/sections/lyte/HeroSection'
import ProductShowcase from '@/components/sections/lyte/ProductShowcase'
import FeatureSection from '@/components/sections/lyte/FeatureSection'
import AppPreviewSection from '@/components/sections/lyte/AppPreviewSection'
import NutritionTrackingSection from '@/components/sections/lyte/NutritionTrackingSection'
import CalorieLeisureSection from '@/components/sections/lyte/CalorieLeisureSection'
import ComparisonSection from '@/components/sections/lyte/ComparisonSection'

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="bg-red-900/20 border border-red-500 p-8 m-8 rounded-lg">
      <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
      <p className="text-red-300">{error.message}</p>
    </div>
  )
}

export default function LytePage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://fiberisefit.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Lyte",
        "item": "https://fiberisefit.com/lyte"
      }
    ]
  }

  useEffect(() => {
    console.log('LYTE Page: All components should render')

    // Smooth scroll behavior for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="#"]')
      if (link) {
        const href = link.getAttribute('href')
        if (href && href.startsWith('#')) {
          e.preventDefault()
          const id = href.slice(1)
          const element = document.getElementById(id)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)
    return () => document.removeEventListener('click', handleAnchorClick)
  }, [])

  return (
    <div className="bg-black text-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <HeroSection />
      <ProductShowcase />
      <FeatureSection />
      <AppPreviewSection />
      <NutritionTrackingSection />
      <CalorieLeisureSection />
      <ComparisonSection />

      {/* LYTE User Manual download section */}
      <section
        id="lyte-user-manual"
        className="border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_minmax(0,1fr)] items-center">
            {/* Left: copy */}
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-gray-400 mb-3">
                LYTE USER MANUAL
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4">
                Everything you need to know, in one PDF.
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 max-w-xl">
                Learn how to wear your band correctly, pair it with the app, understand every metric, and get the most
                out of LYTE. This step‑by‑step guide covers setup, daily use, charging, and troubleshooting.
              </p>
              <ul className="text-xs sm:text-sm text-gray-400 space-y-1.5 mb-6">
                <li>• Quick start guide for first‑time setup</li>
                <li>• Detailed overview of sensors and features</li>
                <li>• App pairing, data sync, and notification settings</li>
                <li>• Care, warranty, and safety information</li>
              </ul>
              <a
                href="/manual/lyte.pdf?v=2"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-black text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors"
              >
                <span>Download user manual</span>
                <span className="text-[11px] text-gray-700">(PDF)</span>
              </a>
              <p className="mt-3 text-[11px] text-gray-500">
                Opens in a new tab · You can save it for offline reference.
              </p>
            </div>

            {/* Right: QR code for quick download */}
            <div className="w-full flex justify-center lg:justify-end">
              <div className="rounded-2xl border border-white/10 bg-black/40 px-6 py-5 sm:px-8 sm:py-7 flex flex-col items-center gap-3">
                <p className="text-xs text-gray-300 tracking-[0.18em] uppercase mb-1">
                  Scan to download
                </p>
                <div className="bg-white rounded-xl p-3">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=https%3A%2F%2Ffiberisefit.com%2Fmanual%2Flyte.pdf%3Fv%3D2"
                    alt="QR code to download the LYTE user manual"
                    className="h-48 w-48 object-contain"
                  />
                </div>
                <p className="text-[11px] text-gray-400 text-center max-w-[220px]">
                  Point your phone camera at the QR to open and download the LYTE band user manual directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
