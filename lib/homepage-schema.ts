const LOGO_URL =
  'https://fiberisefit.com/_next/image?url=%2Ffiberisefit%20dark%20logo.png&w=1920&q=75'

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://fiberisefit.com/#organization',
  name: 'FIBERISE FIT PRIVATE LIMITED',
  legalName: 'FIBERISE FIT PRIVATE LIMITED',
  url: 'https://fiberisefit.com/',
  description:
    'FIBERISE FIT PRIVATE LIMITED is an India-based functional nutrition and wellness company developing science-backed nutraceuticals, dietary supplements and health technology products focused on appetite control, gut health, metabolic wellness, weight management and everyday health monitoring.',
  foundingDate: '2025-07-03',
  founder: {
    '@type': 'Person',
    '@id': 'https://fiberisefit.com/#person-diwakar-vaish',
    name: 'Prof. Diwakar Vaish',
    jobTitle: 'Founder',
  },
  email: 'support@fiberisefit.com',
  telephone: '+91-7070705026',
  logo: {
    '@type': 'ImageObject',
    '@id': 'https://fiberisefit.com/#logo',
    url: LOGO_URL,
    contentUrl: LOGO_URL,
    caption: 'Fiberise Fit',
    inLanguage: 'en-IN',
  },
  image: {
    '@type': 'ImageObject',
    '@id': 'https://fiberisefit.com/#organization-image',
    url: LOGO_URL,
    contentUrl: LOGO_URL,
    caption: 'Fiberise Fit',
    inLanguage: 'en-IN',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '731/508 S/F, PLOT NO.7 BLOCK 56 DB GUPTA ROAD',
    addressLocality: 'Karol Bagh, Central Delhi',
    addressRegion: 'Delhi',
    postalCode: '110005',
    addressCountry: 'IN',
  },
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      '@id': 'https://fiberisefit.com/#customer-support',
      contactType: 'customer support',
      telephone: '+91-7070705026',
      email: 'support@fiberisefit.com',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
  ],
  brand: [
    {
      '@type': 'Brand',
      '@id': 'https://fiberisefit.com/#brand-fyber',
      name: 'FYBER',
      url: 'https://fiberisefit.com/',
    },
    {
      '@type': 'Brand',
      '@id': 'https://fiberisefit.com/#brand-lyte',
      name: 'LYTE',
      url: 'https://fiberisefit.com/lyte',
    },
  ],
  knowsAbout: [
    'Functional nutrition',
    'Nutraceuticals',
    'Dietary supplements',
    'Appetite control',
    'Satiety',
    'Weight management',
    'Gut health',
    'Prebiotic fiber',
    'Probiotics',
    'Metabolic health',
    'Nutrition',
    'Wellness',
    'Health monitoring',
    'Wearable health technology',
    'Fitness tracking',
    'Sleep tracking',
    'Lifestyle wellness',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    '@id': 'https://fiberisefit.com/#product-catalog',
    name: 'Fiberise Fit Products',
    itemListElement: [
      {
        '@type': 'Product',
        '@id': 'https://fiberisefit.com/products/transformation-pack#product',
        name: 'FYBER Transformation Pack',
        brand: {
          '@id': 'https://fiberisefit.com/#brand-fyber',
        },
      },
      {
        '@type': 'Product',
        '@id': 'https://fiberisefit.com/products/ultimate-pack#product',
        name: 'FYBER Ultimate Pack',
        brand: {
          '@id': 'https://fiberisefit.com/#brand-fyber',
        },
      },
      {
        '@type': 'Product',
        '@id': 'https://fiberisefit.com/products/elite-pack#product',
        name: 'FYBER Elite Pack',
        brand: {
          '@id': 'https://fiberisefit.com/#brand-fyber',
        },
      },
      {
        '@type': 'Product',
        '@id': 'https://fiberisefit.com/lyte#product',
        name: 'LYTE',
        brand: {
          '@id': 'https://fiberisefit.com/#brand-lyte',
        },
      },
    ],
  },
  sameAs: [
    'https://www.linkedin.com/company/fiberise-fit/',
    'https://www.instagram.com/fiberisefit',
  ],
}

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://fiberisefit.com/#website',
  url: 'https://fiberisefit.com/',
  name: 'Fiberise Fit',
  description:
    'Fiberise Fit offers functional nutrition, nutraceutical and wellness products focused on gut health, appetite control, weight management and metabolic wellness.',
  publisher: {
    '@id': 'https://fiberisefit.com/#organization',
  },
  inLanguage: 'en-IN',
}

export const WEBPAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://fiberisefit.com/#webpage',
  url: 'https://fiberisefit.com/',
  name: 'Fiberise Fit | Science-Backed Nutrition & Wellness',
  description:
    "Explore Fiberise Fit's science-backed nutrition and wellness products designed to support gut health, appetite control, weight management and metabolic wellness.",
  isPartOf: {
    '@id': 'https://fiberisefit.com/#website',
  },
  about: {
    '@id': 'https://fiberisefit.com/#organization',
  },
  publisher: {
    '@id': 'https://fiberisefit.com/#organization',
  },
  mainEntity: {
    '@id': 'https://fiberisefit.com/#organization',
  },
  inLanguage: 'en-IN',
}

