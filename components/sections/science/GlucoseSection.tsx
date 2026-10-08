'use client'

import React from 'react';
import { TrendingDown, Clock, Apple } from 'lucide-react';
import { glucoseData } from '../../../data/mock';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';

const GlucoseSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="pt-4 pb-12 lg:py-16 bg-gradient-to-b from-white to-amber-50/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-sm font-medium text-amber-600 uppercase tracking-wider mb-4">
            Blood Sugar Control
          </span>
          <h2 className="text-4xl lg:text-5xl font-light text-charcoal leading-[2] mb-8">
            <span className="block">Stable Blood Sugar,</span>
            <span className="block">Sustained Energy</span>
          </h2>
          <p className="text-lg text-charcoal/70 leading-[1.8]">
            {glucoseData.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Illustration */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="relative bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100">
              {/* Glucose Graph */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-black-400">Blood Glucose Level</span>
                  <span className="text-xs text-black-400">Over Time</span>
                </div>
                
                <div className="relative h-40 bg-gradient-to-t from-green-50/50 to-transparent rounded-xl overflow-hidden">
                  {/* Without Fiber - Spike */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                    <path
                      d="M0,60 Q30,60 50,10 Q70,60 100,55 Q130,50 150,45 Q180,40 200,50"
                      fill="none"
                      stroke="rgba(239,68,68,0.3)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  </svg>
                  
                  {/* With FYBER - Gradual */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                    <path
                      d="M0,60 Q50,55 80,45 Q120,35 160,40 Q190,45 200,48"
                      fill="none"
                      stroke="rgb(34,197,94)"
                      strokeWidth="3"
                      className="animate-draw-line"
                    />
                  </svg>

                  {/* Labels */}
                  <div className="absolute bottom-2 left-4 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-0.5 bg-red-300" style={{ borderStyle: 'dashed' }} />
                      <span className="text-xs text-black-400">Without Fiber</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-0.5 bg-green-500" />
                      <span className="text-xs text-black-400">With FYBER</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fiber Net Illustration */}
              <div className="flex items-center gap-6 p-4 bg-amber-50/50 rounded-xl">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <div className="relative">
                    <div className="w-8 h-8 border-2 border-amber-300 rounded-full border-dashed animate-spin-slow" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-amber-400 rounded-full" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal mb-1">Fiber Matrix Technology</p>
                  <p className="text-xs text-charcoal/60">Forms protective gel around carbs for gradual absorption</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content & Benefits */}
          <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <p className="text-base text-charcoal/60 leading-[1.9] mb-10">
              {glucoseData.description}
            </p>

            <div className="grid grid-cols-3 gap-4">
              {glucoseData.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-amber-100 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-amber-50 rounded-full mb-4 group-hover:bg-amber-100 transition-colors">
                    {index === 0 && <TrendingDown className="w-5 h-5 text-amber-600" />}
                    {index === 1 && <Clock className="w-5 h-5 text-amber-600" />}
                    {index === 2 && <Apple className="w-5 h-5 text-amber-600" />}
                  </div>
                  <span className="block text-3xl font-medium text-charcoal mb-2">
                    {benefit.value}
                  </span>
                  <span className="text-sm text-charcoal/50">
                    {benefit.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlucoseSection;
