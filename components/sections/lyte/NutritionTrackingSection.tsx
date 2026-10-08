'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

const features = [
  {
    title: 'Complete Macro & Micro Intelligence',
    description: 'Track calories, protein, carbs, fats, and essential micronutrients with clinical clarity — without complexity.',
  },
  {
    title: 'Any Portion. Any Format.',
    description: 'Log food your way: grams, cups, spoons, slices, servings, or everyday portions. Precision adapts to you.',
  },
  {
    title: 'Two Million Foods. Instantly Recognised.',
    description: 'A global, continuously updated food database ensures accuracy across cuisines, brands, and home-cooked meals.',
  },
  {
    title: 'Metabolic Context, Not Just Numbers',
    description: 'See how each meal influences energy levels, fat storage, muscle recovery, and metabolic balance — in real time.',
  },
  {
    title: 'Designed for Real Life',
    description: 'From restaurant plates to home kitchens, nutrition adapts — not the other way around.',
  },
]

export default function NutritionTrackingSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -50])

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
            <span className="block text-white">NUTRITION, UNDERSTOOD.</span>
            
          </h2>
          <p className="text-l text-gray-400 max-w-2xl mx-auto font-light">
            Not counting meals. Understanding how food becomes energy, recovery, and change.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Nutrition image */}
          <motion.div
            style={{ y: parallaxY }}
            className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden pl-8 sm:pl-0 sm:-ml-6 lg:-ml-8"
          >
            <Image
              src="/lyte_images/5fbc73b5-697b-4f21-8d48-da8a747a1a97.png"
              alt="Fiberise Fit - Nutrition Tracking"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Right: Text content + 5 feature pointers */}
          <div className="space-y-6">
            {/* Feature pointers - minimal bullet design */}
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
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
        </div>
      </div>
    </section>
  )
}
