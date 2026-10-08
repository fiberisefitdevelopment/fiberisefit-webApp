'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

const comparisonData = [
  {
    feature: 'High Frequency Tracking',
    lyte: true,
    competitor: false,
  },
  {
    feature: 'Nutrition Tracking',
    lyte: true,
    competitor: false,
  },
  {
    feature: 'Battery Life',
    lyte: '30 days',
    competitor: 'Upto 42 hours',
    isText: true,
  },
]

export default function ComparisonSection() {
  return (
    <section className="py-32 bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight mb-8 tracking-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            <span className="block text-white">WHY LYTE</span>
            <span className="block text-white mt-4 md:mt-6">STANDS APART.</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Compare features. See the difference.
          </p>
        </motion.div>

        {/* Clean comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden"
        >
          <div className="grid grid-cols-3 gap-px bg-white/10">
            {/* Header */}
            <div className="bg-white/5 p-6">
              <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">Feature</div>
            </div>
            <div className="bg-white/10 p-6 text-center">
              <div className="text-2xl font-light text-white mb-2">LYTE</div>
            </div>
            <div className="bg-white/5 p-6 text-center">
              <div className="text-2xl font-light text-gray-400 mb-2">Leading Watch</div>
            </div>

            {/* Rows */}
            {comparisonData.map((row, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="contents"
              >
                <div className="bg-white/5 p-6 flex items-center">
                  <span className="text-gray-300 font-light">{row.feature}</span>
                </div>
                <div className="bg-white/10 p-6 flex items-center justify-center">
                  {row.isText ? (
                    <span className="text-white font-light">{row.lyte}</span>
                  ) : row.lyte ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <X className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div className="bg-white/5 p-6 flex items-center justify-center">
                  {row.isText ? (
                    <span className="text-gray-400 font-light">{row.competitor}</span>
                  ) : row.competitor ? (
                    <Check className="w-6 h-6 text-gray-600" />
                  ) : (
                    <X className="w-6 h-6 text-gray-800" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
