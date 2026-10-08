'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import VideoSection from '@/components/sections/VideoSection'
import ImageTextSection from '@/components/sections/ImageTextSection'
import MetabolismSection from '@/components/sections/science/MetabolismSection'
import ReelsSection from '@/components/sections/ReelsSection'
import RitualSection from '@/components/sections/RitualSection'
import EnergyResetSection from '@/components/sections/EnergyResetSection'
import ProductReviewsSection from '@/components/sections/ProductReviewsSection'

const PRODUCT_PAGE_FAQS = [
  {
    id: 'faq-1',
    question: 'CAN I LOSE WEIGHT JUST BY TAKING FYBER?',
    answer:
      'Yes. When taken 30–60 minutes before meals, FYBER helps calm hunger signals so you naturally eat less. Eating less creates a calorie deficit, which is the primary driver of weight loss. The fiber also slows gastric emptying, helping reduce sugar and insulin spikes. This keeps you fuller for longer and lowers cravings, so you snack less. Over time, these effects help you stay in a calorie deficit and support sustainable weight loss.',
  },
  {
    id: 'faq-2',
    question: 'IS FYBER LIKE OZEMPIC?',
    answer:
      'No. Ozempic is a prescription medication, while FYBER is a natural weight-management supplement. FYBER works by using a specialized fiber blend that naturally increases satiety and fullness, helping you eat less and manage cravings. Unlike prescription drugs, it does not interfere with hormones pharmacologically and is designed to be safe for regular, long-term use.',
  },
  {
    id: 'faq-3',
    question: 'DOES FYBER HAVE ANY SIDE EFFECTS?',
    answer:
      'As long as FYBER is used as recommended, it does not have any known short-term or long-term side effects. The ingredients used in FYBER are widely used in nutrition and dietary supplements and are recognized as safe by regulatory bodies such as the U.S. FDA (GRAS) and the European Food Safety Authority (EFSA). Like any fiber-based supplement, it should be taken with adequate water and according to the suggested usage for the best experience.',
  },
  {
    id: 'faq-4',
    question: 'WILL I GAIN WEIGHT AFTER I STOP TAKING FYBER?',
    answer:
      'No, as long as you continue to eat mindfully. When used consistently for a period of time, FYBER helps improve gut health and support better appetite regulation, which can naturally reduce cravings even after you stop taking it. The satiety effect also helps your body adapt to smaller portion sizes, so you tend to eat less naturally. Maintaining balanced eating habits will help you sustain your results.',
  },
  {
    id: 'faq-5',
    question: 'IS FYBER SAFE FOR WOMEN AND THEIR HORMONES?',
    answer:
      'Yes, FYBER is safe for women. Ingredients like dietary fiber have been shown to support overall metabolic and hormonal balance. By helping reduce sugar spikes and improving metabolic stability, FYBER can indirectly support better hormonal regulation and thyroid function, while also supporting appetite control, gut health, and overall nutritional balance.',
  },
  {
    id: 'faq-6',
    question:
      'CAN A PERSON SUFFERING FROM DIABETES, PCOS, PCOD, HYPERTENSION, HIGH CHOLESTEROL, OR FATTY LIVER CONSUME FYBER?',
    answer:
      'Yes, FYBER is generally safe for individuals with conditions such as diabetes, PCOS/PCOD, hypertension, high cholesterol, or fatty liver. The ingredients used are widely consumed in nutritional supplements and are not known to interfere with medications commonly used to manage these conditions. However, if you are under medical treatment or on prescription medication, always consult your doctor before starting any new supplement.',
  },
  {
    id: 'faq-7',
    question: 'WILL I HAVE LOW ENERGY LEVELS WHILE CONSUMING FYBER?',
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
  const [joinEmail, setJoinEmail] = useState('')
  const [joinSubmitted, setJoinSubmitted] = useState(false)

  return (
    <>
      <ReelsSection />
      <div className="md:hidden">
        <RitualSection />
      </div>
      <VideoSection />
      <div className="md:hidden">
        <ImageTextSection showLearnScienceCta={false} />
      </div>
      <EnergyResetSection />
      <MetabolismSection />

      <section className="w-full bg-white py-12 md:py-16" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-base md:text-lg text-gray-500 font-medium mb-2">
              Everything You Need to Know!
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black uppercase tracking-wide">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="border-t border-gray-200">
            {PRODUCT_PAGE_FAQS.map((faq) => (
              <div key={faq.id} className="border-b border-gray-200 py-6 md:py-8 first:pt-0">
                <button
                  type="button"
                  onClick={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between py-2 text-left"
                >
                  <span className="text-base md:text-lg font-semibold uppercase tracking-wider text-black pr-4">
                    {faq.question}
                  </span>
                  <Plus
                    className={`flex-shrink-0 w-6 h-6 text-black transition-transform ${
                      expandedFaqId === faq.id ? 'rotate-45' : ''
                    }`}
                  />
                </button>
                {expandedFaqId === faq.id && (
                  <div className="pt-2 pb-2 text-base md:text-lg text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductReviewsSection productSlug={productSlug} productTitle={productTitle} />

      <section className="w-full bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 text-center">
            <div>
              <div className="flex justify-center mb-4">
                <Image src="/icons/lab.png" alt="" width={48} height={48} className="object-contain" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-2">Third-Party Tested</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We hold ourselves and our ingredients to the highest standards.
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Image src="/icons/quality.png" alt="" width={48} height={48} className="object-contain" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-2">Quality Ingredients</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We&apos;re dedicated to using scientifically backed, high-quality natural ingredients.
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Image src="/icons/nogmo-2.png" alt="" width={48} height={48} className="object-contain" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-2">Non-GMO</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We carefully evaluate every ingredient, ensuring they are non-GMO.
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Image src="/icons/vegan-2.png" alt="" width={48} height={48} className="object-contain" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-2">Vegan</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We ensure the highest standards with 100% vegan, cruelty-free formulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#168B6A] py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide mb-3">
            Join Our Circle & Save!
          </h2>
          <p className="text-base text-white mb-8">
            Sign up now for 10% off your first order — because you deserve it!
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setJoinSubmitted(true)
              setJoinEmail('')
              setTimeout(() => setJoinSubmitted(false), 3000)
            }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center"
          >
            <input
              type="email"
              value={joinEmail}
              onChange={(e) => setJoinEmail(e.target.value)}
              placeholder="Email"
              required
              className="flex-1 min-w-0 px-5 py-3 bg-white border border-white/80 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <button
              type="submit"
              className="px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider bg-white text-black hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              {joinSubmitted ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
