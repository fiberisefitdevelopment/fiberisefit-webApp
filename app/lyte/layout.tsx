import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LYTE - Engineered for Human Potential | Premium Health Monitoring',
  description: 'LYTE. Engineered for Human Potential. Precision in every moment. Data that moves you. The most advanced health monitoring device for elite performance.',
  alternates: {
    canonical: '/lyte',
  },
  openGraph: {
    title: 'LYTE - Engineered for Human Potential | Premium Health Monitoring',
    description: 'LYTE. Engineered for Human Potential. Precision in every moment. Data that moves you. The most advanced health monitoring device for elite performance.',
    url: '/lyte',
    type: 'website',
  },
  twitter: {
    title: 'LYTE - Engineered for Human Potential | Premium Health Monitoring',
    description: 'LYTE. Engineered for Human Potential. Precision in every moment. Data that moves you. The most advanced health monitoring device for elite performance.',
    card: 'summary_large_image',
  },
}

export default function LyteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
