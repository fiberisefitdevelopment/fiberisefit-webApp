'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const trustBadges = [
  'Clinically studied ingredients',
  'Fermentation-validated fibers',
  'Hormone-based appetite modulation',
]

export default function ScienceTrustBar() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50/50 border-t border-gray-200/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-lg md:text-xl text-gray-700 font-light mb-8">
            Backed by metabolic science & gut microbiome research
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm md:text-base text-gray-700 font-light">{badge}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
