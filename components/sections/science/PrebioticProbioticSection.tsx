'use client'

import React from 'react';
import { Leaf, Shield, Check } from 'lucide-react';
import { prebioticProbioticData } from '../../../data/mock';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';

const PrebioticProbioticSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-sm font-medium text-blue-600 uppercase tracking-wider mb-4">
            Synbiotic Formula
          </span>
          <h2 className="text-4xl lg:text-5xl font-light text-charcoal leading-[1.3] mb-8">
            Prebiotic + Probiotic Power
          </h2>
          <p className="text-lg text-charcoal/70 leading-[1.8]">
            The perfect combination for complete gut health support
          </p>
        </div>

        {/* Two Column Cards */}
        <div className={`grid md:grid-cols-2 gap-6 max-w-5xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Prebiotic Card */}
          <div className="group relative bg-gradient-to-br from-green-50/80 to-amber-50/40 rounded-3xl p-6 lg:p-8 border border-green-100 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative">
              {/* Title & Icon Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-charcoal mb-1">
                    {prebioticProbioticData.prebiotic.title}
                  </h3>
                  <p className="text-xs font-medium text-green-600">
                    {prebioticProbioticData.prebiotic.subtitle}
                  </p>
                </div>
                {/* Icon */}
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm ml-3 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Leaf className="w-6 h-6 text-green-500" />
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-charcoal/60 leading-[1.7] mb-6">
                {prebioticProbioticData.prebiotic.description}
              </p>

              {/* Features */}
              <ul className="space-y-3">
                {prebioticProbioticData.prebiotic.features.map((feature, index) => (
                  <li key={index} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-charcoal/70 flex-1">{feature}</span>
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                      <Check className="w-3 h-3 text-green-500" />
                    </div>
                  </li>
                ))}
              </ul>

              {/* Visual Element */}
              <div className="mt-6 pt-4 border-t border-green-100/50">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-green-300 to-green-400 border-2 border-white"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-charcoal/50 ml-2">Feeds beneficial bacteria</span>
                </div>
              </div>
            </div>
          </div>

          {/* Probiotic Card */}
          <div className="group relative bg-gradient-to-br from-blue-50/80 to-green-50/40 rounded-3xl p-6 lg:p-8 border border-blue-100 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative">
              {/* Title & Icon Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-charcoal mb-1">
                    {prebioticProbioticData.probiotic.title}
                  </h3>
                  <p className="text-xs font-medium text-blue-600">
                    {prebioticProbioticData.probiotic.subtitle}
                  </p>
                </div>
                {/* Icon */}
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm ml-3 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Shield className="w-6 h-6 text-blue-500" />
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-charcoal/60 leading-[1.7] mb-6">
                {prebioticProbioticData.probiotic.description}
              </p>

              {/* Features */}
              <ul className="space-y-3">
                {prebioticProbioticData.probiotic.features.map((feature, index) => (
                  <li key={index} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-charcoal/70 flex-1">{feature}</span>
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                      <Check className="w-3 h-3 text-blue-500" />
                    </div>
                  </li>
                ))}
              </ul>

              {/* Visual Element */}
              <div className="mt-6 pt-4 border-t border-blue-100/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-charcoal/50">Clinically validated strains</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrebioticProbioticSection;