export const FYBER_BRAND_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Brand',
  '@id': 'https://fiberisefit.com/#brand-fyber',
  name: 'FYBER',
  url: 'https://fiberisefit.com/',
  description:
    "FYBER is Fiberise Fit's functional nutrition product line focused on fiber, gut health, appetite control and weight management.",
  logo: {
    '@type': 'ImageObject',
    url: LOGO_URL,
  },
  parentOrganization: {
    '@id': 'https://fiberisefit.com/#organization',
  },
}

export const LYTE_BRAND_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Brand',
  '@id': 'https://fiberisefit.com/#brand-lyte',
  name: 'LYTE',
  url: 'https://fiberisefit.com/lyte',
  description:
    "LYTE is Fiberise Fit's health monitoring and wearable technology product designed to provide insights related to activity, nutrition, sleep and wellness.",
  parentOrganization: {
    '@id': 'https://fiberisefit.com/#organization',
  },
}

export const PRODUCT_ITEM_LIST_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': 'https://fiberisefit.com/#product-list',
  name: 'Fiberise Fit Products',
  description:
    'Explore Fiberise Fit products including FYBER nutrition packs and LYTE health technology.',
  url: 'https://fiberisefit.com/',
  numberOfItems: 3,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@id': 'https://fiberisefit.com/products/transformation-pack#product',
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@id': 'https://fiberisefit.com/products/ultimate-pack#product',
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@id': 'https://fiberisefit.com/products/elite-pack#product',
      },
    },
  ],
}

export const TRANSFORMATION_PACK_PRODUCT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://fiberisefit.com/products/transformation-pack#product',
  name: 'FYBER Transformation Pack',
  url: 'https://fiberisefit.com/products/transformation-pack',
  description:
    'Start your wellness journey with the FYBER Transformation Pack, featuring 30 convenient sachets in assorted flavours. Formulated with natural prebiotic fiber and probiotics, it supports appetite control, and gut health. Perfect for first-time users, this easy-to-use pack helps you experience improved fullness, balanced digestion, and steady energy as part of a healthy lifestyle.',
  image: [
    'https://fiberisefit.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0959%2F3680%2F7187%2Ffiles%2FWhatsApp_Image_2026-05-06_at_07.10.17.jpg%3Fv%3D1778041952&w=750&q=75',
  ],
  brand: {
    '@id': 'https://fiberisefit.com/#brand-fyber',
  },
  manufacturer: {
    '@id': 'https://fiberisefit.com/#organization',
  },
  category: 'Dietary Supplement',
  offers: {
    '@type': 'Offer',
    '@id': 'https://fiberisefit.com/products/transformation-pack#offer',
    url: 'https://fiberisefit.com/products/transformation-pack',
    priceCurrency: 'INR',
    price: '2249',
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@id': 'https://fiberisefit.com/#organization',
    },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    '@id': 'https://fiberisefit.com/products/transformation-pack#rating',
    ratingValue: '4.4',
    bestRating: '5',
    worstRating: '1',
    ratingCount: '30',
  },
}

export const ULTIMATE_PACK_PRODUCT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://fiberisefit.com/products/ultimate-pack#product',
  name: 'FYBER Ultimate Pack',
  url: 'https://fiberisefit.com/products/ultimate-pack',
  description:
    'Start your wellness journey with the FYBER Ultimate Pack, featuring 90 convenient sachets in assorted flavours. Formulated with natural prebiotic fiber and probiotics, it supports appetite control, gut health, and sustainable weight management. Perfect for first-time users, this easy-to-use pack helps you experience improved fullness, balanced digestion, and steady energy as part of a healthy lifestyle.',
  image: [
    'https://fiberisefit.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0959%2F3680%2F7187%2Ffiles%2FUltimate-pack.png%3Fv%3D1779360564&w=750&q=75',
  ],
  brand: {
    '@id': 'https://fiberisefit.com/#brand-fyber',
  },
  manufacturer: {
    '@id': 'https://fiberisefit.com/#organization',
  },
  category: 'Dietary Supplement',
  offers: {
    '@type': 'Offer',
    '@id': 'https://fiberisefit.com/products/ultimate-pack#offer',
    url: 'https://fiberisefit.com/products/ultimate-pack',
    priceCurrency: 'INR',
    price: '5999',
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@id': 'https://fiberisefit.com/#organization',
    },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    '@id': 'https://fiberisefit.com/products/ultimate-pack#rating',
    ratingValue: '4.4',
    bestRating: '5',
    worstRating: '1',
    ratingCount: '30',
  },
}

