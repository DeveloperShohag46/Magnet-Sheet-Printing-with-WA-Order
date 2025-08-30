import React from 'react';
import { ICONS } from '../config';

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

const BenefitCard: React.FC<{ benefit: Benefit }> = ({ benefit }) => {
  const IconComponent = ICONS[benefit.icon];
  return (
    <div className="bg-white p-5 rounded-xl flex items-start gap-4 border border-gray-200">
      <div className="flex-shrink-0 bg-blue-50 p-2 rounded-lg">
          {IconComponent ? <IconComponent className="w-6 h-6 text-[#00AEEF]" /> : null}
      </div>
      <div>
        <h3 className="font-bold text-gray-800 text-md">{benefit.title}</h3>
        <p className="text-gray-500 text-sm leading-snug mt-1">{benefit.description}</p>
      </div>
    </div>
  )
};

interface BenefitsProps {
  benefits: Benefit[];
}

export const Benefits: React.FC<BenefitsProps> = ({ benefits }) => {
  return (
    <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Benefits of our Magnet Sheet</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} />
        ))}
        </div>
    </div>
  );
};
