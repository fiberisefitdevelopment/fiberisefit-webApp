import Link from 'next/link'
import Image from 'next/image'
import NewsletterForm from '@/components/NewsletterForm'
import PaymentIcons from '@/components/PaymentIcons'

export default function Footer() {
  const footerLinks = {
    products: [
      { name: 'Starter Pack', href: '/products/starter-pack' },
      { name: 'Transformation Pack', href: '/products/transformation-pack' },
      { name: 'Ultimate pack', href: '/products/ultimate-pack' },
      { name: 'LYTE', href: '/products/lyte' },
      { name: 'Blog', href: '/blogs' },
    ],
    social: [
      { name: 'Instagram', href: 'https://www.instagram.com/fiberisefit?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
      { name: 'LinkedIn', href: 'https://www.linkedin.com/company/fiberise-fit/' },
    ],
  }

  return (
    <footer className="bg-[#000000] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Contact Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-6">
              Contact Us
            </h3>
            <div className="space-y-3 text-sm text-gray-400">
              <p>
                <span className="text-white font-medium">Address:</span> 731/508 S/F, PLOT NO.7 BLOCK 56 DB
                GUPTA ROAD Karol Bagh Central Delhi, New Delhi, Delhi, India 110005 Sat Nagar SO DELHI
                110005
              </p>
              <p>
                <span className="text-white font-medium">Phone:</span>{' '}
                <a href="tel:+917070705026" className="hover:text-white transition-colors">
                  7070705026
                </a>
              </p>
              <p>
                <span className="text-white font-medium">Email:</span>{' '}
                <a href="mailto:support@fiberisefit.com" className="hover:text-white transition-colors">
                  support@fiberisefit.com
                </a>
              </p>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <a href="https://www.instagram.com/fiberisefit?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/fiberise-fit/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            <div className="mt-8 hidden md:block md:w-[150%] max-w-none relative z-10">
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3">
                Newsletter
              </h4>
              <p className="text-xs text-gray-400 mb-3">
                Get wellness insights, product updates, and exclusive offers in your inbox.
              </p>
              <NewsletterForm />
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-6">
              Products
            </h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

          </div>

          {/* Social Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-6">
              Social
            </h3>
            <ul className="space-y-3">
              {footerLinks.social.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Text Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-6">
              Legal
            </h3>
            <ul className="space-y-3 mb-6">
              <li>
                <Link
                  href="/lyte/privacy-policy"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  LYTE Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/terms"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/privacy-policy"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/shipping-delivery"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/cancellation-refund"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/medical-disclaimer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Health, Medical &amp; Supplement Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/contact"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap.xml"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Sitemap
                </Link>
              </li>
            </ul>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              We&apos;re here to help and ensure your journey with Fiberise is seamless and enjoyable. Got ideas or questions about sections? Need a tweak to make it just perfect?
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              <span className="text-white font-medium">Reach out to us!</span> Our friendly support team is ready to bring your vision to life. 🌿
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Left - Social Icons */}
            <div className="flex items-center gap-6">
              <a href="https://www.instagram.com/fiberisefit?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/fiberise-fit/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>

            {/* Newsletter above payment icons on mobile only */}
            <div className="w-full max-w-xl md:hidden">
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3">
                Newsletter
              </h4>
              <p className="text-xs text-gray-400 mb-3">
                Get wellness insights, product updates, and exclusive offers in your inbox.
              </p>
              <NewsletterForm />
            </div>

            {/* Right - Payment Icons (UPI first, then card brands) */}
            <PaymentIcons
              className="justify-center"
              iconClassName="w-9 h-6 object-contain flex-shrink-0"
            />
          </div>
        </div>
      </div>

      {/* Large Brand Logo */}
      <div className="overflow-hidden pt-8 md:pt-12 flex justify-center px-4">
        <div className="relative w-full max-w-6xl h-32 md:h-44 lg:h-56 opacity-1000">
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