export const ELITE_PACK_PRODUCT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://fiberisefit.com/products/elite-pack#product',
  name: 'FYBER Elite Pack',
  url: 'https://fiberisefit.com/products/elite-pack',
  description:
    'Start your wellness journey with the FYBER Elite Pack, featuring 120 convenient sachets in assorted flavours. Formulated with natural prebiotic fiber and probiotics, it supports appetite control, gut health, and sustainable weight management. Perfect for committed users, this easy-to-use pack helps you experience improved fullness, balanced digestion, and steady energy as part of a healthy lifestyle.',
  image: [
    'https://fiberisefit.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0959%2F3680%2F7187%2Ffiles%2FElite-pack.png%3Fv%3D1788543388&w=750&q=75',
  ],
  brand: {
    '@id': 'https://fiberisefit.com/#brand-fyber',
  },
  manufacturer: {
    '@id': 'https://fiberisefit.com/#organization',
  },
  category: 'Dietary Supplement',
  offers: {
    '@type': 'Offer',
    '@id': 'https://fiberisefit.com/products/elite-pack#offer',
    url: 'https://fiberisefit.com/products/elite-pack',
    priceCurrency: 'INR',
    price: '5999',
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@id': 'https://fiberisefit.com/#organization',
    },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    '@id': 'https://fiberisefit.com/products/elite-pack#rating',
    ratingValue: '4.4',
    bestRating: '5',
    worstRating: '1',
    ratingCount: '30',
  },
}

export const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What exactly is FYBER and how is it different from regular fiber supplements?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Unlike generic fiber supplements that only use simple bulking agents like psyllium husk, FYBER is an advanced smart formulation combining specific soluble prebiotic fibers (including Glucomannan and Inulin) with targeted probiotics, L-Carnitine, and L-Tyrosine. It works dynamically by absorbing water in your stomach to form a gentle gel, physically signaling fullness to your brain while nourishing your gut microbiome for sustained metabolic efficiency.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is FYBER an Ozempic alternative? How does it compare to semaglutide injections?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Semaglutide (Ozempic/Wegovy) is a synthetic prescription hormone injection that chemically slows digestion. FYBER is a completely natural, stimulant-free, dietary fiber-based alternative. It promotes natural satiety through gastric distention and delayed gastric emptying by stimulating your body's own GLP-1 release pathways safely and without systemic side effects or habit-forming dependencies.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do I take FYBER and when is the best time to consume it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "For optimal results, consume one sachet of FYBER dissolved in a glass of water 20 to 30 minutes before your heaviest meal of the day (usually lunch or dinner). Drink another glass of water immediately after to support the fiber's natural hydration and gel-forming action in your stomach.",
      },
    },
    {
      '@type': 'Question',
      name: 'What are the main ingredients in FYBER? Is it transparent about its formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, FYBER is fully transparent. The key ingredients include premium Glucomannan, Chicory Root Extract (Inulin), L-Carnitine L-Tartrate, L-Tyrosine, and a proprietary blend of prebiotics + probiotics. We never hide behind "proprietary blends" without declaring our active, clean ingredients.',
      },
    },
    {
      '@type': 'Question',
      name: 'How soon will I see results? What should I expect in 30, 60, and 90 days?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In the first 30 days, you will experience reduced hunger and fewer sudden sweet cravings, leading to better portion control. Between days 30-60, you will notice improved gut digestive efficiency, reduced bloating, and visible changes in fat metabolism. From 60-90+ days, you will achieve sustainable weight control, enhanced energy levels, and a stronger, healthier metabolic foundation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is FYBER safe? Can I take it long-term?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. FYBER is made from completely natural, food-based dietary fibers and premium metabolic supports. It contains zero artificial stimulants, chemicals, or habit-forming compounds, making it perfectly safe for continuous long-term daily consumption.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is FYBER safe for people with PCOS, thyroid conditions, or diabetes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The soluble prebiotic fibers in FYBER help slow glucose absorption, supporting healthier blood sugar levels and minimizing insulin spikes. This is highly beneficial for individuals managing PCOS, insulin resistance, and diabetes. As always, consult your physician before starting any new wellness regimen.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can pregnant or breastfeeding women take FYBER?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'While dietary fibers are general wellness staples, we highly recommend consulting your obstetrician or primary care physician before adding any new supplement to your routine during pregnancy or lactation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which pack should I choose — Transformation, Ultimate, or Elite?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Transformation Pack (30 Days) is perfect for establishing a daily routine and noticing real changes in cravings and gut health. The Ultimate Pack (90 Days) includes a free LYTE Band and is recommended for full metabolic recalibration. The Elite Pack (120 Days) is the longest supply for continuous craving control and maximum long-term value.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to follow a specific diet or exercise plan while taking FYBER?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No strict diet is required. However, FYBER works most effectively when paired with a balanced diet rich in whole foods and moderate physical activity. By managing your portion sizes and stopping sudden cravings naturally, FYBER makes sticking to healthy habits feel effortless.',
      },
    },
  ],
}

export const HOMEPAGE_SCHEMAS = [
  ORGANIZATION_SCHEMA,
  WEBSITE_SCHEMA,
  WEBPAGE_SCHEMA,
  FYBER_BRAND_SCHEMA,
  LYTE_BRAND_SCHEMA,
  PRODUCT_ITEM_LIST_SCHEMA,
  TRANSFORMATION_PACK_PRODUCT_SCHEMA,
  ULTIMATE_PACK_PRODUCT_SCHEMA,
  ELITE_PACK_PRODUCT_SCHEMA,
  FAQ_SCHEMA,
]
