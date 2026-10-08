'use client'

import React from 'react';
import { Heart, Gauge, Flame } from 'lucide-react';
import { scfaData } from '../../../data/mock';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';

const SCFASection = () => {
  const { ref, isVisible } = useScrollAnimation();

  const icons = [Heart, Gauge, Flame];
  const colors = [
    { bg: 'bg-blue-50', icon: 'text-blue-500', border: 'border-blue-100', hover: 'hover:border-blue-200' },
    { bg: 'bg-amber-50', icon: 'text-amber-500', border: 'border-amber-100', hover: 'hover:border-amber-200' },
    { bg: 'bg-green-50', icon: 'text-green-500', border: 'border-green-100', hover: 'hover:border-green-200' },
  ];

  return (
    <section ref={ref} className="py-12 lg:py-16 bg-gradient-to-b from-white to-green-50/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-sm font-medium text-green-600 uppercase tracking-wider mb-4">
            SCFA Production
          </span>
          <h2 className="text-4xl lg:text-5xl font-light text-charcoal leading-[1.3] mb-8">
            {scfaData.title}
          </h2>
          
          {/* Connection Visual */}
          <div className={`mb-8 pb-8 lg:pb-12 flex justify-center transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 lg:gap-4 px-4 lg:px-8 py-3 lg:py-4 bg-white rounded-full shadow-sm border border-gray-100">
              <span className="text-xs lg:text-sm text-charcoal/60">Fiber</span>
              <div className="w-3 lg:w-8 h-px bg-gradient-to-r from-amber-300 to-green-300" />
              <span className="text-xs lg:text-sm text-charcoal/60">Fermentation</span>
              <div className="w-3 lg:w-8 h-px bg-gradient-to-r from-green-300 to-blue-300" />
              <span className="text-xs lg:text-sm font-medium text-green-600">SCFAs</span>
              <div className="w-3 lg:w-8 h-px bg-gradient-to-r from-blue-300 to-amber-300" />
              <span className="text-xs lg:text-sm text-charcoal/60">Benefits</span>
            </div>
          </div>

          <p className="text-lg text-charcoal/70 leading-[1.8]">
            {scfaData.subtitle}
          </p>
        </div>

        {/* SCFA Cards */}  
        <div className={`grid md:grid-cols-3 gap-6 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {scfaData.cards.map((card, index) => {
            const Icon = icons[index];
            const color = colors[index];
            
            return (
              <div
                key={index}
                className={`group bg-white rounded-2xl p-8 border ${color.border} ${color.hover} shadow-sm hover:shadow-md transition-all duration-300`}
              >
                {/* Name & Icon - Header Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-medium text-charcoal mb-2">
                      {card.name}
                    </h3>
                    <span className={`inline-block px-3 py-1 ${color.bg} rounded-full text-xs font-medium ${color.icon}`}>
                      {card.benefit}
                    </span>
                  </div>
                  {/* Icon */}
                  <div className={`w-14 h-14 ${color.bg} rounded-2xl flex items-center justify-center ml-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    <Icon className={`w-7 h-7 ${color.icon}`} />
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-charcoal/60 leading-[1.8]">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SCFASection;
