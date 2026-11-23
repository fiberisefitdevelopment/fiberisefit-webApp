const STEPS = [
  {
    title: 'Try it for 7 days',
    icon: '/icons/moneyback/sachet.png',
    body: 'Start with the FYBER 7 day trial pack.',
  },
  {
    title: 'Feel the difference',
    icon: '/icons/moneyback/difference.png',
    body: 'You notice better craving control and reduced bloating.',
  },
  {
    title: '100% money back',
    icon: '/icons/moneyback/refund.png',
    body: 'Get a full refund. No questions asked, if not satisfied.',
  },
] as const

function GuaranteeIcon({ src }: { src: string }) {
  return (
    <span
      className="block h-full w-full bg-[#187254]"
      style={{
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
      aria-hidden
    />
  )
}

export default function MoneyBackGuarantee() {
  return (
    <section
      className="w-full bg-[#f4f1e8] px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
      aria-label="100% money-back guarantee"
    >
      <h2 className="text-center text-lg font-bold uppercase tracking-[0.12em] text-[#187254] sm:text-xl md:text-2xl lg:text-3xl">
        100% Money-Back Guarantee
      </h2>
      <div className="mx-auto mt-8 grid w-full max-w-7xl grid-cols-[1fr_auto_1fr_auto_1fr] grid-rows-[auto_3.75rem_auto] items-center justify-items-center gap-x-2 gap-y-3 sm:grid-rows-[auto_4.5rem_auto] sm:gap-x-4 sm:gap-y-4 md:grid-rows-[auto_5.5rem_auto] md:gap-x-8 lg:mt-10 lg:grid-rows-[auto_6.5rem_auto] lg:gap-x-12">
        {STEPS.map((step, index) => {
          const column = index * 2 + 1
          return (
            <div key={step.title} className="contents">
              <p
                className="flex h-8 w-full max-w-xs items-end justify-center px-1 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-[#187254] sm:h-9 sm:text-xs md:text-sm"
                style={{ gridColumn: column, gridRow: 1 }}
              >
                {step.title}
              </p>
              <div
                className="flex h-full w-11 items-center justify-center sm:w-14 md:w-16"
                style={{ gridColumn: column, gridRow: 2 }}
              >
                <GuaranteeIcon src={step.icon} />
              </div>
              <p
                className="flex min-h-[3.5rem] w-full max-w-xs items-start justify-center px-2 text-center text-[11px] leading-snug text-[#187254] sm:min-h-[4rem] sm:text-sm md:max-w-sm md:text-base"
                style={{ gridColumn: column, gridRow: 3 }}
              >
                {step.body}
              </p>
              {index < STEPS.length - 1 ? (
                <span
                  className="flex h-full items-center text-lg font-light leading-none text-[#187254] sm:text-2xl md:text-4xl"
                  style={{ gridColumn: column + 1, gridRow: 2 }}
                  aria-hidden
                >
                  ›
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
      <p className="mt-8 text-center text-[10px] text-gray-500 sm:text-xs">
        *Email us at{' '}
        <a href="mailto:support@fiberisefit.com" className="underline underline-offset-2">
          support@fiberisefit.com
        </a>{' '}
        within 7 days of ordering.
      </p>
    </section>
  )
}
