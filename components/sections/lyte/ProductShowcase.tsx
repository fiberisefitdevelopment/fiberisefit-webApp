'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function ProductShowcase() {
  return (
    <section className="pt-16 md:pt-24 lg:pt-32 pb-16 md:pb-20 bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cinematic spacing with large device render */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight mb-8 tracking-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            <span className="block text-white">SCIENCE YOU</span>
            <span className="block text-white mt-4 md:mt-6">CAN WEAR</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
          Smart insights that help maintain metabolic health and everyday wellbeing.
          </p>
        </motion.div>
      </div>

      {/* Large product image with Apple-style lighting - Full width */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-[400px] md:h-[450px] lg:h-[500px] w-full overflow-hidden bg-gradient-to-br from-gray-900 to-black"
      >
        <Image
          src="/lyte_images/More_portion_of_202601141813.jpeg"
          alt="LYTE Device"
          fill
          className="object-cover"
          style={{ objectPosition: 'center top' }}
          priority
        />
        {/* Apple-style product lighting effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_black/40_100%)]" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Stats grid - Apple style minimal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12 md:mt-16"
        >
          {[
            { value: '24/7', label: 'Continuous Monitoring' },
            { value: '30', label: 'Days Battery Life' },
            { value: '99%', label: 'Accuracy Rate' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl font-light text-white mb-3">{stat.value}</div>
              <div className="text-sm text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
