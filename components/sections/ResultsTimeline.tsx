const STEPS = [
  {
    value: '60',
    unit: 'minutes',
    lines: ['Cravings', 'Disappears'],
    icon: '/icons/timeline/cravings.png',
  },
  {
    value: '24',
    unit: 'hours',
    lines: ['Lighter', 'Mornings'],
    icon: '/icons/timeline/mornings.png',
  },
  {
    value: '7',
    unit: 'days',
    lines: ['Bye Bye', 'Bloating'],
    icon: '/icons/timeline/bloating.png',
  },
  {
    value: '30',
    unit: 'days',
    lines: ['Weight', 'Drops'],
    icon: '/icons/timeline/weight.png',
  },
] as const

export default function ResultsTimeline() {
  return (
    <section
      className="w-full bg-[#187254] px-4 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14"
      aria-label="Measurable results from day 1"
    >
      <h2 className="mb-8 text-center text-[15px] font-medium uppercase tracking-[0.24em] text-white sm:mb-10 sm:text-lg md:text-xl md:tracking-[0.28em]">
        Measurable Results from Day 1
      </h2>
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {STEPS.map((step) => (
          <div key={step.value} className="flex flex-col items-center text-center text-white">
            <p className="text-[36px] font-bold leading-none tracking-tight sm:text-5xl md:text-6xl">
              {step.value}
            </p>
            <p className="mt-1.5 text-[13px] font-light leading-none sm:mt-2 sm:text-lg md:text-xl">
              {step.unit}
            </p>
            <img
              src={step.icon}
              alt=""
              width={48}
              height={48}
              className="mt-4 h-8 w-8 object-contain mix-blend-screen sm:mt-5 sm:h-10 sm:w-10 md:h-12 md:w-12"
              aria-hidden
            />
            <p className="mt-3 text-[11px] font-medium uppercase leading-snug tracking-[0.12em] text-white sm:mt-4 sm:text-sm sm:tracking-[0.16em] md:text-base">
              {step.lines[0]}
              <br />
              {step.lines[1]}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
