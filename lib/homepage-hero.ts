export const HERO_SLIDES = [
  {
    key: 'starter',
    productSearch: 'starter pack',
    slug: 'starter-pack',
    desktopImage: '/banners/optimized/Starter_Pack_Banner_Desktop.webp',
    mobileImage: '/banners/optimized/Starter_PACK_Banner_Mobile.webp',
    alt: 'Starter Pack - Feel Lighter in 7 Days',
    btnClass: 'bg-[#1a365d] text-white hover:bg-[#122844] focus:ring-[#1a365d]',
    btnText: 'Order Now',
  },
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
