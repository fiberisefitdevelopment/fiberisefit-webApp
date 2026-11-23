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
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-1.5 h-10 w-10 shrink-0 md:h-11 md:w-11">
        <Image src={icon} alt="" fill sizes="44px" className="object-contain" />
      </div>
      <h3 className="text-[11px] font-semibold uppercase leading-tight tracking-wider md:text-xs">
        {title}
      </h3>
      <p className="mt-0.5 max-w-[12.5rem] text-[11px] leading-snug text-gray-600">{description}</p>
    </div>
  )
}

export default function VideoSection() {
  return (
    <section className="w-full bg-fyber-ivory-dream pb-4 pt-8 md:pb-5 md:pt-10">
      <h2 className="mb-5 px-6 text-center text-2xl font-bold uppercase tracking-wide text-black md:mb-6 md:text-3xl lg:text-4xl">
        Science meets everyday control
      </h2>

      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 items-start gap-x-4 gap-y-4 md:grid-cols-3 md:gap-x-6 md:gap-y-5">
          {features.map((feature) => (
            <IconTile key={feature.title} {...feature} />
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 items-start gap-x-4 gap-y-4 md:mt-5 md:grid-cols-4 md:gap-x-6">
          {TRUST_PILLARS.map((pillar) => (
            <IconTile key={pillar.title} {...pillar} />
          ))}
        </div>
      </div>
    </section>
  )
}
