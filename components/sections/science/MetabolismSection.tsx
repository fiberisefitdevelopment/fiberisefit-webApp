'use client'

import React from 'react';
import { Zap, Flame, Activity, AlertTriangle, TrendingDown, Scale, Battery, Brain, Minus } from 'lucide-react';
import { metabolismData } from '../../../data/mock';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';

const MetabolismSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  const activeIcons = [Activity, Battery, Flame, Brain, Zap];
  const starvationIcons = [TrendingDown, AlertTriangle, Scale, Brain, Minus];

  return (
    <section ref={ref} className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-sm font-medium text-green-600 uppercase tracking-wider mb-4">
            Metabolic Efficiency
          </span>
          <h2 className="text-4xl lg:text-5xl font-light text-charcoal leading-[1] mb-8">
            {metabolismData.title}
          </h2>
        </div>

        {/* Description */}
        <div className={`text-center max-w-2xl mx-auto mb-8 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-base text-charcoal/60 leading-[1.5]">
            {metabolismData.description}
          </p>
        </div>  

        {/* Comparison Cards */}
        <div className={`grid md:grid-cols-2 gap-6 max-w-3xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Fed & Active Mode */}
          <div className="relative bg-gradient-to-br from-green-50 to-green-100/56 rounded-3xl p-6 border border-green-200 overflow-hidden">
            <div className="absolute top-4 right-4 w-20 h-20 bg-green-200/49 rounded-full blur-2xl" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Flame className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <span className="block text-base font-medium text-charcoal">
                    {metabolismData.comparison[0].mode}
                  </span>
                  {/* <span className="text-xs text-green-600 font-medium uppercase tracking-wider">
                    With FYBER
                  </span> */}
                </div>
              </div>

              <ul className="space-y-3">
                {metabolismData.comparison[0].features.map((feature, index) => {
                  const Icon = activeIcons[index];
                  return (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Icon className="w-4 h-4 text-green-500" />
                      </div>
                      <span className="text-sm text-charcoal/70">{feature}</span>
                    </li>
                  );
                })}
              </ul>

              {/* Visual Indicator */}
              <div className="mt-6 pt-4 border-t border-green-200">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse" />
                  </div>
                  <span className="text-xs font-medium text-green-600">Optimal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Starvation Mode */}
          <div className="relative bg-gradient-to-br from-red-50 to-red-100/56 rounded-3xl p-6 border border-red-200 overflow-hidden">
            <div className="absolute top-4 right-4 w-20 h-20 bg-red-200/49 rounded-full blur-2xl" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <span className="block text-base font-medium text-charcoal/70">
                    {metabolismData.comparison[1].mode}
                  </span>
                  {/* <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Without Support
                  </span> */}
                </div>
              </div>

              <ul className="space-y-3">
                {metabolismData.comparison[1].features.map((feature, index) => {
                  const Icon = starvationIcons[index];
                  return (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Icon className="w-4 h-4 text-red-500" />
                      </div>
                      <span className="text-sm text-charcoal/70">{feature}</span>
                    </li>
                  );
                })}
              </ul>

              {/* Visual Indicator */}
              <div className="mt-6 pt-4 border-t border-red-200">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                    <div className="h-full w-2/5 bg-red-300 rounded-full" />
                  </div>
                  <span className="text-xs font-medium text-red-500">Reduced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetabolismSection;
