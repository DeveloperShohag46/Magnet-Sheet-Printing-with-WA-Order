import React, { useState } from 'react';

const tabKeys = ['description', 'faqs', 'template', 'whyUs'] as const;
type TabKey = typeof tabKeys[number];

const tabTitles: Record<TabKey, string> = {
  description: 'Description',
  faqs: 'FAQs',
  template: 'Template',
  whyUs: 'Why Us',
};

interface TabsProps {
  tabsContent: {
    description: { title: string; content: string };
    faqs: { q: string; a: string }[];
    template: { title: string; content: string; downloadLink: string };
    whyUs: { title: string; points: string[] };
  }
}

export const Tabs: React.FC<TabsProps> = ({ tabsContent }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('description');

  const renderContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">{tabsContent.description.title}</h3>
            <p className="text-gray-600 leading-relaxed">{tabsContent.description.content}</p>
          </div>
        );
      case 'faqs':
        return (
          <div className="space-y-6">
            {tabsContent.faqs.map((faq, index) => (
              <div key={index}>
                <h4 className="font-semibold text-gray-800 text-lg">{faq.q}</h4>
                <p className="text-gray-600 mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        );
      case 'template':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">{tabsContent.template.title}</h3>
            <p className="text-gray-600 leading-relaxed">{tabsContent.template.content}</p>
            <a href={tabsContent.template.downloadLink} className="inline-block bg-[#00AEEF] text-white font-semibold py-2 px-5 rounded-lg hover:bg-[#0098d7] transition-colors">
              Download Template
            </a>
          </div>
        );
      case 'whyUs':
        return (
          <div className="space-y-4">
             <h3 className="text-2xl font-bold text-gray-900">{tabsContent.whyUs.title}</h3>
             <ul className="list-disc list-inside space-y-2 text-gray-600">
                {tabsContent.whyUs.points.map((point, i) => <li key={i}>{point}</li>)}
             </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {tabKeys.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-[#00AEEF] text-[#00AEEF]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all`}
            >
              {tabTitles[tab]}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-8 text-gray-600">
        {renderContent()}
      </div>
    </div>
  );
};
