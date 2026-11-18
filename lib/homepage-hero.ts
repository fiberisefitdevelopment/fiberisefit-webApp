export const HERO_SLIDES = [
  {
    key: 'transformation',
    productSearch: 'transformation pack',
    slug: 'transformation-pack',
    desktopImage: '/banners/optimized/transformation-pack-desktop.webp',
    mobileImage: '/banners/optimized/transformation-pack-mobile.webp',
    alt: 'Transformation Pack - Weight Loss & Cravings Control',
    btnClass: 'bg-[#3b3836] text-white hover:bg-black focus:ring-black',
    btnText: 'Order Now',
  },
  {
    key: 'ultimate',
    productSearch: 'ultimate pack',
    slug: 'ultimate-pack',
    desktopImage: '/banners/optimized/ultimate-pack-desktop.webp',
    mobileImage: '/banners/optimized/ultimate-pack-mobile.webp',
    alt: 'Ultimate Pack - Complete Weight Management Ecosystem',
    btnClass: 'bg-[#2b5844] text-white hover:bg-[#1f4031] focus:ring-[#2b5844]',
    btnText: 'Order Now',
  },
] as const

export type HeroSlide = (typeof HERO_SLIDES)[number]
