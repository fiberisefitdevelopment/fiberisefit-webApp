import Image from 'next/image'

export default function MeditationImageSection() {
  return (
    <section className="relative w-full h-[600px] md:h-[800px] lg:h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/Remove_the_clouds_202601061415.png"
          alt="Wellness and yoga - person performing yoga pose with mountains in background"
          fill
          className="object-cover"
          sizes="100vw"
          loading="lazy"
        />
      </div>

      {/* Marquee Text - Centered on Image */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-20 py-4 overflow-hidden">
        <div 
          className="flex whitespace-nowrap" 
          style={{ 
            animation: 'marquee 18s linear infinite',
            willChange: 'transform',
            width: 'max-content'
          }}
        >
          {[...Array(6)].map((_, i) => (
            <span 
              key={i}
              className="inline-block mx-12 text-white text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-normal uppercase tracking-wider flex-shrink-0" 
              style={{ fontFamily: 'QuadratGrotesk, sans-serif' }}
            >
              Designed by Nature<span className="mx-8 md:mx-12 lg:mx-16"> </span>Refined by Science<span className="mx-8 md:mx-12 lg:mx-16"> </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

