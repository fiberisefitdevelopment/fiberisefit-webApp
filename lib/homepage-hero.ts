export const HERO_SLIDES = [
  {
    key: 'transformation',
    productSearch: 'transformation pack',
    slug: 'transformation-pack',
    desktopImage: 'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/transformation-pack-desktop.webp?v=1795156864',
    mobileImage: 'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/transformation-pack-mobile.webp?v=1795156864',
    alt: 'Transformation Pack - Weight Loss & Cravings Control',
    btnClass: 'bg-[#3b3836] text-white hover:bg-black focus:ring-black',
    btnText: 'Order Now',
  },
  {
    key: 'ultimate',
    productSearch: 'ultimate pack',
    slug: 'ultimate-pack',
    desktopImage: 'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/ultimate-pack-desktop.webp?v=1795156864',
    mobileImage: 'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/ultimate-pack-mobile.webp?v=1795156864',
    alt: 'Ultimate Pack - Complete Weight Management Ecosystem',
    btnClass: 'bg-[#2b5844] text-white hover:bg-[#1f4031] focus:ring-[#2b5844]',
    btnText: 'Order Now',
  },
] as const

export type HeroSlide = (typeof HERO_SLIDES)[number]
