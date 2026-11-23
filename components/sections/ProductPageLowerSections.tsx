'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Minus, Plus } from 'lucide-react'

const ReelsSection = dynamic(() => import('@/components/sections/ReelsSection'), { ssr: false })
const EnergyResetSection = dynamic(() => import('@/components/sections/EnergyResetSection'), { ssr: false })
const VideoSection = dynamic(() => import('@/components/sections/VideoSection'), { ssr: false })
const ProductReviewsSection = dynamic(() => import('@/components/sections/ProductReviewsSection'), { ssr: false })

const PRODUCT_PAGE_FAQS = [
  {
    id: 'faq-1',
    question: 'Can I lose weight just by taking FYBER?',
    answer:
      'Yes. When taken 30–60 minutes before meals, FYBER helps calm hunger signals so you naturally eat less. Eating less creates a calorie deficit, which is the primary driver of weight loss. The fiber also slows gastric emptying, helping reduce sugar and insulin spikes. This keeps you fuller for longer and lowers cravings, so you snack less. Over time, these effects help you stay in a calorie deficit and support sustainable weight loss.',
  },
  {
    id: 'faq-2',
    question: 'Is FYBER like Ozempic?',
    answer:
      'No. Ozempic is a prescription medication, while FYBER is a natural weight-management supplement. FYBER works by using a specialized fiber blend that naturally increases satiety and fullness, helping you eat less and manage cravings. Unlike prescription drugs, it does not interfere with hormones pharmacologically and is designed to be safe for regular, long-term use.',
  },
  {
    id: 'faq-3',
    question: 'Does FYBER have any side effects?',
    answer:
      'As long as FYBER is used as recommended, it does not have any known short-term or long-term side effects. The ingredients used in FYBER are widely used in nutrition and dietary supplements and are recognized as safe by regulatory bodies such as the U.S. FDA (GRAS) and the European Food Safety Authority (EFSA). Like any fiber-based supplement, it should be taken with adequate water and according to the suggested usage for the best experience.',
  },
  {
    id: 'faq-4',
    question: 'Will I gain weight after I stop taking FYBER?',
    answer:
      'No, as long as you continue to eat mindfully. When used consistently for a period of time, FYBER helps improve gut health and support better appetite regulation, which can naturally reduce cravings even after you stop taking it. The satiety effect also helps your body adapt to smaller portion sizes, so you tend to eat less naturally. Maintaining balanced eating habits will help you sustain your results.',
  },
  {
    id: 'faq-5',
    question: 'Is FYBER safe for women and their hormones?',
    answer:
      'Yes, FYBER is safe for women. Ingredients like dietary fiber have been shown to support overall metabolic and hormonal balance. By helping reduce sugar spikes and improving metabolic stability, FYBER can indirectly support better hormonal regulation and thyroid function, while also supporting appetite control, gut health, and overall nutritional balance.',
  },
  {
    id: 'faq-6',
    question:
      'Can someone with diabetes, PCOS, PCOD, hypertension, high cholesterol, or fatty liver take FYBER?',
    answer:
      'Yes, FYBER is generally safe for individuals with conditions such as diabetes, PCOS/PCOD, hypertension, high cholesterol, or fatty liver. The ingredients used are widely consumed in nutritional supplements and are not known to interfere with medications commonly used to manage these conditions. However, if you are under medical treatment or on prescription medication, always consult your doctor before starting any new supplement.',
  },
  {
    id: 'faq-7',
    question: 'Will I have low energy while consuming FYBER?',
    answer:
      'No, you will not experience low energy while consuming FYBER. It contains L-Carnitine L-Tartrate (LCLT) and L-Tyrosine, two non-stimulant amino acids that support energy metabolism, focus, and mental clarity, especially during a calorie deficit. Instead of causing fatigue, FYBER is designed to help you stay sharp, active, and productive, so you can comfortably maintain your daily routine and demanding lifestyle while managing your weight.',
  },
] as const

type ProductPageLowerSectionsProps = {
  productSlug: string
  productTitle: string
}

export default function ProductPageLowerSections({
  productSlug,
  productTitle,
}: ProductPageLowerSectionsProps) {
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null)

  return (
    <>
      <ReelsSection />
      <ProductReviewsSection productSlug={productSlug} productTitle={productTitle} />
      <EnergyResetSection />
      <VideoSection />

      <section className="w-full bg-fyber-ivory-dream pb-10 pt-4 md:pb-12 md:pt-6">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-500">Everything you need to know</p>
          <h2 className="mt-1 text-center text-2xl font-bold uppercase tracking-wide text-black md:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-6 space-y-3">
            {PRODUCT_PAGE_FAQS.map((faq) => {
              const open = expandedFaqId === faq.id
              return (
                <div
                  key={faq.id}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-[0_8px_24px_rgba(24,114,84,0.06)] transition-colors ${
                    open ? 'border-[#187254]/35' : 'border-[#187254]/12'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaqId(open ? null : faq.id)}
                    aria-expanded={open}
                    className="flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5"
                  >
                    <span className="flex-1 text-[15px] font-semibold leading-snug text-gray-900">
                      {faq.question}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                        open ? 'bg-black text-white' : 'bg-gray-100 text-black'
                      }`}
                    >
                      {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  {open ? (
                    <div className="border-t border-[#187254]/10 px-4 pb-5 pt-3 text-sm leading-relaxed text-gray-600 sm:px-5">
                      {faq.answer}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
