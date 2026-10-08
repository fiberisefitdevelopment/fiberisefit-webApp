import React from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { heroData } from '../../../data/mock';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden pt-10 lg:pt-20">
      {/* Hero Image - Left Side (Desktop) */}
      <div className="hidden lg:block absolute left-0 top-24 lg:top-28 bottom-0 w-1/2">
        <Image
          src="/hero-image.png"
          alt="Hero"
          fill
          className="object-cover"
          priority
          style={{ opacity: 1 }}
        />
      </div>

      {/* Subtle Background Elements - Hidden on mobile to prevent image fading */}
      <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-50/50 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-50/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-blue-50/30 rounded-full blur-3xl" />
      </div>

      {/* Mobile Image - First on mobile, before content */}
      <div className="lg:hidden relative w-full h-[300px] mt-20 z-10 order-1">
        <Image
          src="/hero-image.png"
          alt="Hero"
          fill
          className="object-cover"
          priority
          style={{ opacity: 1, zIndex: 10 }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-8 lg:pt-24 pb-16 lg:pb-24 w-full order-2 lg:order-none">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Spacer for left side on desktop */}
          <div className="hidden lg:block"></div>

          {/* Content - Right Side */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0 pt-2 lg:pt-24 px-4 lg:pl-16">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">
                {heroData.tagline}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl lg:text-6xl font-light text-charcoal mb-6 animate-fade-in-up">
              <span className="block text-2xl lg:text-4xl leading-tight">Unlock Your Body's</span>
              <span className="block font-medium bg-gradient-to-r from-amber-600 via-green-600 to-blue-600 bg-clip-text text-transparent text-4xl lg:text-6xl mt-4 md:mt-6 leading-tight">
                True Potential
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base lg:text-lg text-charcoal/60 leading-[1.8] max-w-2xl mx-auto lg:mx-0 text-center lg:text-left animate-fade-in-up delay-100">
              {heroData.subheadline}
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-charcoal/20 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-charcoal/40 rounded-full animate-scroll" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
