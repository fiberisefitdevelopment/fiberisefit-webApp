const BENEFITS = [
  {
    title: 'Craving control',
    body: 'Soluble fibre forms a gentle gel and supports natural GLP-1 satiety, so hunger quiets without stimulants.',
  },
  {
    title: 'Natural portion control',
    body: 'Fullness arrives before the plate is empty, which makes snacking and late-night cravings easier to skip.',
  },
  {
    title: 'Fat metabolism support',
    body: 'LEAN-X® is built around delayed emptying and metabolic signalling, not harsh appetite suppressants.',
  },
  {
    title: 'Safe for daily use',
    body: 'Food-based fibres and researched nutrients. No artificial stimulants. Take it with enough water, every day.',
  },
] as const

const HOW_TO_USE = [
  {
    kicker: 'Mix',
    title: 'One sachet in water',
    detail: 'Stir into 200–300 ml of room-temperature water until dissolved.',
    icon: 'mix',
  },
  {
    kicker: 'Wait',
    title: '60 minutes before meals',
    detail: 'Drink it 30–60 minutes before lunch or dinner, then follow with more water.',
    icon: 'wait',
  },
  {
    kicker: 'Repeat',
    title: '1–2 times daily',
    detail: 'Stay consistent. Weight management has never been this easy.',
    icon: 'repeat',
  },
] as const

function HowToIcon({ name }: { name: (typeof HOW_TO_USE)[number]['icon'] }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'h-6 w-6',
    'aria-hidden': true,
  }
  if (name === 'mix') {
    return (
      <svg {...common}>
        <path d="M7 3.5h10l-1.4 15.2a2.2 2.2 0 0 1-2.18 1.9H10.58a2.2 2.2 0 0 1-2.18-1.9L7 3.5Z" />
        <path d="M7 3.5h10" />
        <path d="M8.15 11.2c1.5-1.1 2.7 1.1 3.85 0 1.15-1.1 2.4 1.1 3.85 0" />
      </svg>
    )
  }
  if (name === 'wait') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M4 12a8 8 0 0 1 13.5-5.8L20 8" />
      <path d="M20 4v4h-4" />
      <path d="M20 12a8 8 0 0 1-13.5 5.8L4 16" />
      <path d="M4 20v-4h4" />
    </svg>
  )
}

const DIFFERENCE = [
  { fyber: 'Visible results in 60 minutes', other: 'Results in 30 days' },
  { fyber: 'Immediate craving control', other: 'No craving control' },
  { fyber: 'Patented formulation', other: 'Just centuries-old fibre' },
  { fyber: 'Weight loss and gut health', other: 'Focused on gut health only' },
] as const

export default function OfferBenefitsSection() {
  return (
    <div className="bg-[#faf8f5]">
      <section className="w-full bg-white py-10 md:py-12" aria-labelledby="offer-benefits-heading">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-500">Why FYBER works</p>
          <h2
            id="offer-benefits-heading"
            className="mt-1 text-center text-2xl font-bold uppercase tracking-wide text-black md:text-3xl"
          >
            Benefits
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {BENEFITS.map((item, index) => (
              <article
                key={item.title}
                className="relative overflow-hidden rounded-2xl border border-[#187254]/12 bg-white px-5 py-4 pl-6 shadow-[0_8px_24px_rgba(24,114,84,0.06)]"
              >
                <span className="absolute inset-y-0 left-0 w-1.5 bg-[#187254]" aria-hidden />
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#187254] text-[10px] font-bold text-white"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="min-w-0 text-sm font-semibold uppercase leading-none tracking-[0.1em] text-[#187254]">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-to-use-fyber"
        className="w-full scroll-mt-28 bg-[#f3efe6] py-10 md:py-12"
        aria-labelledby="offer-howto-heading"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-500">Simple routine</p>
          <h2
            id="offer-howto-heading"
            className="mt-1 text-center text-2xl font-bold uppercase tracking-wide text-black md:text-3xl"
          >
            How to Use FYBER
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-sm text-gray-600">
            Weight management has never been this easy.
          </p>
          <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {HOW_TO_USE.map((step, index) => (
              <li
                key={step.title}
                className="flex flex-col items-center rounded-2xl border border-[#187254]/12 bg-white px-5 py-5 text-center shadow-[0_8px_24px_rgba(24,114,84,0.06)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#187254] text-white">
                  <HowToIcon name={step.icon} />
                </div>
                <p className="mt-3 text-sm font-extrabold uppercase tracking-[0.12em] text-[#187254]">
                  Step {index + 1} · {step.kicker}
                </p>
                <h3 className="mt-1 text-base font-bold leading-snug tracking-tight text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{step.detail}</p>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-6 w-fit rounded-full bg-[#187254] px-6 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-white">
            That&apos;s the whole ritual
          </p>
        </div>
      </section>

      <section className="w-full bg-white py-10 md:py-12" aria-labelledby="offer-difference-heading">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-500">
            Rethinking Fibre. Redefining Wellness
          </p>
          <h2
            id="offer-difference-heading"
            className="mt-1 text-center text-2xl font-bold uppercase tracking-wide text-black md:text-3xl"
          >
            Other fiber can&apos;t do this
          </h2>
          <div className="relative mx-auto mt-10 max-w-3xl overflow-hidden rounded-[28px] border border-[#187254]/20 bg-white shadow-[0_24px_60px_rgba(24,114,84,0.12)]">
            <div className="grid grid-cols-2">
              <div className="bg-[#187254] px-4 py-6 text-center sm:px-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white sm:text-xs">
                  FYBER
                </p>
              </div>
              <div className="bg-[#efe8dc] px-4 py-6 text-center sm:px-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8b3a2f] sm:text-xs">
                  Other fibre
                  <span className="hidden sm:inline"> products</span>
                </p>
              </div>
            </div>
            <span
              className="absolute left-1/2 top-[22px] z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-white/70 bg-white text-[10px] font-bold tracking-[0.12em] text-[#187254] shadow-md"
              aria-hidden
            >
              VS
            </span>
            {DIFFERENCE.map((row, index) => (
              <div
                key={row.fyber}
                className={`grid grid-cols-2 ${index === 0 ? '' : 'border-t border-[#187254]/10'}`}
              >
                <div className="flex items-start gap-3 bg-[#f3faf6] px-3 py-5 sm:items-center sm:px-6">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#187254] text-[11px] font-bold text-white sm:mt-0"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <p className="text-[13px] font-semibold leading-snug text-[#187254] sm:text-sm">
                    {row.fyber}
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-[#faf8f5] px-3 py-5 sm:items-center sm:px-6">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8ddd0] text-[11px] font-bold text-[#8b3a2f] sm:mt-0"
                    aria-hidden
                  >
                    ×
                  </span>
                  <p className="text-[13px] leading-snug text-stone-500 sm:text-sm">{row.other}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
