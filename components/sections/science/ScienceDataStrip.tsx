'use client'

import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

const dataPoints = [
  {
    label: 'Appetite',
    value: '↓',
    icon: TrendingDown,
    color: 'text-green-600',
    description: 'Reduced',
  },
  {
    label: 'Glucose Spikes',
    value: '↓',
    icon: TrendingDown,
    color: 'text-green-600',
    description: 'Stabilized',
  },
  {
    label: 'Metabolism',
    value: '→',
    icon: Minus,
    color: 'text-blue-600',
    description: 'Steady',
  },
  {
    label: 'Fat Oxidation',
    value: '↑',
    icon: TrendingUp,
    color: 'text-purple-600',
    description: 'Enhanced',
  },
]

export default function ScienceDataStrip() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-[#1a1a1a] mb-4 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Measurable Outcomes
          </h2>
        </motion.div>

        {/* Data Strip */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent transform -translate-y-1/2" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative">
            {dataPoints.map((point, index) => {
              const Icon = point.icon
              return (
                <motion.div
                  key={point.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center relative"
                >
                  {/* Icon Circle */}
                  <div className="relative mb-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm">
                      <Icon className={`w-8 h-8 md:w-10 md:h-10 ${point.color}`} />
                    </div>
                    {/* Value Badge */}
                    <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 ${point.color.includes('green') ? 'border-green-600' : point.color.includes('blue') ? 'border-blue-600' : 'border-purple-600'} flex items-center justify-center shadow-sm`}>
                      <span className={`text-lg font-medium ${point.color}`}>{point.value}</span>
                    </div>
                  </div>

                  {/* Label */}
                  <h3 className="text-lg md:text-xl font-light text-[#1a1a1a] mb-2">
                    {point.label}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 font-light">
                    {point.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
