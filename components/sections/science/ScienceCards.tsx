'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, TrendingDown, Activity, Microscope } from 'lucide-react'

const scienceCards = [
  {
    id: 'cravings',
    icon: Brain,
    title: 'Cravings Controlled',
    shortDescription: 'Natural appetite regulation through gut-brain signaling.',
    fullDescription: 'FYBER ferments into SCFAs (propionate, butyrate) that trigger GLP-1 and PYY release, naturally reducing appetite and improving insulin response—no willpower required.',
    visualFlow: 'Gut → Bacteria → SCFA → Hormones',
    color: 'from-blue-500/10 to-purple-500/10',
  },
  {
    id: 'glucose',
    icon: TrendingDown,
    title: 'Controls Glucose Spikes',
    shortDescription: 'Delayed absorption prevents energy crashes.',
    fullDescription: 'FYBER forms a soluble fiber network that delays glucose absorption, preventing insulin spikes and energy crashes.',
    visualFlow: 'Fiber Network → Delayed Absorption → Stable Glucose',
    color: 'from-green-500/10 to-emerald-500/10',
  },
  {
    id: 'metabolism',
    icon: Activity,
    title: 'Keeps Metabolism in Full Drive',
    shortDescription: 'Preserves leptin signaling for sustained fat mobilization.',
    fullDescription: 'FYBER preserves leptin signaling, preventing starvation-mode metabolism shutdown while supporting fat mobilization.',
    visualFlow: 'Brain ↔ Metabolism → Stable Energy → Fat Mobilization',
    color: 'from-orange-500/10 to-red-500/10',
  },
  {
    id: 'scfa',
    icon: Microscope,
    title: 'Improves SCFA Production',
    shortDescription: 'Enhanced microbiome fermentation for metabolic efficiency.',
    fullDescription: 'SCFAs enhance insulin sensitivity, gut barrier strength, inflammation control, and metabolic efficiency.',
    visualFlow: 'Colon Microbiome → SCFA Production → Metabolic Efficiency',
    color: 'from-indigo-500/10 to-blue-500/10',
  },
]

export default function ScienceCards() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {scienceCards.map((card, index) => {
            const Icon = card.icon
            const isExpanded = expandedCard === card.id

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative"
              >
                <div
                  className={`relative bg-white/60 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden ${
                    isExpanded ? 'shadow-xl' : ''
                  }`}
                  onClick={() => setExpandedCard(isExpanded ? null : card.id)}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100/50 flex items-center justify-center group-hover:bg-white/80 transition-colors duration-500">
                        <Icon className="w-8 h-8 text-gray-700" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-light text-[#1a1a1a] mb-3">
                      {card.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-sm text-gray-600 mb-4 font-light leading-relaxed">
                      {card.shortDescription}
                    </p>

                    {/* Visual Flow Indicator */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">
                        Mechanism
                      </div>
                      <div className="text-sm text-gray-700 font-mono">
                        {card.visualFlow}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 border-t border-gray-200/50 mt-4">
                            <p className="text-sm text-gray-700 leading-relaxed font-light">
                              {card.fullDescription}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Expand Indicator */}
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                      <span>{isExpanded ? 'Click to collapse' : 'Click to expand'}</span>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        ↓
                      </motion.span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
