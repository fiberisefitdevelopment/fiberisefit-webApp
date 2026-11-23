import Link from 'next/link'
import Image from 'next/image'
import PaymentIcons from '@/components/PaymentIcons'

const INSTAGRAM_HREF =
  'https://www.instagram.com/fiberisefit?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
const LINKEDIN_HREF = 'https://www.linkedin.com/company/fiberise-fit/'

export default function Footer({
  mobileStickyClearance = false,
}: {
  mobileStickyClearance?: boolean
}) {
  const footerLinks = {
    products: [
      { name: 'Transformation Pack', href: '/products/transformation-pack' },
      { name: 'Ultimate pack', href: '/products/ultimate-pack' },
      { name: 'Elite pack', href: '/products/elite-pack' },
      { name: 'LYTE', href: '/products/lyte' },
      { name: 'Blog', href: '/blogs' },
    ],
    social: [
      { name: 'Instagram', href: INSTAGRAM_HREF },
      { name: 'LinkedIn', href: LINKEDIN_HREF },
    ],
  }

  return (
    <footer
      className={`bg-[#000000] text-white ${
        mobileStickyClearance ? 'pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:pb-0' : ''
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 pb-4 pt-10 sm:px-6 md:pb-4 md:pt-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider">Contact Us</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <p>
                <span className="font-medium text-white">Address:</span> Pride Corporate Park,
                Building A-153, Sector 136, Noida, Uttar Pradesh – 201304
              </p>
              <p>
                <span className="font-medium text-white">Phone:</span>{' '}
                <a href="tel:+917070705026" className="transition-colors hover:text-white">
                  7070705026
                </a>
              </p>
              <p>
                <span className="font-medium text-white">Email:</span>{' '}
                <a href="mailto:support@fiberisefit.com" className="transition-colors hover:text-white">
                  support@fiberisefit.com
                </a>
              </p>
              <p>
                <Link href="/track" className="text-white transition-colors hover:text-gray-300">
                  Track your order
                </Link>
              </p>
            </div>
            <div className="mt-5 flex flex-col items-start gap-3">
              <div className="flex items-center gap-4">
                <a
                  href={INSTAGRAM_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href={LINKEDIN_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                  aria-label="LinkedIn"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
              <PaymentIcons
                className="justify-start"
                iconClassName="w-9 h-6 object-contain flex-shrink-0"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider">Products</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider">Social</h3>
            <ul className="space-y-3">
              {footerLinks.social.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/lyte/privacy-policy"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  LYTE Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/terms"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/privacy-policy"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/shipping-delivery"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/cancellation-refund"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/medical-disclaimer"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Health, Medical &amp; Supplement Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/contact"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center overflow-hidden px-4 pt-2 md:pt-3">
        <div className="relative h-28 w-full max-w-6xl md:h-36 lg:h-44">
          <Image
            src="/fiberise fit light logo.png"
            alt="Fiberise Fit Footer Logo"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </footer>
  )
}
