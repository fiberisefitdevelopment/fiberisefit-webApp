import Link from 'next/link'
import type { Metadata } from 'next'

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Fiberise Fit',
  image: 'https://fiberisefit.com/_next/image?url=%2Ffiberisefit%20dark%20logo.png&w=1920&q=75',
  '@id': '',
  url: 'https://fiberisefit.com/policies/contact',
  telephone: '7070705026',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '731/508 S/F, PLOT NO.7 BLOCK 56 DB GUPTA ROAD Karol Bagh Central Delhi',
    addressLocality: 'New Delhi',
    postalCode: '110005',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://www.instagram.com/fiberisefit',
    'https://www.linkedin.com/company/fiberise-fit/',
  ],
}

export const metadata: Metadata = {
  title: 'Contact Us | Fiberise Fit Support & Help',
  description:
    'Get in touch with Fiberise Fit for support, queries or assistance. Contact our team for quick help with products, orders or services.',
}

export default function ContactPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef1f4] to-slate-50 pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
      />
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-white p-10 rounded-2xl shadow-2xl mb-7" style={{ backgroundColor: '#102333' }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact us</h1>
          <p className="text-gray-300">Last updated on Oct 30th 2025</p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl p-7 mb-6 border border-gray-200 shadow-lg shadow-black/5">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3" style={{ backgroundColor: 'rgba(16, 35, 51, 0.12)', color: '#102333' }}>
            Contact Information
          </span>
          <p className="text-gray-800 leading-relaxed mb-6">You may contact us using the information below:</p>
          <ul className="list-none space-y-3 text-gray-800">
            <li><strong>Merchant Legal entity name:</strong> FIBERISE FIT PRIVATE LIMITED</li>
            <li><strong>Registered Address:</strong> 731/508 S/F, PLOT NO.7 BLOCK 56 DB GUPTA ROAD Karol Bagh Central Delhi New Delhi Delhi India 110005 Sat Nagar SO DELHI 110005</li>
            <li><strong>Telephone No:</strong> 7070705026</li>
            <li>
              <strong>WhatsApp:</strong>{' '}
              <a
                href="https://wa.me/918679036275"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 align-middle text-gray-800 hover:opacity-80 transition-opacity"
                aria-label="Chat on WhatsApp at 8679036275"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-6 h-6 flex-shrink-0"
                  aria-hidden
                >
                  <path
                    fill="#25D366"
                    d="M24 4C12.95 4 4 12.95 4 24c0 4.24 1.1 8.22 3.03 11.67L4 44l8.56-2.94C15.82 42.9 19.79 44 24 44c11.05 0 20-8.95 20-20S35.05 4 24 4z"
                  />
                  <path
                    fill="#fff"
                    d="M35.47 29.82c-.49-.25-2.89-1.43-3.34-1.59-.45-.16-.78-.25-1.11.25-.33.49-1.28 1.59-1.57 1.92-.29.33-.58.37-1.07.12-.49-.25-2.05-.76-3.9-2.43-1.44-1.28-2.41-2.86-2.69-3.35-.29-.49-.03-.76.21-1 .22-.22.49-.58.74-.87.25-.29.33-.49.49-.82.16-.33.08-.62-.04-.87-.12-.25-1.11-2.67-1.52-3.66-.4-.95-.81-.82-1.11-.84-.29-.01-.62-.01-.95-.01-.33 0-.87.12-1.33.62-.45.49-1.74 1.7-1.74 4.15 0 2.45 1.78 4.82 2.03 5.15.25.33 3.5 5.35 8.48 7.5 1.19.51 2.12.82 2.84 1.05 1.19.38 2.28.33 3.14.2.96-.14 2.89-1.18 3.3-2.32.41-1.14.41-2.12.29-2.32-.12-.2-.45-.33-.94-.58z"
                  />
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M24 8.5c8.56 0 15.5 6.94 15.5 15.5S32.56 39.5 24 39.5c-3.58 0-6.88-1.22-9.5-3.27l-6.94 1.89 1.85-6.76C7.22 30.88 8.5 27.58 8.5 24c0-8.56 6.94-15.5 15.5-15.5zm0 31c3.31 0 6.42-1.03 8.96-2.79l6.54 1.71-1.74-6.37C38.97 30.42 40 27.32 40 24c0-8.82-7.18-16-16-16S8 15.18 8 24s7.18 16 16 16z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[#128C7E] font-medium underline-offset-2 hover:underline">
                  8679036275
                </span>
              </a>
            </li>
            <li><strong>E-Mail ID:</strong> support@fiberisefit.com</li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="rounded-2xl p-6 mb-7 border" style={{ background: 'linear-gradient(to bottom right, #f8fafc, rgba(16, 35, 51, 0.06))', borderColor: 'rgba(16, 35, 51, 0.2)' }}>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Disclaimer: The above content is created at FIBERISE FIT PRIVATE LIMITED&apos;s sole discretion. Razorpay shall not be liable for any content provided here and shall not be responsible for any claims and liability that may arise due to merchant&apos;s non-adherence to it.
          </p>
          <Link href="/contact" className="font-medium underline" style={{ color: '#102333' }}>
            Go to Contact page →
          </Link>
        </div>

        <footer className="mt-7 py-6 rounded-2xl text-center text-sm text-gray-300" style={{ backgroundColor: '#102333' }}>
          © FIBERISE FIT PRIVATE LIMITED — All rights reserved
        </footer>
      </div>
    </div>
  )
}
