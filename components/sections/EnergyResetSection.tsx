'use client'

const doctorReviews = [
  {
    quote:
      'Sustainable weight management begins with appetite control. A formulation like FYBER that promotes natural satiety through soluble fiber can help individuals manage portion sizes and cravings more effectively while maintaining a strong safety profile.',
    name: 'Dr Swati Singh',
    location: 'New Delhi',
  },
  {
    quote:
      'The combination of prebiotic fiber with probiotic support is a thoughtful approach. By supporting gut microbiome balance and SCFA signalling, formulations like FYBER may assist in appetite regulation and metabolic stability safely. Unlike many weight management products that rely on stimulants, FYBER works through natural physiological pathways such as gastric distention and delayed gastric emptying, making it suitable for regular and long-term use without being habit forming.',
    name: 'Dr Manish Pant',
    location: 'UNDP',
  },
  {
    quote:
      'Maintaining energy and focus during calorie restriction can be challenging. The inclusion of L-Carnitine L-Tartrate and L-Tyrosine may help support metabolic efficiency and mental clarity, which often improves dietary adherence.',
    name: 'Dr Mohammad Kaukab',
    location: 'Centre for Sight',
  },
  {
    quote:
      'Approaches that support satiety, gut health, and metabolic balance using nutritionally derived ingredients can be valuable adjuncts to lifestyle-based weight management. What differentiates this formulation is that it focuses on the biological drivers of appetite rather than relying on stimulants or harsh appetite suppressants. Supporting satiety through soluble fiber and gut signaling is a safer and more sustainable approach to weight management.',
    name: 'Dr Deepak Agrawal',
    location: 'AIIMS New Delhi',
  },
]

export default function EnergyResetSection() {
  const duplicatedReviews = [...doctorReviews, ...doctorReviews]

  return (
    <section className="w-full bg-[#f5f3ef] pt-6 pb-12 md:py-28 lg:py-32">
      <div className="max-w-full mx-auto px-0">
        <header className="text-center mb-14 md:mb-16 px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-[#1a1a1a] mb-3 tracking-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Trusted by Doctors 
          </h2>
          <p className="text-base md:text-lg text-[#5c5c5c] max-w-xl mx-auto leading-relaxed">
            Recommended by leading healthcare professionals and wellness experts.
          </p>
        </header>

        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-[#f5f3ef] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-[#f5f3ef] to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden w-full">
            <div className="animate-doctors-marquee flex gap-6 md:gap-8">
              {duplicatedReviews.map((review, index) => (
                <article
                  key={`${index}-${review.name}`}
                  className="flex-shrink-0 w-[320px] md:w-[380px] lg:w-[420px] group relative bg-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300 border border-[#e8e6e2] flex flex-col min-h-[260px]"
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl md:rounded-l-2xl bg-[#1a1a1a]/10 group-hover:bg-[#1a1a1a]/20 transition-colors"
                    aria-hidden
                  />
                  {(review.name || review.location) && (
                    <>
                      <header className="pl-4 md:pl-5 pb-3 text-center">
                        <p className="text-[#1a1a1a] font-semibold text-base md:text-lg tracking-tight">
                          {review.name}
                        </p>
                        {review.location && (
                          <p className="text-[#6b6b6b] text-xs md:text-sm mt-0.5">
                            {review.location}
                          </p>
                        )}
                      </header>
                      <div className="mx-4 md:mx-5 mb-3 h-px bg-[#ebe9e5]" />
                    </>
                  )}
                  <blockquote className="flex-1 pl-4 md:pl-5 mt-1">
                    <p className="text-[#1a1a1a] text-[12px] md:text-base leading-[1.7] font-light text-center">
                      &ldquo;{review.quote}&rdquo;
                    </p>
                  </blockquote>
                </article>  
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
