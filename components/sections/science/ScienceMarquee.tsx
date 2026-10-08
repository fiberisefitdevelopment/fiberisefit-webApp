'use client'

const scienceTerms = [
  'GLP-1 Activation',
  'PYY Release',
  'SCFA Fermentation',
  'Leptin Sensitivity',
  'Insulin Stability',
  'Gut Barrier Strength',
  'Metabolic Signaling',
]

export default function ScienceMarquee() {
  // Duplicate for seamless loop
  const duplicatedTerms = [...scienceTerms, ...scienceTerms]

  return (
    <section className="py-16 bg-gray-50/50 border-y border-gray-200/30">
      <div className="relative overflow-hidden">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50/50 to-transparent z-10 pointer-events-none" />

        {/* Marquee */}
        <div className="overflow-hidden w-full">
          <div className="animate-science-marquee flex gap-12 md:gap-16">
            {duplicatedTerms.map((term, index) => (
              <div
                key={`term-${index}`}
                className="flex-shrink-0"
              >
                <span className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-400 tracking-tight whitespace-nowrap">
                  {term}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
