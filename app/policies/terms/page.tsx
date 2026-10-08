import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Fiberise Fit',
  description:
    'Read Fiberise Fit terms & conditions covering website usage, purchases, policies and legal agreements for a safe and transparent experience.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef1f4] to-slate-50 pt-28">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-white p-10 rounded-2xl shadow-2xl mb-7" style={{ backgroundColor: '#102333' }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms &amp; Conditions</h1>
          <p className="text-gray-300">FIBERISE FIT PRIVATE LIMITED</p>
          <p className="text-gray-300 text-sm mt-1">Last updated on Mar 10th 2026</p>
        </div>

        {/* Terms Body */}
        <div className="bg-white rounded-2xl p-7 mb-6 border border-gray-200 shadow-lg shadow-black/5 space-y-6">
          <p className="text-gray-800 leading-relaxed">
            These Terms and Conditions (hereinafter referred to as the <strong>&quot;Terms&quot;</strong> or{' '}
            <strong>&quot;Agreement&quot;</strong>) govern the access to and use of the website, digital platforms,
            mobile applications, products, services, and related content operated by FIBERISE FIT PRIVATE LIMITED, its
            affiliates, subsidiaries, licensors, service providers, and authorized representatives (collectively
            referred to as the <strong>&quot;Company&quot;, &quot;We&quot;, &quot;Us&quot;,</strong> or{' '}
            <strong>&quot;Our&quot;</strong>).
          </p>
          <p className="text-gray-800 leading-relaxed">
            By accessing, browsing, registering on, or using the website, purchasing products, or engaging with any
            services provided by the Company, the user, visitor, purchaser, or customer (hereinafter referred to as the{' '}
            <strong>&quot;User&quot;, &quot;You&quot;,</strong> or <strong>&quot;Your&quot;</strong>) agrees to be bound
            by these Terms and Conditions in their entirety. If you do not agree with any part of these Terms, you must
            discontinue use of the website and services immediately.
          </p>

          {/* 1. Website Content */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">1. WEBSITE CONTENT AND INFORMATION</h2>
            <p className="text-gray-800 leading-relaxed">
              1.1 The content of the pages of this website, including but not limited to product descriptions, images,
              pricing, specifications, policies, and other materials, is provided for general informational purposes
              only.
            </p>
            <p className="text-gray-800 leading-relaxed">
              1.2 The Company reserves the right to modify, update, remove, or change any content on the website without
              prior notice.
            </p>
            <p className="text-gray-800 leading-relaxed">
              1.3 While the Company endeavors to ensure that the information presented on the website is accurate and
              up to date, neither the Company nor any third parties make any representations, warranties, or guarantees
              regarding the accuracy, timeliness, performance, completeness, reliability, or suitability for any
              particular purpose of the information and materials provided on the website.
            </p>
            <p className="text-gray-800 leading-relaxed">
              1.4 The User acknowledges that such information and materials may contain inaccuracies, typographical
              errors, or omissions. To the fullest extent permitted by law, the Company expressly excludes liability
              for any such inaccuracies or errors.
            </p>
          </section>

          {/* 2. User Responsibility */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">2. USER RESPONSIBILITY</h2>
            <p className="text-gray-800 leading-relaxed">
              2.1 The use of any information, services, or products available through the website or product pages shall
              be entirely at the User&apos;s own risk.
            </p>
            <p className="text-gray-800 leading-relaxed">2.2 It shall be the sole responsibility of the User to ensure that:</p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Any products purchased meet their personal requirements.</li>
              <li>The information relied upon is suitable for their intended use.</li>
              <li>They comply with all applicable laws while using the website.</li>
            </ul>
            <p className="text-gray-800 leading-relaxed">
              2.3 The Company shall not be liable for any direct, indirect, incidental, or consequential loss arising
              from the use of the website or its content.
            </p>
          </section>

          {/* 3. Intellectual Property */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">3. INTELLECTUAL PROPERTY RIGHTS</h2>
            <p className="text-gray-800 leading-relaxed">
              3.1 This website contains material that is owned by or licensed to the Company.
            </p>
            <p className="text-gray-800 leading-relaxed">
              3.2 Such materials include but are not limited to website design, layout and structure, logos and
              branding, product images, graphics and visual assets, written content and descriptions, software, and
              code.
            </p>
            <p className="text-gray-800 leading-relaxed">
              3.3 All such materials are protected under applicable copyright, trademark, intellectual property, and
              other proprietary laws.
            </p>
            <p className="text-gray-800 leading-relaxed">
              3.4 Reproduction, redistribution, copying, modification, transmission, publication, or commercial
              exploitation of any content from the website is strictly prohibited except in accordance with the
              applicable copyright notice or with prior written permission from FIBERISE FIT PRIVATE LIMITED.
            </p>
          </section>

          {/* 4. Trademarks */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">4. TRADEMARKS</h2>
            <p className="text-gray-800 leading-relaxed">
              4.1 All trademarks displayed on this website are either the property of FIBERISE FIT PRIVATE LIMITED or
              used under appropriate license.
            </p>
            <p className="text-gray-800 leading-relaxed">
              4.2 Any trademarks reproduced on this website which are not owned by or licensed to the Company are
              acknowledged accordingly.
            </p>
            <p className="text-gray-800 leading-relaxed">
              4.3 Unauthorized use of any trademarks displayed on the website may constitute a violation of applicable
              trademark laws.
            </p>
          </section>

          {/* 5. Prohibited Use */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">5. PROHIBITED USE</h2>
            <p className="text-gray-800 leading-relaxed">
              5.1 Unauthorized use of information, materials, or services provided by the Company may give rise to
              civil liability, claims for damages, or criminal prosecution under applicable laws.
            </p>
            <p className="text-gray-800 leading-relaxed">5.2 Users agree not to:</p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Attempt unauthorized access to the website systems.</li>
              <li>Introduce malicious software, code, or viruses.</li>
              <li>Use automated tools to scrape or extract data.</li>
              <li>Misrepresent identity, credentials, or affiliation.</li>
            </ul>
            <p className="text-gray-800 leading-relaxed">
              The Company reserves the right to terminate or restrict access to Users violating these provisions.
            </p>
          </section>

          {/* 6. Third‑party Links */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">6. THIRD-PARTY LINKS</h2>
            <p className="text-gray-800 leading-relaxed">
              6.1 From time to time, the website may include links to third-party websites or external resources.
            </p>
            <p className="text-gray-800 leading-relaxed">
              6.2 These links are provided solely for the convenience of Users to obtain additional information.
            </p>
            <p className="text-gray-800 leading-relaxed">
              6.3 The Company does not endorse the content of third-party websites, control the availability of such
              websites, or accept responsibility for their privacy policies or practices. Users access such websites at
              their own risk.
            </p>
          </section>

          {/* 7. Linking to Our Website */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">7. LINKING TO OUR WEBSITE</h2>
            <p className="text-gray-800 leading-relaxed">
              7.1 Users may not create links to this website from another website, digital platform, or document without
              obtaining prior written consent from FIBERISE FIT PRIVATE LIMITED.
            </p>
            <p className="text-gray-800 leading-relaxed">
              7.2 Unauthorized linking or framing of the website may result in legal action.
            </p>
          </section>

          {/* 8. Product Purchases */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">8. PRODUCT PURCHASES</h2>
            <p className="text-gray-800 leading-relaxed">
              8.1 All purchases made through the website are subject to product availability and acceptance by the
              Company.
            </p>
            <p className="text-gray-800 leading-relaxed">8.2 The Company reserves the right to:</p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Refuse or cancel orders at its discretion</li>
              <li>Limit quantities purchased</li>
              <li>Correct pricing errors or inaccuracies</li>
            </ul>
            <p className="text-gray-800 leading-relaxed">
              8.3 Pricing, product descriptions, and promotional offers are subject to change without notice.
            </p>
          </section>

          {/* 9. Payment Authorization */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">9. PAYMENT AUTHORIZATION</h2>
            <p className="text-gray-800 leading-relaxed">
              9.1 Transactions conducted through the website are processed via authorized payment gateways and
              financial institutions.
            </p>
            <p className="text-gray-800 leading-relaxed">
              9.2 The Company shall not be liable for any loss or damage arising directly or indirectly out of the
              decline of authorization for any transaction, including but not limited to circumstances where the
              cardholder has exceeded preset limits, the issuing bank declines the transaction, or payment gateways
              experience technical failures.
            </p>
            <p className="text-gray-800 leading-relaxed">
              9.3 All payment authorization decisions are made solely by the acquiring bank or financial institution.
            </p>
          </section>

          {/* 10. Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">10. LIMITATION OF LIABILITY</h2>
            <p className="text-gray-800 leading-relaxed">
              10.1 To the fullest extent permitted by applicable law, the Company shall not be liable for any direct
              losses, indirect damages, incidental damages, consequential damages, loss of profits, business
              interruption, or data loss arising from the use of the website, products, or services.
            </p>
            <p className="text-gray-800 leading-relaxed">
              10.2 The Company&apos;s total liability in any circumstance shall not exceed the purchase price of the
              product or service involved in the dispute.
            </p>
          </section>

          {/* 11. Force Majeure */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">11. FORCE MAJEURE</h2>
            <p className="text-gray-800 leading-relaxed">
              The Company shall not be liable for any failure or delay in performance arising out of circumstances
              beyond its reasonable control, including but not limited to natural disasters, government restrictions,
              internet outages, cyber incidents, labor disputes, transportation disruptions, or pandemics and public
              health emergencies.
            </p>
          </section>

          {/* 12. Indemnification */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">12. INDEMNIFICATION</h2>
            <p className="text-gray-800 leading-relaxed">
              Users agree to indemnify and hold harmless FIBERISE FIT PRIVATE LIMITED, its directors, employees,
              affiliates, agents, and partners from any claims, damages, liabilities, or expenses arising out of misuse
              of the website, violation of these Terms, or violation of applicable laws or regulations.
            </p>
          </section>

          {/* 13. Termination */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">13. TERMINATION OF ACCESS</h2>
            <p className="text-gray-800 leading-relaxed">
              The Company reserves the right to suspend or terminate access to the website or services at its sole
              discretion, without prior notice, where a User is found to be in violation of these Terms.
            </p>
          </section>

          {/* 14. Governing Law */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">14. GOVERNING LAW AND JURISDICTION</h2>
            <p className="text-gray-800 leading-relaxed">
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any
              disputes arising out of or relating to the use of the website, purchase of products, or engagement with
              the Company shall be subject to the exclusive jurisdiction of the courts located in Delhi, India.
            </p>
          </section>
        </div>

        <footer className="mt-7 py-6 rounded-2xl text-center text-sm text-gray-300" style={{ backgroundColor: '#102333' }}>
          © FIBERISE FIT PRIVATE LIMITED — All rights reserved
        </footer>
      </div>
    </div>
  )
}
