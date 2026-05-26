'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What exactly is FYBER and how is it different from regular fiber supplements?',
    answer: 'Unlike generic fiber supplements that only use simple bulking agents like psyllium husk, FYBER is an advanced smart formulation combining specific soluble prebiotic fibers (including Glucomannan and Inulin) with targeted probiotics, L-Carnitine, and L-Tyrosine. It works dynamically by absorbing water in your stomach to form a gentle gel, physically signaling fullness to your brain while nourishing your gut microbiome for sustained metabolic efficiency.'
  },
  {
    question: 'Is FYBER an Ozempic alternative? How does it compare to semaglutide injections?',
    answer: 'Semaglutide (Ozempic/Wegovy) is a synthetic prescription hormone injection that chemically slows digestion. FYBER is a completely natural, stimulant-free, dietary fiber-based alternative. It promotes natural satiety through gastric distention and delayed gastric emptying by stimulating your body\'s own GLP-1 release pathways safely and without systemic side effects or habit-forming dependencies.'
  },
  {
    question: 'How do I take FYBER and when is the best time to consume it?',
    answer: 'For optimal results, consume one sachet of FYBER dissolved in a glass of water 20 to 30 minutes before your heaviest meal of the day (usually lunch or dinner). Drink another glass of water immediately after to support the fiber\'s natural hydration and gel-forming action in your stomach.'
  },
  {
    question: 'What are the main ingredients in FYBER? Is it transparent about its formula?',
    answer: 'Yes, FYBER is fully transparent. The key ingredients include premium Glucomannan, Chicory Root Extract (Inulin), L-Carnitine L-Tartrate, L-Tyrosine, and a proprietary blend of prebiotics + probiotics. We never hide behind "proprietary blends" without declaring our active, clean ingredients.'
  },
  {
    question: 'How soon will I see results? What should I expect in 30, 60, and 90 days?',
    answer: 'In the first 30 days, you will experience reduced hunger and fewer sudden sweet cravings, leading to better portion control. Between days 30-60, you will notice improved gut digestive efficiency, reduced bloating, and visible changes in fat metabolism. From 60-90+ days, you will achieve sustainable weight control, enhanced energy levels, and a stronger, healthier metabolic foundation.'
  },
  {
    question: 'Is FYBER safe? Can I take it long-term?',
    answer: 'Absolutely. FYBER is made from completely natural, food-based dietary fibers and premium metabolic supports. It contains zero artificial stimulants, chemicals, or habit-forming compounds, making it perfectly safe for continuous long-term daily consumption.'
  },
  {
    question: 'Is FYBER safe for people with PCOS, thyroid conditions, or diabetes?',
    answer: 'Yes. The soluble prebiotic fibers in FYBER help slow glucose absorption, supporting healthier blood sugar levels and minimizing insulin spikes. This is highly beneficial for individuals managing PCOS, insulin resistance, and diabetes. As always, consult your physician before starting any new wellness regimen.'
  },
  {
    question: 'Can pregnant or breastfeeding women take FYBER?',
    answer: 'While dietary fibers are general wellness staples, we highly recommend consulting your obstetrician or primary care physician before adding any new supplement to your routine during pregnancy or lactation.'
  },
  {
    question: 'Which pack should I choose — Starter, Transformation, or Ultimate?',
    answer: 'The Starter Pack (7 Days) is ideal for experiencing initial taste, mixability, and gentle appetite control. The Transformation Pack (30 Days) is perfect for establishing a daily routine and noticing real changes in cravings and gut health. The Ultimate Pack (90 Days) is recommended for achieving full metabolic recalibration, continuous craving control, and maximum value.'
  },
  {
    question: 'Do I need to follow a specific diet or exercise plan while taking FYBER?',
    answer: 'No strict diet is required. However, FYBER works most effectively when paired with a balanced diet rich in whole foods and moderate physical activity. By managing your portion sizes and stopping sudden cravings naturally, FYBER makes sticking to healthy habits feel effortless.'
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="w-full bg-white py-12 md:py-16" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-base md:text-lg text-gray-500 font-medium mb-2">
            Everything You Need to Know!
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black uppercase tracking-wide">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ List */}
        <div className="border-t border-gray-200">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div 
                key={index} 
                className="border-b border-gray-200 py-6 md:py-8 first:pt-0"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between py-2 text-left"
                >
                  <span className="text-base md:text-lg font-semibold uppercase tracking-wider text-black pr-4">
                    {item.question}
                  </span>
                  <Plus
                    className={`flex-shrink-0 w-6 h-6 text-black transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  />
                </button>
                
                {isOpen && (
                  <div className="pt-2 pb-2 text-base md:text-lg text-gray-600 leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
