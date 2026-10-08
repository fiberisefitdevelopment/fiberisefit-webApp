import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medical Disclaimer | Fiberise Fit',
  description:
    'Read our medical disclaimer. Information on this site is for general guidance and not a substitute for professional medical advice.',
}

export default function MedicalDisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef1f4] to-slate-50 pt-28">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div
          className="text-white p-10 rounded-2xl shadow-2xl mb-7"
          style={{ backgroundColor: '#102333' }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Health, Medical &amp; Supplement Disclaimer
          </h1>
          <p className="text-gray-300">FIBERISE FIT PRIVATE LIMITED</p>
          <p className="text-gray-300 text-sm mt-1">Last updated on Mar 10th 2026</p>
        </div>

        {/* Body */}
        <div className="bg-white rounded-2xl p-7 mb-6 border border-gray-200 shadow-lg shadow-black/5 space-y-6">
          <p className="text-gray-800 leading-relaxed">
            This Health, Medical and Supplement Disclaimer (hereinafter referred to as the{' '}
            <strong>&quot;Disclaimer&quot;</strong>) governs the use of all products, services, content, information,
            and materials provided by FIBERISE FIT PRIVATE LIMITED, its affiliates, subsidiaries, licensors,
            distributors, partners, and representatives (collectively referred to as the{' '}
            <strong>&quot;Company&quot;, &quot;We&quot;, &quot;Us&quot;,</strong> or <strong>&quot;Our&quot;</strong>).
          </p>
          <p className="text-gray-800 leading-relaxed">
            The products sold or promoted through our website, digital platforms, applications, marketing materials,
            social media channels, and other communication mediums include nutraceuticals, dietary supplements, wellness
            products, and related health products (collectively referred to as <strong>&quot;Products&quot;</strong>).
          </p>
          <p className="text-gray-800 leading-relaxed">
            By purchasing, accessing, or using any of the Company&apos;s products, services, or information, you
            (hereinafter referred to as the <strong>&quot;User&quot;, &quot;Customer&quot;,</strong> or{' '}
            <strong>&quot;Consumer&quot;</strong>) acknowledge and agree to the terms outlined in this Disclaimer. If
            you do not agree with any part of this Disclaimer, you should discontinue use of the products and services
            immediately.
          </p>

          {/* 1. Not Medical Advice */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">1. NOT MEDICAL ADVICE</h2>
            <p className="text-gray-800 leading-relaxed">
              1.1 The information provided by the Company through its website, product labels, marketing materials,
              blogs, social media posts, videos, or other communication channels is intended solely for informational
              and educational purposes.
            </p>
            <p className="text-gray-800 leading-relaxed">
              1.2 Such information should not be interpreted as medical advice, diagnosis, treatment, or prescription.
            </p>
            <p className="text-gray-800 leading-relaxed">
              1.3 The content provided by the Company is not intended to replace consultation with a qualified
              physician, healthcare professional, or licensed medical practitioner.
            </p>
            <p className="text-gray-800 leading-relaxed">
              1.4 Users are strongly advised to consult with their healthcare provider before starting any supplement,
              particularly if they:
            </p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Have an existing medical condition</li>
              <li>Are pregnant or nursing</li>
              <li>Are taking prescription medication</li>
              <li>Are undergoing medical treatment</li>
            </ul>
          </section>

          {/* 2. Product Classification */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">2. PRODUCT CLASSIFICATION</h2>
            <p className="text-gray-800 leading-relaxed">
              2.1 The Company&apos;s products are classified as nutritional supplements or nutraceutical products and
              are not intended to diagnose, treat, cure, or prevent any disease.
            </p>
            <p className="text-gray-800 leading-relaxed">
              2.2 These products are not pharmaceutical drugs and should not be construed as substitutes for medical
              treatment.
            </p>
            <p className="text-gray-800 leading-relaxed">
              2.3 The regulatory classification of these products may fall under food, dietary supplement, or
              nutraceutical categories as applicable under relevant regulatory frameworks.
            </p>
          </section>

          {/* 3. Individual Results */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">3. INDIVIDUAL RESULTS MAY VARY</h2>
            <p className="text-gray-800 leading-relaxed">
              3.1 The effects of nutritional supplements may vary significantly between individuals.
            </p>
            <p className="text-gray-800 leading-relaxed">3.2 Factors that influence results include but are not limited to:</p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Age</li>
              <li>Genetics</li>
              <li>Lifestyle</li>
              <li>Diet</li>
              <li>Physical activity levels</li>
              <li>Existing health conditions</li>
              <li>Consistency of product usage</li>
            </ul>
            <p className="text-gray-800 leading-relaxed">
              3.3 Any testimonials, reviews, or results presented on the website or marketing materials are individual
              experiences and should not be interpreted as typical results.
            </p>
            <p className="text-gray-800 leading-relaxed">
              3.4 The Company does not guarantee specific outcomes, including but not limited to weight loss, fat loss,
              metabolic improvements, energy improvements, or fitness outcomes.
            </p>
          </section>

          {/* 4. Weight Management */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">4. WEIGHT MANAGEMENT DISCLAIMER</h2>
            <p className="text-gray-800 leading-relaxed">
              4.1 Certain products offered by the Company may support satiety, appetite management, metabolic balance,
              or general wellness.
            </p>
            <p className="text-gray-800 leading-relaxed">
              4.2 Such products are intended to be used as part of a balanced diet and healthy lifestyle.
            </p>
            <p className="text-gray-800 leading-relaxed">
              4.3 Sustainable weight management requires multiple factors including caloric balance, physical activity,
              dietary habits, sleep patterns, and lifestyle modifications.
            </p>
            <p className="text-gray-800 leading-relaxed">
              4.4 The Company does not represent or warrant that the use of its products alone will result in weight
              loss or body composition changes.
            </p>
          </section>

          {/* 5. Safety & Allergies */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">5. SAFETY AND ALLERGIES</h2>
            <p className="text-gray-800 leading-relaxed">
              5.1 Although the Company strives to ensure high standards of manufacturing and quality control, Users
              should carefully review ingredient lists, nutritional information, usage instructions, and allergen
              warnings.
            </p>
            <p className="text-gray-800 leading-relaxed">
              5.2 Users who have known allergies or sensitivities to any ingredient should avoid using the product.
            </p>
            <p className="text-gray-800 leading-relaxed">
              5.3 The Company shall not be liable for adverse reactions resulting from failure to review ingredient
              information, improper usage, or overconsumption of supplements.
            </p>
          </section>

          {/* 6. Dosage */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">6. DOSAGE AND USAGE</h2>
            <p className="text-gray-800 leading-relaxed">
              6.1 Users should strictly follow the recommended dosage and usage instructions provided on product labels
              or packaging.
            </p>
            <p className="text-gray-800 leading-relaxed">
              6.2 Exceeding the recommended dosage may lead to unintended health effects.
            </p>
            <p className="text-gray-800 leading-relaxed">
              6.3 The Company shall not be responsible for any adverse outcomes resulting from misuse, excessive
              consumption, or improper storage of the Products.
            </p>
          </section>

          {/* 7. Health Data */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">
              7. HEALTH DATA AND FITNESS INSIGHTS (IF APPLICABLE)
            </h2>
            <p className="text-gray-800 leading-relaxed">
              7.1 Any health insights, recommendations, or analytics provided through devices, applications, or digital
              platforms associated with the Company are intended for informational and wellness purposes only.
            </p>
            <p className="text-gray-800 leading-relaxed">
              7.2 Such insights are not medical diagnostics and should not be relied upon as substitutes for
              professional medical evaluation.
            </p>
          </section>

          {/* 8. No professional relationship */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">8. NO PROFESSIONAL RELATIONSHIP</h2>
            <p className="text-gray-800 leading-relaxed">
              8.1 The use of the Company&apos;s products or website does not create a doctor–patient, therapist–patient,
              or healthcare professional relationship between the User and the Company.
            </p>
          </section>

          {/* 9. Limitation of liability */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">9. LIMITATION OF LIABILITY</h2>
            <p className="text-gray-800 leading-relaxed">
              9.1 To the maximum extent permitted by applicable law, FIBERISE FIT PRIVATE LIMITED shall not be liable
              for any direct, indirect, incidental, special, or consequential damages arising from use or misuse of the
              Products, reliance on information provided on the website, adverse reactions to ingredients, or failure to
              achieve expected health outcomes.
            </p>
            <p className="text-gray-800 leading-relaxed">
              9.2 The Company&apos;s total liability, if any, shall not exceed the purchase price of the Product in
              question.
            </p>
          </section>

          {/* 10. User responsibility */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">10. USER RESPONSIBILITY</h2>
            <p className="text-gray-800 leading-relaxed">
              10.1 Users acknowledge that they are personally responsible for evaluating the suitability of any Product
              before use.
            </p>
            <p className="text-gray-800 leading-relaxed">
              10.2 Users agree to use the Products at their own discretion and risk.
            </p>
          </section>

          {/* 11. Regulatory compliance */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">11. REGULATORY COMPLIANCE</h2>
            <p className="text-gray-800 leading-relaxed">
              11.1 The Company endeavors to ensure that its Products comply with applicable regulatory standards and
              quality guidelines. However, regulatory interpretations and product classifications may vary across
              jurisdictions.
            </p>
          </section>

          {/* 12. Modifications */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">12. MODIFICATIONS TO DISCLAIMER</h2>
            <p className="text-gray-800 leading-relaxed">
              The Company reserves the right to modify or update this Disclaimer at any time without prior notice.
              Continued use of the Products or website constitutes acceptance of the revised Disclaimer.
            </p>
          </section>

          {/* 13. Contact */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">13. CONTACT INFORMATION</h2>
            <p className="text-gray-800 leading-relaxed">
              For any questions regarding this Disclaimer, you may contact:
            </p>
            <p className="text-gray-800 leading-relaxed">
              <strong>FIBERISE FIT PRIVATE LIMITED</strong>
            </p>
            <p className="text-gray-800 leading-relaxed">
              <strong>Email:</strong> support@fiberisefit.com
            </p>
            <p className="text-gray-800 leading-relaxed">
              <strong>Phone:</strong> +91-7070705026
            </p>
            <p className="text-gray-800 leading-relaxed">
              <strong>Website:</strong> www.fiberisefit.com
            </p>
          </section>
        </div>

        <footer
          className="mt-7 py-6 rounded-2xl text-center text-sm text-gray-300"
          style={{ backgroundColor: '#102333' }}
        >
          © FIBERISE FIT PRIVATE LIMITED — All rights reserved
        </footer>
      </div>
    </div>
  )
}

