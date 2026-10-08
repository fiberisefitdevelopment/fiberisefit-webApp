'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useScrollAnimation } from '../../../hooks/useScrollAnimation'

const CTASection = () => {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section ref={ref} className="pt-4 pb-12 lg:py-16 bg-gradient-to-br from-amber-50/50 via-white to-green-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`relative bg-white rounded-3xl p-12 lg:p-20 shadow-sm border border-gray-100 overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-green-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative text-center max-w-3xl mx-auto">
            <span className="inline-block text-sm font-medium text-amber-600 uppercase tracking-wider mb-4">
              Start Your Journey
            </span>
            <h2 className="text-4xl lg:text-5xl font-light text-charcoal leading-[1.3] mb-8">
              Ready to Transform Your Metabolic Health?
            </h2>
            <p className="text-lg text-charcoal/60 leading-[1.9] mb-12">
              Join thousands who have discovered the science-backed approach to sustainable wellness.
              FYBER works with your body's natural systems for lasting results.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#products"
                className="group px-8 py-4 bg-charcoal text-white text-sm font-medium rounded-none hover:bg-charcoal/90 transition-all duration-200 flex items-center gap-2 w-fit"
              >
                Get Started Today
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection;
