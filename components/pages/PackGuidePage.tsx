import Image from 'next/image'
import Link from 'next/link'
import {
  BENEFITS,
  BENEFIT_DIAGRAMS,
  HOW_TO_USE_STEPS,
  OUTCOMES,
  SKU_RECS,
  SKU_WHEN,
} from '@/lib/pack-guide'

const NAV = [
  { href: '#how-to-use', label: 'How to use' },
  { href: '#benefits', label: 'Benefits' },
  { href: '#results', label: 'What you can achieve' },
  { href: '#packs', label: 'Which pack' },
]

export default function PackGuidePage() {
  return (
    <div className="bg-[#faf8f3] text-[#1a1a1a]">
      <section className="pt-24 md:pt-28 pb-8 md:pb-12">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-8 md:mb-10">
            <p className="text-xs uppercase tracking-[0.28em] text-[#868B7A] mb-4">Your pack guide</p>
            <h1
              className="text-4xl md:text-6xl font-medium leading-[1.15] mb-5"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              How to use FYBER
            </h1>
            <p className="text-base md:text-lg text-[#5c5c5c] leading-relaxed max-w-2xl mx-auto">
              Mix. Drink. Let fullness arrive. This is the ritual, the benefits, the timeline of
              change, and the pack that matches where you are.
            </p>
          </div>
          <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[1.5rem] bg-[#f3eee6]">
            <div className="relative aspect-[4/5]">
              <Image
                src="/how to use mobile.png"
                alt="Pour one FYBER sachet into a glass of water"
                fill
                priority
                className="object-cover object-[42%_70%]"
                sizes="420px"
              />
            </div>
          </div>
        </div>
      </section>

      <nav className="sticky top-[76px] md:top-[84px] z-30 bg-[#faf8f3]/95 backdrop-blur-md border-y border-[#e8e4dc]">
        <div className="max-w-4xl mx-auto px-4">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 justify-center py-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[11px] md:text-xs uppercase tracking-[0.18em] text-[#5c5c5c] hover:text-[#1a1a1a]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <section id="how-to-use" className="px-5 py-16 md:py-24 scroll-mt-40">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10 md:mb-14 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-[#868B7A] mb-3">The ritual</p>
            <h2
              className="text-3xl md:text-5xl font-medium mb-4"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              How to take FYBER
            </h2>
            <p className="text-sm md:text-base text-[#5c5c5c] leading-relaxed">
              One sachet, enough water, before your heaviest meal. That is the whole method.
            </p>
          </header>
          <div className="mb-8 md:mb-10 overflow-hidden rounded-2xl border border-[#e8e4dc] bg-[#f3eee6]">
            <Image
              src="/specialOfferCarousel/A_30Days_-06.webp"
              alt="How to use FYBER: one sachet, 200 ml water, drink 30–60 minutes before a meal"
              width={1200}
              height={1200}
              className="block w-full h-auto"
            />
          </div>
          <ol className="grid md:grid-cols-2 gap-5 md:gap-6">
            {HOW_TO_USE_STEPS.map((item) => (
              <li key={item.step} className="bg-white border border-[#e8e4dc] rounded-2xl overflow-hidden">
                <div
                  className={`relative bg-[#f3eee6] ${
                    item.step === '02' || item.step === '03' ? 'aspect-[4/5]' : 'aspect-square'
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className={
                      item.step === '02'
                        ? 'object-cover object-[42%_68%]'
                        : item.step === '03'
                          ? 'object-cover object-[50%_92%]'
                          : 'object-cover object-center'
                    }
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <span className="text-xs tracking-[0.2em] text-[#868B7A]">{item.step}</span>
                  <h3 className="mt-3 text-xl font-medium">{item.title}</h3>
                  <p className="mt-3 text-sm text-[#5c5c5c] leading-relaxed">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-xs text-[#6b6b6b] leading-relaxed max-w-2xl">
            If you are pregnant, breastfeeding, or under treatment for a medical condition, speak
            with your doctor before starting. Always take FYBER with enough water.
          </p>
        </div>
      </section>

      <section id="benefits" className="px-5 py-16 md:py-24 bg-white scroll-mt-40">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 md:mb-12 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-[#868B7A] mb-3">Why it works</p>
            <h2
              className="text-3xl md:text-5xl font-medium mb-4"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              Benefits of using FYBER
            </h2>
            <p className="text-sm md:text-base text-[#5c5c5c] leading-relaxed">
              LEAN-X® combines soluble prebiotic fibre, a targeted probiotic, L-Carnitine L-Tartrate
              and L-Tyrosine — so appetite, gut, and energy are addressed together.
            </p>
          </header>

          <div className="space-y-5 mb-8 md:mb-12">
            {BENEFIT_DIAGRAMS.map((diagram) => (
              <div
                key={diagram.src}
                className="overflow-hidden rounded-2xl border border-[#e8e4dc] bg-[#faf8f3]"
              >
                <Image
                  src={diagram.src}
                  alt={diagram.alt}
                  width={diagram.width}
                  height={diagram.height}
                  className="block w-full h-auto"
                />
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {BENEFITS.map((item) => (
              <article key={item.title} className="border border-[#e8e4dc] rounded-2xl overflow-hidden bg-[#faf8f3]">
                <div className="relative aspect-[4/3] bg-white">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className={item.fit === 'contain' ? 'object-contain p-4' : 'object-cover'}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="text-lg font-medium mb-3">{item.title}</h3>
                  <p className="text-sm text-[#5c5c5c] leading-relaxed">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="results" className="px-5 py-16 md:py-24 scroll-mt-40">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 md:mb-12 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-[#868B7A] mb-3">The timeline</p>
            <h2
              className="text-3xl md:text-5xl font-medium mb-4"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              What people can achieve
            </h2>
            <p className="text-sm md:text-base text-[#5c5c5c] leading-relaxed">
              Noticeable fullness in 30 minutes. A more refined body across 90 days — if the sachet
              is taken daily, with water, before the main meal.
            </p>
          </header>

          <div className="mb-8 md:mb-10">
            <Image
              src="/timeline mobile.png"
              alt="Measurable results from day 1: 60 minutes, 24 hours, 7 days, 30 days"
              width={800}
              height={600}
              className="w-full h-auto rounded-2xl md:hidden"
            />
            <Image
              src="/timeline-desktoppng.png"
              alt="Measurable results from day 1: 60 minutes, 24 hours, 7 days, 30 days"
              width={1200}
              height={500}
              className="w-full h-auto rounded-2xl hidden md:block"
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#e8e4dc] bg-white mb-10 md:mb-14">
            <Image
              src="/product page routine images/FIBERISE A+-11.png"
              alt="From first sip to long-term shift: 30 minutes, 7 days, 30 days, 90 days"
              width={1600}
              height={900}
              className="block w-full h-auto"
            />
          </div>

          <div className="space-y-0 border-t border-[#ddd8ce]">
            {OUTCOMES.map((item) => (
              <article
                key={item.when}
                className="grid md:grid-cols-[160px_1fr] gap-2 md:gap-8 py-6 md:py-8 border-b border-[#ddd8ce]"
              >
                <p className="text-sm tracking-[0.12em] uppercase text-[#868B7A] pt-1">{item.when}</p>
                <div>
                  <h3 className="text-xl md:text-2xl font-medium mb-2">{item.title}</h3>
                  <p className="text-sm md:text-base text-[#5c5c5c] leading-relaxed">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="packs" className="px-5 py-16 md:py-24 bg-white scroll-mt-40">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10 md:mb-14 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-[#868B7A] mb-3">Recommended options</p>
            <h2
              className="text-3xl md:text-5xl font-medium mb-4"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              Which SKU, and when
            </h2>
            <p className="text-sm md:text-base text-[#5c5c5c] leading-relaxed">
              Across 4,665 orders, the 30-day Transformation Pack is the SKU people choose when they
              want results they can feel. Ultimate covers the full 90-day arc. Elite is for staying
              on it.
            </p>
          </header>

          <div className="overflow-x-auto mb-10 border border-[#e8e4dc] rounded-2xl">
            <table className="w-full text-left text-sm min-w-[520px]">
              <thead className="bg-[#faf8f3] text-[11px] uppercase tracking-[0.16em] text-[#6b6b6b]">
                <tr>
                  <th className="px-4 py-3 font-medium">If this is you</th>
                  <th className="px-4 py-3 font-medium">Recommended SKU</th>
                </tr>
              </thead>
              <tbody>
                {SKU_WHEN.map((row) => (
                  <tr key={row.situation} className="border-t border-[#e8e4dc]">
                    <td className="px-4 py-3.5 text-[#1a1a1a]">{row.situation}</td>
                    <td className="px-4 py-3.5 text-[#5c5c5c]">{row.sku}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {SKU_RECS.map((pack) => (
              <article
                key={pack.handle}
                className="flex flex-col border border-[#e8e4dc] rounded-2xl overflow-hidden bg-[#faf8f3]"
              >
                <Link href={`/products/${pack.handle}`} className="relative block aspect-[16/10] bg-[#0b1c2c]">
                  <Image
                    src={pack.image}
                    alt={pack.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#868B7A] mb-3">{pack.badge}</p>
                  <h3 className="text-xl font-medium">{pack.name}</h3>
                  <p className="text-xs text-[#6b6b6b] mt-1">{pack.duration}</p>
                  <p className="mt-3 text-lg">
                    <span className="font-medium">{pack.price}</span>{' '}
                    <span className="text-sm text-[#9a9a9a] line-through">{pack.compare}</span>
                  </p>
                  <p className="mt-4 text-sm text-[#5c5c5c] leading-relaxed">{pack.when}</p>
                  <p className="mt-3 text-xs text-[#6b6b6b] leading-relaxed">{pack.why}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[#1a1a1a]">{pack.bestFor}</p>
                  <Link
                    href={`/products/${pack.handle}`}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-[#1a1a1a] text-white text-xs uppercase tracking-[0.16em] py-3 px-4 hover:bg-black"
                  >
                    Continue with {pack.name.replace(' Pack', '')}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 md:py-16 border-t border-[#e8e4dc]">
        <p className="max-w-3xl mx-auto text-center text-xs text-[#8a8a8a] leading-relaxed">
          FYBER is a dietary fibre supplement, not a medicine. Results vary. Use as directed, with
          adequate water. This guide is for people who already have a FYBER pack.
        </p>
      </section>
    </div>
  )
}
