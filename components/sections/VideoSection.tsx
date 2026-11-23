import Image from 'next/image'

const TRUST_PILLARS = [
  {
    icon: '/icons/lab.png',
    title: 'Third-Party Tested',
    description: 'We hold ourselves and our ingredients to the highest standards.',
  },
  {
    icon: '/icons/quality.png',
    title: 'Quality Ingredients',
    description: "We're dedicated to using scientifically backed, high-quality natural ingredients.",
  },
  {
    icon: '/icons/nogmo-2.png',
    title: 'Non-GMO',
    description: 'We carefully evaluate every ingredient, ensuring they are non-GMO.',
  },
  {
    icon: '/icons/vegan-2.png',
    title: 'Vegan',
    description: 'We ensure the highest standards with 100% vegan, cruelty-free formulations.',
  },
] as const

const features = [
  {
    icon: '/icons/Group 642.svg',
    title: 'Mobilises Fat',
    description: "Supports the body's natural fat-utilisation pathways",
  },
  {
    icon: '/icons/Group 639.svg',
    title: 'Controls Hunger',
    description: 'Helps you feel satisfied, longer.',
  },
  {
    icon: '/icons/Group 644.svg',
    title: 'Improves Energy Levels',
    description: 'Clean support for mental and physical clarity.',
  },
  {
    icon: '/icons/Group 643.svg',
    title: 'Reduces Caloric Intake',
    description: 'Encourages mindful eating through better fullness.',
  },
  {
    icon: '/icons/Group 640.svg',
    title: 'Pre-Biotic',
    description: 'Nourishes beneficial gut bacteria naturally.',
  },
  {
    icon: '/icons/Group 638.svg',
    title: 'Pro-Biotic',
    description: 'Supports a balanced and resilient gut ecosystem.',
  },
]

function IconTile({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="mx-auto flex h-full w-full max-w-[220px] flex-col items-center text-center">
      <div className="relative mb-3 h-12 w-12 shrink-0">
        <Image src={icon} alt="" fill sizes="48px" className="object-contain" />
      </div>
      <h3 className="min-h-[2.5rem] text-[11px] font-semibold uppercase leading-snug tracking-wider md:text-xs">
        {title}
      </h3>
      <p className="mt-1 text-[11px] leading-relaxed text-gray-600 md:text-xs">{description}</p>
    </div>
  )
}

export default function VideoSection() {
  return (
    <section className="w-full bg-fyber-ivory-dream pb-8 pt-8 md:pb-12 md:pt-12">
      <h2 className="mb-8 px-6 text-center text-2xl font-bold uppercase tracking-wide text-black md:mb-12 md:text-3xl lg:text-4xl">
        Science meets everyday control
      </h2>

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-12 md:gap-x-6 md:gap-y-12">
          {features.map((feature) => (
            <div key={feature.title} className="md:col-span-4">
              <IconTile {...feature} />
            </div>
          ))}
          {TRUST_PILLARS.map((pillar) => (
            <div key={pillar.title} className="md:col-span-3">
              <IconTile {...pillar} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
