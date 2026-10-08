'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const appImages = [
  {
    src: '/lyte_images/sleep 3.png',
    alt: 'Your analytics INSIGHTS - Sleep',
  },
  {
    src: '/lyte_images/dashboard 3.png',
    alt: 'Your analytics INSIGHTS - Calories',
  },
  {
    src: '/lyte_images/Nutrition 2.png',
    alt: 'Your analytics INSIGHTS - Weekly Average',
  },
]

export default function AppPreviewSection() {

  return (
    <section className="pt-16 md:pt-20 pb-32 bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight mb-8 tracking-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            <span className="block text-white">YOUR DATA.</span>
            <span className="block text-white mt-4 md:mt-6">YOUR INSIGHTS.</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Beautiful, intuitive interface. Powerful analytics. All in the palm of your hand.
          </p>
        </motion.div>

        {/* Three images horizontally aligned */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {appImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
              className={`relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden ${
                index === 1 ? 'md:scale-105 z-10' : ''
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain"
                priority={index === 1}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
