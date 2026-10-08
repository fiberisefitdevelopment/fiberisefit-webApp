import Image from 'next/image'

export default function JourneySection() {
  return (
    <section className="w-full bg-white pt-16 md:pt-24 lg:pt-32 pb-16 md:pb-24 lg:pb-32 relative overflow-visible">
      <div className="max-w-[96rem] mx-auto px-6 sm:px-8 lg:px-12 relative">
        {/* Main Heading - Left Aligned */}
        <div className="mb-0 pb-6 md:pb-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-serif font-medium text-[#868B7A] leading-relaxed max-w-5xl">
            {/* Mobile view - 4 lines only */}
            <span className="block text-4xl md:text-5xl whitespace-nowrap lg:hidden">Noticeable Results In</span>
            <span className="block text-4xl md:text-5xl mt-4 md:mt-6 whitespace-nowrap lg:hidden">30 Minutes</span>
            <span className="block text-4xl md:text-5xl mt-4 md:mt-6 whitespace-nowrap lg:hidden">Refined Body In</span>
            <span className="block text-4xl md:text-5xl mt-4 md:mt-6 whitespace-nowrap lg:hidden">90 Days</span>
            
            {/* Desktop view - 2 lines */}
            <span className="hidden lg:block whitespace-nowrap">Noticeable results in 30 minutes</span>
            <span className="hidden lg:block mt-6 md:mt-8 lg:mt-10">Refined body in 90 days</span>
          </h2>
        </div>



        {/* Content Container */}
        <div className="relative mt-2 md:mt-8 lg:mt-10 xl:mt-12">
          {/* 1st Section - Text Left, Image Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-16 lg:gap-20 mb-8 md:mb-12 lg:mb-16 xl:mb-20 items-center">
            {/* Text Left - Order 2 on mobile, 1 on desktop */}
            <div className="max-w-lg ml-4 md:ml-6 lg:ml-8 order-2 lg:order-1 text-left">
              {/* Small Heading */}
              <div className="mb-4 md:mb-6">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-medium text-[#868B7A]">
                  Controls Cravings
                </h3>
              </div>
              <p className="text-sm md:text-base text-gray-700 opacity-70" style={{ lineHeight: '1.75' }}>
                FYBER activates the body’s natural GLP-1 pathways, promoting satiety within just 30 minutes of intake. As fullness sets in, hunger signals quieten, emotional eating fades, and cravings lose their intensity. Rather than forcing control, FYBER restores balance—allowing appetite regulation to feel calm, intuitive, and effortless, supporting mindful choices and sustainable weight management as part of a refined daily wellness ritual.
              </p>
            </div>

            {/* Images Right - Side by Side - Order 1 on mobile, 2 on desktop */}
            <div className="flex flex-row w-full md:w-4/5 lg:w-full lg:ml-auto order-1 lg:order-2">
              {/* Smaller image on left */}
              <div className="relative w-2/5 h-[240px] md:h-[300px] lg:h-[360px]">
                <Image
                  src="/ritual/Group 64930.png"
                  alt="Wellness product"
                  fill
                  className="object-contain object-center rounded-sm"
                  sizes="(max-width: 768px) 40vw, (max-width: 1024px) 20vw, 16vw"
                />
              </div>
              {/* Larger image on right with text below */}
              <div className="flex flex-col flex-1">
                <div className="relative w-full h-[240px] md:h-[300px] lg:h-[360px]">
                  <Image
                    src="/ritual/Soft%20Tones%20Visual%20Minimalist%20Dessert%20Inspiration.jpg"
                    alt="Controls Cravings"
                    fill
                    className="object-cover object-center rounded-lg"
                    sizes="(max-width: 768px) 60vw, (max-width: 1024px) 30vw, 24vw"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3rd Section - Images Left, Text Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-16 lg:gap-20 mb-0 mt-8 md:mt-12 lg:mt-16 items-center">
            {/* Images Left - Side by Side - Order 1 on mobile, 1 on desktop */}
            <div className="flex flex-row w-full -ml-8 sm:-ml-12 lg:-ml-16 pl-8 md:pl-12 lg:pl-16 order-1">
              {/* Larger image on left */}
              <div className="relative flex-1 h-[240px] md:h-[300px] lg:h-[360px] rounded-2xl overflow-hidden">
                <Image
                  src="/ritual/Modern%20Aesthetic%20AI%20Stock%20Photos%20for%20Your%20Brand.jpg"
                  alt="Wellness fitness - BYE BLOATING"
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 768px) 60vw, (max-width: 1024px) 30vw, 24vw"
                />
              </div>
              {/* Smaller image on right */}
              <div className="relative w-2/5 h-[240px] md:h-[300px] lg:h-[360px]">
                <Image
                  src="/ritual/Group 64931.png"
                  alt="Wellness product"
                  fill
                  className="object-contain object-center rounded-lg"
                  sizes="(max-width: 768px) 40vw, (max-width: 1024px) 20vw, 16vw"
                />
              </div>
            </div>

            {/* Text Right - Order 2 on mobile, 2 on desktop */}
            <div className="max-w-lg ml-4 md:ml-6 lg:ml-8 order-2 text-left">
              {/* Small Heading */}
              <div className="mb-4 md:mb-6">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-medium text-[#868B7A]">
                  BYE - BYE BLOATING
                </h3>
              </div>
              <p className="text-sm md:text-base text-gray-700 opacity-70" style={{ lineHeight: '1.75' }}>
                FYBER helps recalibrate your gut, restoring digestive harmony from within. Bloating and inflammation gradually subside, allowing your body to feel lighter and more at ease. Mornings begin with a sense of clarity and lightness, while steady energy carries you through the day. The result is a refined digestive balance that enhances comfort, vitality, and everyday well-being—without disruption or strain.              </p>
            </div>
          </div>

          <div className="relative mt-8 md:mt-12 lg:mt-16">
            {/* 1st Section - Text Left, Image Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-16 lg:gap-20 mb-0 items-center">
              {/* Text Left - Order 2 on mobile, 1 on desktop */}
              <div className="max-w-lg ml-4 md:ml-6 lg:ml-8 order-2 lg:order-1 text-left">
                {/* Small Heading */}
                <div className="mb-4 md:mb-6">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-medium text-[#868B7A]">
                    WEIGHT RELEASES
                  </h3>
                </div>
                <p className="text-sm md:text-base text-gray-700 opacity-70" style={{ lineHeight: '1.75' }}>
                  FYBER initiates steady, measurable weight loss as the body begins to release excess weight naturally. Hunger is better regulated, portions feel effortless, and visible changes start to appear in how your clothes fit and how you move. This is weight loss without struggle—consistent, controlled, and sustainable—driven by a daily ritual that reshapes your body with quiet precision and lasting elegance.              </p>
              </div>

              {/* Images Right - Side by Side - Order 1 on mobile, 2 on desktop */}
              <div className="flex flex-row w-full md:w-4/5 lg:w-full lg:ml-auto order-1 lg:order-2">
                {/* Smaller image on left */}
                <div className="relative w-2/5 h-[240px] md:h-[300px] lg:h-[360px]">
                  <Image
                    src="/ritual/Group 64929.png"
                    alt="Wellness product"
                    fill
                    className="object-cover object-center rounded-sm"
                    sizes="(max-width: 768px) 40vw, (max-width: 1024px) 20vw, 16vw"
                  />
                </div>
                {/* Larger image on right with text below */}
                <div className="flex flex-col flex-1">
                  <div className="relative w-full h-[240px] md:h-[300px] lg:h-[360px]">
                    <Image
                      src="/ritual/Make_this_image_2k_202601091748.jpeg"
                      alt="WEIGHT RELEASES in 30 Days"
                      fill
                      className="object-cover object-center rounded-lg"
                      sizes="(max-width: 768px) 60vw, (max-width: 1024px) 30vw, 24vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
                  {/* 3rd Section - Images Left, Text Right */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-6 lg:gap-8 mb-0 mt-8 md:mt-12 lg:mt-16 items-center">
            {/* Images Left - Side by Side - Order 1 on mobile, 1 on desktop */}
            <div className="flex flex-row w-full -ml-8 sm:-ml-12 lg:-ml-16 pl-8 md:pl-12 lg:pl-16 order-1">
              {/* Larger image on left */}
              <div className="relative flex-[3] h-[240px] md:h-[300px] lg:h-[360px] rounded-2xl overflow-hidden">
                <Image
                  src="/ritual/Make_the_man_2k_202601120957.jpeg"
                  alt="BODY , REIMAGINED in 90 Days"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 60vw, (max-width: 1024px) 30vw, 24vw"
                />
              </div>
              {/* Smaller image on right */}
              <div className="relative flex-[2] h-[240px] md:h-[300px] lg:h-[360px]">
                <Image src="/ritual/Group 64928.png" alt="Wellness product" fill className="object-contain object-top rounded-lg" sizes="(max-width: 768px) 40vw, (max-width: 1024px) 20vw, 16vw" />
              </div>
            </div>
            {/* Text Right - Order 2 on mobile, 2 on desktop */}
            <div className="max-w-lg ml-4 md:ml-6 lg:ml-8 xl:ml-10 2xl:ml-12 order-2 text-left">
              {/* Small Heading */}
              <div className="mb-4 md:mb-6">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-medium text-[#868B7A]">
                BODY , REIMAGINED
                </h3>
              </div>
              <p className="text-sm md:text-base text-gray-700 opacity-70" style={{ lineHeight: '1.75' }}>
              This is the moment you realise you’ve truly arrived. Your body reflects a major milestone—leaner, defined, and unmistakably transformed. What once felt distant is now achieved, visible, and deeply satisfying. The effort fades into pride as you recognise the discipline, consistency, and commitment that brought you here. This is not just transformation; it is completion—a refined sense of accomplishment where you know you’ve made it, and the world can see it too.              </p>
            </div>
          </div>



        </div>
      </div>
    </section>
  )
}
