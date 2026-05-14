import Image from 'next/image'
import { MOBILE_IMAGE, DESKTOP_IMAGE } from '@/lib/constants/banners'

export default function HeroSection() {
  return (
    <>
      {/* ── MOBILE layout: Full image, no cropping ── */}
      <section className="md:hidden w-full bg-white pt-24">
        <div className="w-full">
          <Image
            src={MOBILE_IMAGE}
            alt="Fyber wellness mobile banner"
            width={1080}
            height={1920}
            className="w-full h-auto block"
            priority
            fetchPriority="high"
          />
        </div>
      </section>

      {/* ── DESKTOP layout: Full image, no cropping ── */}
      <section className="hidden md:block w-full bg-white">
        <div className="w-full">
          <Image
            src={DESKTOP_IMAGE}
            alt="Fyber wellness desktop banner"
            width={2880}
            height={1200}
            className="w-full h-auto block"
            priority
            fetchPriority="high"
          />
        </div>
      </section>
    </>
  )
}
