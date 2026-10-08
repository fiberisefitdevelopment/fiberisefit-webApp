'use client'

import React from 'react';
import Image from 'next/image';
import { Shield, Lock, Layers } from 'lucide-react';
import { gutBarrierData } from '../../../data/mock';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';

const GutBarrierSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-12 lg:py-16 bg-gradient-to-b from-green-50/30 to-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:pl-8 lg:pr-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Illustration - Spacer for grid */}
          <div className="hidden lg:block"></div>

          {/* Content */}
          <div className={`order-1 lg:order-2 text-center lg:text-left transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <span className="inline-block text-sm font-medium text-blue-600 uppercase tracking-wider mb-4">
              Intestinal Health
            </span>
            <h2 className="text-4xl lg:text-5xl font-light text-charcoal leading-[1.3] mb-8">
              {gutBarrierData.title}
            </h2>
            <p className="text-lg text-charcoal/70 leading-[1.8] mb-6">
              {gutBarrierData.subtitle}
            </p>
            <p className="text-base text-charcoal/60 leading-[1.9] mb-10">
              {gutBarrierData.description}
            </p>

            {/* Benefits List */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, label: 'Blocks toxins', color: 'text-green-500 bg-green-50' },
                { icon: Lock, label: 'Seals junctions', color: 'text-blue-500 bg-blue-50' },
                { icon: Layers, label: 'Supports lining', color: 'text-amber-500 bg-amber-50' },
                { icon: Shield, label: 'Allows nutrients', color: 'text-green-500 bg-green-50' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.color.split(' ')[1]}`}>
                    <item.icon className={`w-4 h-4 ${item.color.split(' ')[0]}`} />
                  </div>
                  <span className="text-sm text-charcoal/70">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Illustration - Absolute positioned on desktop to extend to left edge */}
      <div className={`order-2 lg:order-1 lg:absolute lg:left-0 lg:top-0 lg:bottom-0 lg:w-1/2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
        <div className="relative w-full h-[400px] lg:h-full rounded-3xl lg:rounded-r-3xl lg:rounded-l-none overflow-hidden">
          <Image
            src="/ritual/ChatGPT Image Jan 14, 2026 at 12_50_35 PM.png"
            alt="Gut Barrier Visualization"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default GutBarrierSection;
