'use client'

import React from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { cravingsData } from '../../../data/mock';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';

const CravingsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="pt-12 pb-4 lg:py-16 bg-white relative" id="science">
      <div className="max-w-7xl mx-auto px-6 lg:pl-8 lg:pr-0">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-24 items-center">
          {/* Left Content */}
          <div className={`text-center lg:text-left transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <span className="inline-block text-sm font-medium text-amber-600 uppercase tracking-wider mb-4">
              Appetite Regulation
            </span>
            <h2 className="text-4xl lg:text-5xl font-light text-charcoal leading-[1.3] mb-8">
              {cravingsData.title}
            </h2>
            <p className="text-lg text-charcoal/70 leading-[1.8] mb-6">
              {cravingsData.subtitle}
            </p>
            <p className="text-base text-charcoal/60 leading-[1.9] mb-6 lg:mb-10">
              {cravingsData.description}
            </p>
            
            <ul className="space-y-4 text-left">
              {cravingsData.points.map((point, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-charcoal/70">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Image - Spacer for grid */}
          <div className="hidden lg:block"></div>
        </div>
      </div>
      
      {/* Right Image - Absolute positioned on desktop to extend to edge */}
      <div className={`-mt-4 lg:mt-0 -mb-4 lg:mb-0 lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-1/2 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
        <div className="relative w-full h-[500px] lg:h-full rounded-3xl lg:rounded-l-3xl lg:rounded-r-none overflow-hidden">
          <Image
            src="/cravings-image.png"
            alt="Control Cravings Naturally"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default CravingsSection;
