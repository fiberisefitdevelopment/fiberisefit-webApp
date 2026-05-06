import type { Metadata } from 'next'
import Script from 'next/script'
import { Montserrat, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import { AuthProvider } from '@/contexts/AuthContext'
import ThirdPartyScripts from '../components/ThirdPartyScripts'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-serif',
  display: 'swap',
})

const SITE_URL = 'https://fiberisefit.com'
const OG_IMAGE = `${SITE_URL}/icons/I%20Mark%20-%20BC%2001.png`
const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Fiberise Fit',
  alternateName: 'fiberisefit',
  url: 'https://fiberisefit.com/',
  logo: 'https://fiberisefit.com/_next/image?url=%2Ffiberisefit%20dark%20logo.png&w=1920&q=75',
  sameAs: [
    'https://www.instagram.com/fiberisefit',
    'https://www.linkedin.com/company/fiberise-fit/',
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Fiberise Fit',
  description: 'Smart health ecosystem powered by AI & innovation.',
  authors: [{ name: 'Fiberise Fit' }],
  publisher: 'Fiberise Fit',
  verification: {
    google: '_611OG553fYDgD9ySG0n8u91QLMwxt2q9ZgaFr-TdEg',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icons/I Mark - BC 01.png',
  },
  openGraph: {
    title: 'Fiberise Fit',
    description: 'Smart health ecosystem powered by AI & innovation.',
    url: SITE_URL,
    siteName: 'Fiberise Fit',
    type: 'website',
    images: [{ url: OG_IMAGE, alt: 'Fiberise Fit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fiberise Fit',
    description: 'Smart health ecosystem powered by AI & innovation.',
    images: [OG_IMAGE],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        {/* Google Tag Manager — loads immediately for accurate tracking */}
        <Script id="gtm-head" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-W8MBF3JG');`}
        </Script>
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
        {/* Organization structured data — zero JS cost as inline JSON */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
        />
      </head>
      <body className={montserrat.className} suppressHydrationWarning>
        {/* GTM noscript fallback — zero JS cost */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W8MBF3JG"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
        </AuthProvider>
        {/* ALL third-party scripts load ONLY after user interaction */}
        <ThirdPartyScripts />
      </body>
    </html>
  )
}
