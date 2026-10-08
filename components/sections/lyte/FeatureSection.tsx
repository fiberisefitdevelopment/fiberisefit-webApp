'use client'

import { motion } from 'framer-motion'
import { Zap, Moon, Bed, Apple, Heart } from 'lucide-react'

const features = [
  {
    icon: Apple,
    title: 'Nutrition',
    description: 'Track your calorie intake and effortlessly tailor your food for enhanced vitality',
    metric: 'Nutrition Tracking',
    color: 'from-green-500/20 to-green-600/10',
  },
  
  {
    icon: Zap,
    title: 'Calories',
    description: 'See how daily movement impacts calorie use, stamina, and overall body efficiency.',
    metric: 'Calories Tracking',
    color: 'from-orange-500/20 to-orange-600/10',
  },
  {
    icon: Bed,
    title: 'Sleep',
    description: 'Understand how your body is recovering to ensure you get the best version of yourself everyday.',
    metric: 'Sleep Tracking',
    color: 'from-purple-500/20 to-purple-600/10',
  },
  {
    icon: Heart,
    title: 'SpO2',
    description: 'Helps you understand how efficiently your body uses oxygen.',
    metric: 'Blood Oxygen Tracking',
    color: 'from-red-500/20 to-red-600/10',
  },
]

export default function FeatureSection() {
  return (
    <section id="features" className="py-32 bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-24"
        >
          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight mb-8 tracking-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            <span className="block text-white">FOUR PILLARS.</span>
            <span className="block text-white mt-4 md:mt-6">ONE SYSTEM.</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Comprehensive health monitoring across every dimension of performance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="mb-6 md:mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500 md:mb-0 mb-0 md:block hidden">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">{feature.metric}</div>
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-3xl font-light text-white flex-1">
                        {feature.title === 'SpO2' ? (
                          <>SpO<sub>2</sub></>
                        ) : (
                          feature.title
                        )}
                      </h3>
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500 md:hidden flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 leading-relaxed font-light">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
