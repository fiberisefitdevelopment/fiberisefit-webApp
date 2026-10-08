import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | Fiberise Fit',
  description:
    'Learn about Fiberise Fit cancellation, return and refund policies including eligibility, timelines and process for hassle-free refunds.',
}

export default function CancellationRefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef1f4] to-slate-50 pt-28">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-white p-10 rounded-2xl shadow-2xl mb-7" style={{ backgroundColor: '#102333' }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Refund, Return, Replacement &amp; Cancellation Policy
          </h1>
          <p className="text-gray-300">Last updated on Mar 10th 2026</p>
        </div>

        {/* Policy Body */}
        <div className="bg-white rounded-2xl p-7 mb-6 border border-gray-200 shadow-lg shadow-black/5 space-y-6">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: 'rgba(16, 35, 51, 0.12)', color: '#102333' }}
          >
            FIBERISE FIT PRIVATE LIMITED
          </span>

          <p className="text-gray-800 leading-relaxed">
            This Refund, Return, Replacement and Cancellation Policy (hereinafter referred to as the{' '}
            <strong>&quot;Policy&quot;</strong>) governs the terms under which products purchased through the website,
            application, or any other digital or physical sales channel operated by FIBERISE FIT PRIVATE LIMITED, its
            affiliates, subsidiaries, representatives, authorized distributors, logistics partners, or agents
            (collectively referred to as the <strong>&quot;Company&quot;, &quot;We&quot;, &quot;Us&quot;,</strong> or{' '}
            <strong>&quot;Our&quot;</strong>) may be cancelled, returned, replaced, or refunded.
          </p>

          <p className="text-gray-800 leading-relaxed">
            By placing an order with the Company, the purchaser, customer, or end user (hereinafter referred to as the{' '}
            <strong>&quot;Customer&quot;, &quot;User&quot;,</strong> or <strong>&quot;Buyer&quot;</strong>) agrees to be
            legally bound by the terms and conditions contained herein.
          </p>

          {/* 1. Order Cancellation */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">1. ORDER CANCELLATION</h2>
            <p className="text-gray-800">
              1.1 A request for cancellation of an order shall be considered only if such request is made within the
              same calendar day on which the order has been placed, and prior to the initiation of the dispatch or
              fulfillment process.
            </p>
            <p className="text-gray-800">
              1.2 The Company reserves the sole and absolute discretion to accept or reject any cancellation request.
            </p>
            <p className="text-gray-800">1.3 Cancellation requests may not be entertained in circumstances including but not limited to the following:</p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>The order has already been processed by the Company&apos;s logistics, warehouse, or dispatch teams.</li>
              <li>The order has been communicated to or accepted by third-party vendors, merchants, manufacturers, distributors, or logistics providers.</li>
              <li>The shipment has already been scheduled, packed, or dispatched.</li>
              <li>The product falls under limited inventory, promotional, or special campaign categories.</li>
            </ul>
            <p className="text-gray-800">
              1.4 Once an order enters the fulfillment, packaging, or shipping stage, the order shall be deemed
              non-cancellable.
            </p>
            <p className="text-gray-800">
              1.5 The Company shall not be liable for any losses, damages, opportunity costs, or consequential damages
              arising out of the Customer&apos;s inability to cancel an order.
            </p>
          </section>

          {/* 2. Return Policy */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">2. RETURN POLICY</h2>
            <p className="text-gray-800">
              2.1 Due to the nature of the Company&apos;s products, including but not limited to nutritional
              supplements, consumable goods, health products, and hygiene-sensitive products, the Company maintains a
              strict no-return policy, except in cases expressly mentioned under this Policy.
            </p>
            <p className="text-gray-800">2.2 A return request shall only be considered in circumstances where:</p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>The product received is physically damaged at the time of delivery, or</li>
              <li>The product received is materially different from the product ordered, subject to verification.</li>
            </ul>
            <p className="text-gray-800">
              2.3 Any request for return must be made within the same day (24 hours) of receiving the product.
            </p>
            <p className="text-gray-800">
              2.4 To initiate a return request, the Customer must notify the Company&apos;s customer service through the
              official communication channels provided on the website.
            </p>
            <p className="text-gray-800">2.5 The Customer must provide adequate evidence including but not limited to:</p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Photographs of the product</li>
              <li>Photographs of the outer packaging</li>
              <li>Photographs of the shipping label</li>
              <li>A description of the issue</li>
            </ul>
            <p className="text-gray-800">
              2.6 Failure to report such issues within the prescribed timeframe shall render the product deemed
              accepted in good condition, and no return, replacement, or refund shall be entertained thereafter.
            </p>
            <p className="text-gray-800">
              2.7 Products shall not be eligible for return under circumstances including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Change of mind by the Customer</li>
              <li>Product dissatisfaction without defect</li>
              <li>Taste preference or personal expectation mismatch</li>
              <li>Minor packaging variations</li>
              <li>Improper storage or handling after delivery</li>
              <li>Products that have been opened, used, tampered with, or partially consumed</li>
            </ul>
          </section>

          {/* 3. Replacement Policy */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">3. REPLACEMENT POLICY</h2>
            <p className="text-gray-800">
              3.1 In the event that the Company determines, upon investigation, that the product delivered to the
              Customer was damaged during transit or materially defective, the Company may, at its sole discretion,
              offer a replacement of the same product or a product of similar nature and value.
            </p>
            <p className="text-gray-800">
              3.2 The Company reserves the right to determine whether a replacement shall be issued after internal
              review of the complaint.
            </p>
            <p className="text-gray-800">3.3 Replacement may be denied in circumstances where:</p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>The damage appears to have occurred after delivery</li>
              <li>The product has been opened or used</li>
              <li>The complaint lacks sufficient evidence</li>
              <li>The complaint is raised beyond the permitted reporting period</li>
            </ul>
            <p className="text-gray-800">
              3.4 The decision of the Company in relation to replacement shall be final and binding.
            </p>
          </section>

          {/* 4. Product Description Disclaimer */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">4. PRODUCT DESCRIPTION DISCLAIMER</h2>
            <p className="text-gray-800">
              4.1 The Company endeavors to ensure that all product descriptions, images, specifications, and
              information provided on the website are accurate and up to date.
            </p>
            <p className="text-gray-800">4.2 However, the Company does not warrant that:</p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Product descriptions are entirely error-free</li>
              <li>Images perfectly represent the physical product</li>
              <li>Packaging design remains identical across manufacturing batches</li>
            </ul>
            <p className="text-gray-800">
              4.3 Minor variations in color, packaging, labeling, typography, or aesthetic presentation shall not
              constitute grounds for replacement, return, or refund.
            </p>
          </section>

          {/* 5. Manufacturer Warranty */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">5. MANUFACTURER WARRANTY</h2>
            <p className="text-gray-800">
              5.1 Certain products sold through the Company may carry manufacturer warranties.
            </p>
            <p className="text-gray-800">
              5.2 In such cases, customers shall be required to directly contact the respective manufacturer or
              authorized service provider for any claims related to warranty, repair, replacement, or service.
            </p>
            <p className="text-gray-800">
              5.3 The Company shall not be responsible for processing manufacturer warranty claims unless expressly
              stated.
            </p>
          </section>

          {/* 6. Refund Policy */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">6. REFUND POLICY</h2>
            <p className="text-gray-800">
              6.1 Refunds shall be issued only in cases where the Company determines that a refund is appropriate,
              based on its internal review and investigation.
            </p>
            <p className="text-gray-800">6.2 Refunds shall not be granted for:</p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Customer dissatisfaction</li>
              <li>Incorrect product expectations</li>
              <li>Delay in delivery due to logistics partners</li>
              <li>Improper usage of the product</li>
              <li>Personal health outcomes or expectations</li>
            </ul>
            <p className="text-gray-800">
              6.3 In cases where a refund is approved by the Company, the refund shall be processed within 7 to 14
              business days from the date of approval.
            </p>
            <p className="text-gray-800">
              6.4 Refunds shall be credited only through the original mode of payment, unless otherwise required by
              applicable laws or payment gateway regulations.
            </p>
            <p className="text-gray-800">
              6.5 The Company shall not be responsible for delays caused by payment gateway processing timelines,
              banking institutions, or technical failures in financial networks.
            </p>
          </section>

          {/* 7. Shipping & Delivery Disclaimer */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">7. SHIPPING AND DELIVERY DISCLAIMER</h2>
            <p className="text-gray-800">
              7.1 Delivery timelines provided on the website are estimated timelines only.
            </p>
            <p className="text-gray-800">7.2 The Company shall not be liable for delays caused by:</p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Courier service providers</li>
              <li>Weather conditions</li>
              <li>Government restrictions</li>
              <li>Force majeure events</li>
              <li>Operational disruptions beyond the Company&apos;s control</li>
            </ul>
            <p className="text-gray-800">
              7.3 Delays in shipping or delivery shall not constitute grounds for cancellation, refund, or compensation.
            </p>
          </section>

          {/* 8. Fraudulent Claims */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">8. FRAUDULENT CLAIMS</h2>
            <p className="text-gray-800">
              8.1 The Company reserves the right to reject any claim suspected to be fraudulent, misleading, or abusive.
            </p>
            <p className="text-gray-800">
              8.2 Customers engaging in repeated refund or replacement requests may be restricted or permanently banned
              from purchasing from the platform.
            </p>
            <p className="text-gray-800">
              8.3 The Company reserves the right to pursue legal action in cases involving fraudulent claims or misuse
              of the Policy.
            </p>
          </section>

          {/* 9. Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">9. LIMITATION OF LIABILITY</h2>
            <p className="text-gray-800">
              9.1 To the maximum extent permitted under applicable law, the Company shall not be liable for any
              indirect, incidental, consequential, special, or punitive damages arising out of the purchase, usage, or
              inability to use the products.
            </p>
            <p className="text-gray-800">
              9.2 The Company&apos;s total liability, if any, shall not exceed the purchase price of the product in
              question.
            </p>
          </section>

          {/* 10. Force Majeure */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">10. FORCE MAJEURE</h2>
            <p className="text-gray-800">
              The Company shall not be held liable for failure or delay in fulfilling obligations under this Policy
              where such failure arises due to events beyond its reasonable control, including but not limited to acts
              of God, natural disasters, war, civil unrest, pandemics, strikes, governmental actions, or logistics
              disruptions.
            </p>
          </section>

          {/* 11. Policy Modifications */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">11. POLICY MODIFICATIONS</h2>
            <p className="text-gray-800">
              The Company reserves the right to modify, amend, update, or replace this Policy at any time without prior
              notice. The updated Policy shall become effective immediately upon being published on the Company&apos;s
              website.
            </p>
          </section>

          {/* 12. Governing Law & Jurisdiction */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">12. GOVERNING LAW AND JURISDICTION</h2>
            <p className="text-gray-800">
              This Policy shall be governed by and construed in accordance with the laws of India. Any disputes arising
              out of or in connection with this Policy shall be subject to the exclusive jurisdiction of the courts
              located in Delhi, India.
            </p>
          </section>
        </div>

        {/* Disclaimer */}
        <div className="rounded-2xl p-6 mb-7 border" style={{ background: 'linear-gradient(to bottom right, #f8fafc, rgba(16, 35, 51, 0.06))', borderColor: 'rgba(16, 35, 51, 0.2)' }}>
          <p className="text-sm text-gray-600 leading-relaxed">
            Disclaimer: The above content is created at FIBERISE FIT PRIVATE LIMITED&apos;s sole discretion. Razorpay shall not be liable for any content provided here and shall not be responsible for any claims and liability that may arise due to merchant&apos;s non-adherence to it.
          </p>
        </div>

        <footer className="mt-7 py-6 rounded-2xl text-center text-sm text-gray-300" style={{ backgroundColor: '#102333' }}>
          © FIBERISE FIT PRIVATE LIMITED — All rights reserved
        </footer>
      </div>
    </div>
  )
}
