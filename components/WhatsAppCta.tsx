import React from 'react';
import { MagnetIcon } from './icons/MagnetIcon';

interface WhatsAppCtaProps {
  ctaContent: {
    heading: string;
    subheading: string;
    phoneNumber: string;
    message: string;
    buttonText: string;
    footerText: string;
  }
}

export const WhatsAppCta: React.FC<WhatsAppCtaProps> = ({ ctaContent }) => {
  const { phoneNumber, message, heading, subheading, buttonText, footerText } = ctaContent;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-[#E6F8F2] border border-[#A9E8D3] p-8 rounded-2xl text-center">
      <h2 className="text-2xl font-bold text-[#006A4E] flex items-center justify-center gap-2">
        <MagnetIcon className="w-8 h-8 text-pink-500" />
        {heading}
      </h2>
      <p className="text-gray-700 mt-2">{subheading}</p>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block bg-[#25D366] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#1EBE57] transition-colors text-lg shadow-lg"
      >
        <div className="flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.956-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.357 1.846 6.069l-1.29 4.723 4.833-1.276z" />
            </svg>
            <h2 className="text-l font-bold text-[#FFFFFF] flex items-center justify-center gap-2">{buttonText}</h2>
        </div>
      </a>
      <p className="text-gray-600 text-sm mt-4">{footerText}</p>
    </div>
  );
};
