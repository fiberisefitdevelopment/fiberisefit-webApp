import FeaturedProductsGrid from '@/components/sections/FeaturedProductsGrid.client'
import { getHomepageProducts } from '@/lib/get-homepage-products'
import type { StorefrontProduct } from '@/lib/shopify/fetch-products'

type FeaturedProductsSectionProps = {
  products?: StorefrontProduct[]
}

export default async function FeaturedProductsSection(props: FeaturedProductsSectionProps = {}) {
  let list = props.products
  if (!list) {
    const { featured } = await getHomepageProducts()
    list = featured
  }

  return (
    <section id="products" className="py-10 md:py-20 bg-[#f5f0eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-[#a67517] mb-3">
            Science-Backed Natural Weight Management Supplement
          </h1>
          <p className="text-2xl md:text-3xl text-gray-900 font-normal leading-snug mb-2">
            Control Appetite. Refine Weight
          </p>
          <p className="text-base md:text-lg text-gray-500 font-normal">
            A science-driven approach to feeling full, lighter, and in control.
          </p>
        </div>

        <FeaturedProductsGrid products={list} />
      </div>
    </section>
  )
}
