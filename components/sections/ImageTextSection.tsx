import Image from 'next/image'
import Link from 'next/link'

export default function ImageTextSection() {
  return (
    <section className="w-full m-0 p-0 bg-white min-h-[89vh] md:h-[89vh]">
      <div className="w-full h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch h-full w-full">
          {/* Image Side - Full width, no spacing */}
          <div className="relative w-full h-[50vh] md:h-full overflow-hidden m-0 p-0">
            <Image
              src="/WhatsApp Image 2026-01-08 at 11.09.54.jpeg"
              alt="LEAN-X - Patent Pending Formula"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Text Side */}
          <div className="flex flex-col justify-start items-start text-left pt-12 md:pt-16 lg:pt-20 pr-12 md:pr-16 lg:pr-20 pb-8 lg:pb-12 pl-16 md:pl-20 lg:pl-24 space-y-6 md:space-y-8 opacity-90">
            <p className="text-lg md:text-xl lg:text-2xl font-light text-gray-700 tracking-tight leading-snug opacity-60">
              Patent Pending Formula
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight w-full">
              <span className="inline-flex items-start">
                LEAN-X<sup className="text-[0.45em] ml-0.5 leading-none self-start -translate-y-0.5">®</sup>
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl font-medium text-gray-700 tracking-tight leading-snug">
              A New Class of Metabolic Intelligence
            </p>
            <p className="text-sm md:text-base text-gray-600 leading-[2] max-w-2xl">
              LEAN-X<sup className="text-xs">®</sup> is not an ingredient.
              It is a breakthrough architecture — engineered at the intersection of metabolic science, neuro-energy regulation, and gut intelligence.
              Built on years of clinical research and advanced formulation science, LEAN-X<sup className="text-xs">®</sup> represents a category-defining evolution in weight and energy management—one that has never existed before.
            </p>
            <div className="pt-2 md:pt-4">
              <Link
                href="/science"
                className="inline-block border-2 border-black px-6 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors"
              >
                Learn the Science
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

