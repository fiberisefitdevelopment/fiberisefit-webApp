'use client'

import Image from 'next/image'

export default function RitualSection() {
  return (
    <section className="w-full relative bg-[#f6f2ec] overflow-hidden">
      {/* Mobile view */}
      <div className="relative w-full h-[95vh] md:hidden">
        <Image
          src="/Frame_626636.webp"
          alt="Ritual - Simple ritual. Powerful change."
          fill
          className="object-cover object-center"
          sizes="100vw"
          loading="lazy"
        />
      </div>
      {/* Desktop view */}
      <div className="relative w-full min-h-[70vh] hidden md:block">
        <Image
          src="/Group_64939.webp"
          alt="Ritual - Simple ritual. Powerful change."
          fill
          className="object-cover object-center"
          sizes="100vw"
          loading="lazy"
        />
      </div>
    </section>
  )
}
