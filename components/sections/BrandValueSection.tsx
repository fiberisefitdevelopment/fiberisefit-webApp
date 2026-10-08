export default function BrandValueSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Elevate Your FIberiseFit Journey
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
            We believe in the power of natural ingredients and scientific
            innovation. Our products are crafted with care, backed by research,
            and designed to support your path to optimal health and vitality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100%</div>
              <p className="text-gray-600">Natural Ingredients</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">Science</div>
              <p className="text-gray-600">Backed by Research</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">Premium</div>
              <p className="text-gray-600">Quality Guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

