'use client'

import React from 'react';
import { 
  Droplets, 
  Flame, 
  Battery, 
  Brain, 
  Gem, 
  Dumbbell, 
  Activity
} from 'lucide-react';
import { 
  lipidData, 
  fatOxidationData, 
  energyData, 
  focusData, 
  mineralData, 
  muscleData, 
  thyroidData 
} from '../../../data/mock';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';

// Helper function for Tailwind color classes
const getColorClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-500' },
    green: { bg: 'bg-green-50', text: 'text-green-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-500' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-500' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-500' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-500' },
  };
  return colorMap[color] || colorMap.blue;
};

const BenefitsGrid = () => {
  const { ref, isVisible } = useScrollAnimation();

  const benefits = [
    { 
      icon: Droplets, 
      title: lipidData.title, 
      subtitle: lipidData.subtitle, 
      description: lipidData.description,
      color: 'blue'
    },
    { 
      icon: Flame, 
      title: fatOxidationData.title, 
      subtitle: fatOxidationData.subtitle, 
      description: fatOxidationData.description,
      color: 'amber'
    },
          
    { 
      icon: Brain, 
      title: focusData.title, 
      subtitle: focusData.subtitle, 
      description: focusData.description,
      color: 'purple'
    },
    { 
      icon: Gem, 
      title: mineralData.title, 
      subtitle: mineralData.subtitle, 
      description: mineralData.description,
      color: 'cyan'
    },
    { 
      icon: Dumbbell, 
      title: muscleData.title, 
      subtitle: muscleData.subtitle, 
      description: muscleData.description,
      color: 'rose'
    },
    { 
      icon: Activity, 
      title: thyroidData.title, 
      subtitle: thyroidData.subtitle, 
      description: thyroidData.description,
      color: 'teal'
    },
  ];

  return (
    <section ref={ref} className="pt-16 pb-4 lg:py-20 bg-white" id="benefits">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-sm font-medium text-amber-600 uppercase tracking-wider mb-4">
            Complete Benefits
          </span>
          <h2 className="text-4xl lg:text-5xl font-light text-charcoal leading-[1.3] mb-8">
            <span className="block">One Supplement</span>
            <span className="block mt-4 md:mt-6">Many Benefits</span>
          </h2>
          <p className="text-lg text-charcoal/70 leading-[1.8]">
            FYBER supports your body's natural processes for comprehensive metabolic wellness
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const colorClasses = getColorClasses(benefit.color);
            return (
              <div
                key={index}
                className={`group bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {/* Title & Icon Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-charcoal leading-[1.4] mb-2">{benefit.title}</h3>
                    <p className="text-sm font-medium text-charcoal/50 leading-[1.6]">{benefit.subtitle}</p>
                  </div>
                  {/* Icon */}
                  <div className={`w-12 h-12 ${colorClasses.bg} rounded-xl flex items-center justify-center ml-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    <benefit.icon className={`w-6 h-6 ${colorClasses.text}`} />
                  </div>
                </div>
                <p className="text-sm text-charcoal/60 leading-[1.8]">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsGrid;
