export default function IntroTextSection() {
  return (
    <section className="py-20 md:py-28 bg-fyber-ivory-dream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Lockup */}
        <div className="text-center mb-8">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight mb-2"
          >
            <span className="text-fyber-midnight-obsidian">Fiberise</span>{' '}
            <span className="text-fyber-emerald-forest">Fyber</span>
          </h2>
        </div>
        
        {/* Main Message */}
        <p 
          className="text-xl md:text-2xl lg:text-3xl text-center text-fyber-midnight-obsidian leading-relaxed font-normal tracking-tight"
        >
          <span className="text-fyber-emerald-forest font-medium">Fyber</span> delivers daily supplements designed to support{' '}
          <span className="block md:inline">digestion, balance, and overall well-being.</span>
        </p>
        
        {/* Supporting Text */}
        <p 
          className="text-base md:text-lg text-center text-fyber-midnight-obsidian/70 mt-6 leading-relaxed font-normal"
        >
          Clean, digestible, effortless daily wellness.
        </p>
      </div>
    </section>
  )
}

