import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | Fiberise Fit',
  description:
    'Get details on Fiberise Fit shipping timelines, delivery process and order tracking for a smooth and reliable shopping experience.',
}

export default function ShippingDeliveryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef1f4] to-slate-50 pt-28">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-white p-10 rounded-2xl shadow-2xl mb-7" style={{ backgroundColor: '#102333' }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Shipping &amp; Delivery Policy
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
            This Shipping and Delivery Policy (hereinafter referred to as the <strong>&quot;Policy&quot;</strong>)
            outlines the terms and conditions governing the shipment, handling, dispatch, delivery, and receipt of
            orders placed through the website, mobile application, or any other authorized sales channels operated by
            FIBERISE FIT PRIVATE LIMITED, its affiliates, subsidiaries, authorized distributors, logistics partners, or
            representatives (collectively referred to as the <strong>&quot;Company&quot;, &quot;We&quot;, &quot;Us&quot;,</strong> or{' '}
            <strong>&quot;Our&quot;</strong>).
          </p>

          <p className="text-gray-800 leading-relaxed">
            By placing an order with the Company, the customer, purchaser, or end user (hereinafter referred to as the{' '}
            <strong>&quot;Customer&quot;, &quot;Buyer&quot;,</strong> or <strong>&quot;User&quot;</strong>) acknowledges
            and agrees to the terms set forth in this Policy.
          </p>

          {/* 1. Applicability */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">1. APPLICABILITY OF SHIPPING POLICY</h2>
            <p className="text-gray-800">
              1.1 This Policy applies to all domestic orders placed through the Company&apos;s official website, digital
              platforms, marketplaces, or authorized sales representatives within the territory of the Republic of India.
            </p>
            <p className="text-gray-800">
              1.2 The Company reserves the right to modify, amend, or update this Policy at any time without prior
              notice. The revised Policy shall become effective immediately upon publication on the Company&apos;s
              website or digital platform.
            </p>
          </section>

          {/* 2. Shipping Partners */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">2. SHIPPING PARTNERS AND MODE OF DELIVERY</h2>
            <p className="text-gray-800">
              2.1 For domestic buyers, orders shall be shipped through registered and reputable domestic courier
              companies, logistics partners, or postal authorities as deemed appropriate by the Company.
            </p>
            <p className="text-gray-800">
              2.2 The selection of the courier partner, logistics service provider, or postal authority shall be at the
              sole and absolute discretion of the Company.
            </p>
            <p className="text-gray-800">
              2.3 The Company may use third-party logistics providers including but not limited to courier companies,
              freight operators, shipping aggregators, or postal services to facilitate delivery.
            </p>
            <p className="text-gray-800">
              2.4 The Customer acknowledges that the Company acts solely as the shipper and consignor, and the actual
              transportation of goods is carried out by independent third-party logistics providers.
            </p>
          </section>

          {/* 3. Order Processing & Dispatch */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">3. ORDER PROCESSING AND DISPATCH TIMELINES</h2>
            <p className="text-gray-800">
              3.1 Orders placed through the Company&apos;s platforms shall be processed within one (1) to three (3)
              business days from the date of order confirmation and successful payment authorization, unless otherwise
              specified at the time of order placement.
            </p>
            <p className="text-gray-800">3.2 Dispatch timelines may vary depending on factors including but not limited to:</p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Product availability</li>
              <li>Inventory levels</li>
              <li>Operational considerations</li>
              <li>Logistics partner availability</li>
              <li>Regional restrictions or serviceability</li>
            </ul>
            <p className="text-gray-800">
              3.3 The Company shall endeavor to dispatch the order within the aforementioned timeframe; however, the
              Company shall not be liable for any delay caused due to circumstances beyond its reasonable control.
            </p>
            <p className="text-gray-800">
              3.4 In certain cases, dispatch timelines may be extended where the delivery date has been mutually agreed
              upon at the time of order confirmation.
            </p>
            <p className="text-gray-800">
              3.5 Once the order has been handed over to the courier company or postal authorities, the shipment shall
              be deemed successfully dispatched.
            </p>
          </section>

          {/* 4. Delivery Timelines */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">4. DELIVERY TIMELINES</h2>
            <p className="text-gray-800">
              4.1 Delivery timelines may vary depending on the Customer&apos;s delivery location, serviceability of the
              region, courier partner schedules, and external factors.
            </p>
            <p className="text-gray-800">
              4.2 Estimated delivery timelines displayed on the website are indicative and non-binding.
            </p>
            <p className="text-gray-800">
              4.3 The Company does not guarantee exact delivery dates and shall not be held responsible for delays
              caused by:
            </p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Courier company delays</li>
              <li>Postal service disruptions</li>
              <li>Weather conditions</li>
              <li>Government regulations</li>
              <li>Public holidays</li>
              <li>Transportation disruptions</li>
              <li>Natural disasters</li>
              <li>Force majeure events</li>
            </ul>
            <p className="text-gray-800">
              4.4 The Company&apos;s responsibility is limited to handing over the consignment to the courier partner
              within the dispatch timeline, and any delays thereafter shall be solely attributable to the logistics
              provider.
            </p>
          </section>

          {/* 5. Delivery Address Responsibility */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">5. DELIVERY ADDRESS RESPONSIBILITY</h2>
            <p className="text-gray-800">
              5.1 All orders shall be delivered to the address provided by the Customer at the time of placing the
              order.
            </p>
            <p className="text-gray-800">
              5.2 The Customer shall be solely responsible for ensuring that the shipping address entered during
              checkout is accurate, complete, and serviceable.
            </p>
            <p className="text-gray-800">
              5.3 The Company shall not be liable for delivery failures or delays arising due to:
            </p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Incorrect or incomplete addresses</li>
              <li>Incorrect postal codes</li>
              <li>Unreachable contact numbers</li>
              <li>Inaccessible delivery locations</li>
            </ul>
            <p className="text-gray-800">
              5.4 In cases where delivery fails due to incorrect information provided by the Customer, the Company
              reserves the right to cancel the order without refund of shipping charges.
            </p>
          </section>

          {/* 6. Delivery Confirmation */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">6. DELIVERY CONFIRMATION</h2>
            <p className="text-gray-800">6.1 Upon successful delivery of the order, the delivery shall be considered complete once:</p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>The courier partner marks the shipment as delivered, or</li>
              <li>The package is received by the Customer, authorized recipient, or building security personnel.</li>
            </ul>
            <p className="text-gray-800">6.2 Delivery confirmation may be communicated through:</p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Email notification</li>
              <li>SMS notification</li>
              <li>Courier tracking updates</li>
            </ul>
            <p className="text-gray-800">
              6.3 Delivery of services or order confirmation may be sent to the registered email address or phone number
              provided by the Customer at the time of registration or order placement.
            </p>
          </section>

          {/* 7. Failed Delivery Attempts */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">7. FAILED DELIVERY ATTEMPTS</h2>
            <p className="text-gray-800">
              7.1 In cases where the courier partner is unable to complete delivery due to the Customer&apos;s
              unavailability, incorrect address, or refusal to accept the shipment, the courier partner may attempt
              re-delivery as per their internal policies.
            </p>
            <p className="text-gray-800">
              7.2 If delivery fails after multiple attempts, the shipment may be returned to the Company&apos;s
              warehouse.
            </p>
            <p className="text-gray-800">7.3 In such cases:</p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>The Company reserves the right to cancel the order.</li>
              <li>Shipping charges and logistics costs may be deducted from the refund amount, if any.</li>
            </ul>
          </section>

          {/* 8. Shipping Damage or Tampering */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">8. SHIPPING DAMAGE OR TAMPERING</h2>
            <p className="text-gray-800">
              8.1 Customers are advised to inspect the package at the time of delivery.
            </p>
            <p className="text-gray-800">
              8.2 If the shipment appears visibly damaged, tampered with, or compromised, the Customer must:
            </p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Refuse acceptance of the delivery; or</li>
              <li>Record clear photographic or video evidence at the time of receiving the shipment.</li>
            </ul>
            <p className="text-gray-800">
              8.3 Any complaint regarding damaged shipments must be reported to the Company&apos;s customer support
              within 24 hours of delivery.
            </p>
            <p className="text-gray-800">
              8.4 Failure to report such issues within the prescribed timeframe shall result in the shipment being
              deemed accepted in satisfactory condition.
            </p>
          </section>

          {/* 9. Risk & Title Transfer */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">9. RISK AND TITLE TRANSFER</h2>
            <p className="text-gray-800">
              9.1 The risk of loss or damage to the product shall transfer to the Customer once the shipment has been
              successfully delivered to the provided address.
            </p>
            <p className="text-gray-800">
              9.2 Ownership of the product shall transfer to the Customer upon full payment and delivery of the goods.
            </p>
            <p className="text-gray-800">
              9.3 The Company shall not be responsible for loss, theft, or damage occurring after delivery has been
              completed.
            </p>
          </section>

          {/* 10. Shipping Charges */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">10. SHIPPING CHARGES</h2>
            <p className="text-gray-800">
              10.1 Shipping charges, if applicable, shall be clearly displayed during checkout.
            </p>
            <p className="text-gray-800">
              10.2 The Company reserves the right to modify shipping charges based on:
            </p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Order value</li>
              <li>Delivery location</li>
              <li>Promotional offers</li>
              <li>Logistics partner pricing</li>
            </ul>
            <p className="text-gray-800">
              10.3 Shipping charges, once paid, are non-refundable unless the order is cancelled by the Company prior
              to dispatch.
            </p>
          </section>

          {/* 11. Force Majeure */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">11. FORCE MAJEURE</h2>
            <p className="text-gray-800">
              11.1 The Company shall not be liable for failure or delay in shipping or delivery due to events beyond its
              reasonable control, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              <li>Natural disasters</li>
              <li>Floods, earthquakes, or storms</li>
              <li>War or civil unrest</li>
              <li>Government restrictions</li>
              <li>Lockdowns or pandemics</li>
              <li>Transportation disruptions</li>
              <li>Labor strikes</li>
            </ul>
            <p className="text-gray-800">
              11.2 In such circumstances, the Company shall make reasonable efforts to fulfill the order as soon as
              practicable.
            </p>
          </section>

          {/* 12. Customer Support */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">12. CUSTOMER SUPPORT</h2>
            <p className="text-gray-800">
              For any issues related to shipping, delivery, or order tracking, customers may contact the Company through
              the following channels:
            </p>
            <p className="text-gray-800">
              <strong>Customer Support Number:</strong> +91-7070705026
            </p>
            <p className="text-gray-800">
              <strong>Email:</strong> support@fiberisefit.com
            </p>
            <p className="text-gray-800">
              Customer support requests shall be handled during the Company&apos;s official business hours.
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
