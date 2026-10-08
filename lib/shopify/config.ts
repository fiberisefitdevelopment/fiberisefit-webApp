export const SHOPIFY_CONFIG = {
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'b620796941f3bb348573d29d88323031',
  shopDomain: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN || 'fiberisefit.myshopify.com',
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-01',
}

export const SHOPIFY_STOREFRONT_API_URL = 
  `https://${SHOPIFY_CONFIG.shopDomain}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`

