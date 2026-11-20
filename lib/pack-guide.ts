export const PACK_GUIDE_TOKEN = 'FYB-R8K2-N4Q7'
export const PACK_GUIDE_PATH = '/guide/fyber'
export const PACK_GUIDE_SITE_URL = 'https://fiberisefit.com'
export const PACK_GUIDE_URL = `${PACK_GUIDE_SITE_URL}${PACK_GUIDE_PATH}?k=${PACK_GUIDE_TOKEN}`

export function isPackGuideToken(value: string | string[] | undefined): boolean {
  const token = Array.isArray(value) ? value[0] : value
  return token === PACK_GUIDE_TOKEN
}

export const HOW_TO_USE_STEPS = [
  {
    step: '01',
    title: 'Empty one sachet',
    body: 'Use one FYBER sachet per serving. Do not mix it into hot drinks, milk, or juice — water lets the fibre gel form properly.',
    image: '/specialOfferCarousel/A_30Days_-05.webp',
    imageAlt: 'Opening a FYBER sachet over the pack',
  },
  {
    step: '02',
    title: 'Mix in 200 ml water',
    body: 'Stir until fully dissolved. Drink it 20–60 minutes before your heaviest meal, usually lunch or dinner.',
    image: '/how to use mobile.png',
    imageAlt: 'Pouring FYBER into a glass of water',
  },
  {
    step: '03',
    title: 'Follow with more water',
    body: 'Drink another glass of water after the sachet. Glucomannan needs water to expand gently in the stomach and signal fullness.',
    image: '/how to use mobile.png',
    imageAlt: 'A glass of water after mixing FYBER',
  },
  {
    step: '04',
    title: 'Repeat daily',
    body: 'Take 1–2 sachets a day. Stay well hydrated. No strict diet is required — FYBER works best with whole foods and a regular meal rhythm.',
    image: '/specialOfferCarousel/A_30Days_-04.webp',
    imageAlt: 'FYBER sachets for a daily fibre ritual',
  },
] as const

export const BENEFIT_DIAGRAMS = [
  {
    src: 'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/FIBERISE_A_-09.webp?v=1795155681',
    alt: 'LEAN-X formula: soluble fibre, prebiotics, probiotics, L-Carnitine and L-Tyrosine',
    width: 1600,
    height: 900,
  },
  {
    src: 'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/FIBERISE_A_-10.webp?v=1795155681',
    alt: 'Traditional dieting versus FYBER: energy, metabolism and sustainable weight control',
    width: 1600,
    height: 900,
  },
  {
    src: 'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/FIBERISE_A_-08.webp?v=1795155681',
    alt: 'The science behind FYBER: fullness, cravings, insulin, energy and focus',
    width: 1600,
    height: 900,
  },
] as const

export const BENEFITS = [
  {
    title: 'Smart craving control',
    body: 'Soluble fibre forms a gentle gel, slows gastric emptying, and supports your own GLP-1 satiety pathways — so hunger quiets without stimulants.',
    image: '/cravings-image.png',
    imageAlt: 'FYBER supporting natural GLP-1 satiety signalling',
    fit: 'contain' as const,
  },
  {
    title: 'Portion control that feels natural',
    body: 'Fullness arrives before the plate is empty. Emotional snacking and late-night sweet cravings lose intensity.',
    image: '/ritual/Soft Tones Visual Minimalist Dessert Inspiration.jpg',
    imageAlt: 'Mindful eating and quieter cravings',
    fit: 'cover' as const,
  },
  {
    title: 'Fat metabolism support',
    body: 'LEAN-X® is built around gastric distention, delayed emptying, and metabolic signalling — not harsh appetite suppressants.',
    image: '/ritual/Make_this_image_2k.webp',
    imageAlt: 'Visible shift in body composition',
    fit: 'cover' as const,
  },
  {
    title: 'Safe for daily, long-term use',
    body: 'Food-based fibres and researched nutrients. No artificial stimulants. Suitable as a daily ritual when taken with enough water.',
    image: '/ritual/Make_the_man_2k.webp',
    imageAlt: 'A sustainable long-term wellness ritual',
    fit: 'cover' as const,
  },
] as const

export const OUTCOMES = [
  {
    when: '30 minutes',
    title: 'Fullness begins',
    body: 'Satiety signals start. Hunger feels quieter and the next meal is easier to stop at a comfortable portion.',
  },
  {
    when: '7 days',
    title: 'The ritual settles',
    body: 'Cravings are less sudden. Mornings often feel less bloated. You notice you are not hunting snacks between meals.',
  },
  {
    when: '30 days',
    title: 'Visible control',
    body: 'Portion control becomes habit. Sweet cravings drop. Clothes start to sit differently as intake naturally falls.',
  },
  {
    when: '60 days',
    title: 'Gut and metabolism shift',
    body: 'Digestive comfort improves. Energy is more even. Fat metabolism support becomes easier to stay consistent with.',
  },
  {
    when: '90 days',
    title: 'A refined body',
    body: 'This is the window FYBER is built for: sustainable weight control, a lighter frame, and a ritual you no longer have to think about.',
  },
  {
    when: '120 days',
    title: 'The habit holds',
    body: 'Long-term craving control without restarting. Best if you already know FYBER works for you and do not want a gap in supply.',
  },
] as const

export const SKU_RECS = [
  {
    handle: 'transformation-pack',
    name: 'Transformation Pack',
    duration: '30 days · 30 sachets',
    price: '₹2,249',
    compare: '₹2,999',
    badge: 'Most recommended',
    when: 'Choose this if you are ready for a real month of craving control and want to see a change in how you eat.',
    why: 'This is the pack most customers buy when they are serious about results. It is 30% of all orders and about half of FYBER revenue — the 30-day window where hunger, portions, and bloating typically shift.',
    bestFor: 'First visible results, daily ritual, cravings',
    image: 'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/Transformation_Pack.png?v=1779360501',
  },
  {
    handle: 'ultimate-pack',
    name: 'Ultimate Pack',
    duration: '90 days · 90 sachets + LYTE band',
    price: '₹5,999',
    compare: '₹7,999',
    badge: 'Full reset',
    when: 'Choose this if you want the complete 90-day body shift and a LYTE band to stay honest with daily movement and meals.',
    why: 'FYBER’s own timeline is “noticeable in 30 minutes, refined in 90 days.” Ultimate is the SKU that covers that full arc without reordering, and includes LYTE for tracking.',
    bestFor: '90-day transformation, metabolic recalibration',
    image: 'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/A_90Days_-01.jpg?v=1791206641',
  },
  {
    handle: 'elite-pack',
    name: 'Elite Pack',
    duration: '120 days · 120 sachets',
    price: '₹5,999',
    compare: '₹8,999',
    badge: 'Best long-term value',
    when: 'Choose this if FYBER already fits your life and you want four months of sachets so the ritual never breaks.',
    why: 'Same selling price as Ultimate, 30 extra days. Best per-sachet value when you are past the trial phase and want continuity.',
    bestFor: 'Long-term control, no reorder gap',
    image: 'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/Elite-pack.png?v=1788543388',
  },
] as const

export const SKU_WHEN = [
  {
    situation: 'Just opened your first pack',
    sku: 'Stay on a sachet a day for 7 days, then move to the Transformation Pack.',
  },
  {
    situation: 'Cravings and portion size are the main problem',
    sku: 'Transformation Pack (30 days).',
  },
  {
    situation: 'You want a defined 90-day body change',
    sku: 'Ultimate Pack + LYTE band.',
  },
  {
    situation: 'You already like FYBER and hate running out',
    sku: 'Elite Pack (120 days).',
  },
] as const
