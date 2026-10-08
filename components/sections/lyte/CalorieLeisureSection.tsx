'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const features = [
  {
    title: 'Effortless Energy Balance',
    description: 'Calories stay aligned quietly in the background.',
  },
  {
    title: 'Biology-Based Burn',
    description: 'Energy burn is driven by recovery state, stress response, oxygen efficiency, and heart variability. Not step-count guesses.',
  },
  {
    title: 'Adaptive Intake',
    description: 'Training days fuel higher. Rest days balance naturally. No manual planning.',
  },
  {
    title: 'Stress-Free Progress',
    description: 'Support fat loss or muscle gain without mental pressure.',
  },
]

export default function CalorieLeisureSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1])

  return (
    <section ref={sectionRef} className="py-32 bg-black text-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto pl-8 pr-8 sm:pl-8 sm:pr-10 lg:pl-12 lg:pr-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight mb-6 tracking-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            <span className="block text-white">YOUR BODY'S ENERGY,</span>
            <span className="block text-white mt-4 md:mt-6">DECODED.</span>
          </h2>
          <p className="text-l text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            Most systems count calories. LYTE understands them. By tracking energy intake and expenditure, it reveals how your body converts effort into muscle, stores fat, releases water, or recovers silently. You don't chase numbers. You live.
          </p>
        </motion.div>

        {/* Inverted two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content + 4 feature pointers - appears second on mobile, right on desktop */}
          <div className="space-y-6 order-2 lg:order-2">
            {/* Feature pointers - minimal bullet design */}
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.3 + index * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="group relative"
              >
                <div className="flex gap-6 items-start">
                  {/* Minimal bullet indicator */}
                  <div className="flex-shrink-0 pt-1">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.4 + index * 0.1,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white/60 transition-colors duration-300"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-medium text-white font-sans leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                {/* Subtle divider line (except last) */}
                {index < features.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.5 + index * 0.1,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="mt-6 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Right: Calm energy flow visualization - appears first on mobile, left on desktop */}
          <motion.div
            style={{ scale }}
            className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden order-1 lg:order-1"
          >
            {/* Base gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-indigo-900/20" />
            
            {/* Energy flow visualization */}
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <div className="relative w-full h-full flex items-end justify-center gap-3">
                {/* Vertical energy bars with breathing animation */}
                {Array.from({ length: 12 }).map((_, i) => {
                  // Deterministic heights and durations for smooth animation
                  const peakHeight = 30 + (i % 5) * 8
                  const duration = 3 + (i % 3) * 0.5
                  return (
                    <motion.div
                      key={i}
                      initial={{ height: '20%' }}
                      animate={{ 
                        height: ['20%', `${peakHeight}%`, '20%'],
                      }}
                      transition={{
                        duration,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.1,
                      }}
                      className="flex-1 bg-gradient-to-t from-blue-500/40 via-indigo-400/30 to-transparent rounded-t-lg backdrop-blur-sm border border-white/10"
                      style={{
                        minWidth: '8px',
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)',
                      }}
                    />
                  )
                })}
              </div>
            </div>

            {/* Soft waveform overlay */}
            <svg 
              className="absolute inset-0 w-full h-full opacity-20" 
              viewBox="0 0 400 400"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M 0 200 Q 100 150, 200 180 T 400 170"
                stroke="rgba(99, 102, 241, 0.3)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              />
              <motion.path
                d="M 0 220 Q 100 170, 200 200 T 400 190"
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.5 }}
              />
            </svg>

            {/* Subtle glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
