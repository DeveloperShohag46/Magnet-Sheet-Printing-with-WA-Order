

import React, { useState } from 'react';
import { ProductOptions, PriceDetails, CartItem, AppConfigType } from '../types';
import { usePriceCalculation } from '../hooks/usePriceCalculation';
import { ImageShowcase } from './ImageShowcase';
import { PrintingOptions } from './PrintingOptions';
import { PriceCalculator } from './PriceCalculator';
import { UploadModal } from './UploadModal';
import { Tabs } from './Tabs';
import { Benefits } from './Benefits';
import { WhatsAppCta } from './WhatsAppCta';

interface ProductPageProps {
  config: AppConfigType;
  options: ProductOptions;
  onOptionChange: <K extends keyof ProductOptions>(key: K, value: ProductOptions[K]) => void;
  onAddToCart: (item: CartItem) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ config, options, onOptionChange, onAddToCart }) => {
  const priceDetails: PriceDetails = usePriceCalculation(options, config.pricing);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleAddToCartWithArtwork = (file: File, previewUrl: string) => {
    const cartItem: CartItem = {
      options,
      priceDetails,
      artwork: { file, previewUrl }
    };
    onAddToCart(cartItem);
    setIsUploadModalOpen(false);
  };

  const handleUploadLater = () => {
    const cartItem: CartItem = { options, priceDetails };
    onAddToCart(cartItem);
  };

  return (
    <div className="bg-white text-gray-800">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-8 text-center xl:text-left">
            {config.product.mainHeading}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          
          <div className="lg:col-span-12 xl:col-span-5 order-1">
            <div className="flex flex-col gap-8">
              <ImageShowcase images={config.product.images} />
              <div className="hidden xl:block">
                  <Benefits benefits={config.content.benefits} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 xl:col-span-4 order-3 xl:order-2">
            <PrintingOptions 
              options={options} 
              onOptionChange={onOptionChange} 
              optionLists={config.options}
            />
          </div>
          
          <div className="hidden xl:block xl:col-span-3 order-2 xl:order-3">
            <div className="xl:sticky xl:top-28 self-start">
              <PriceCalculator 
                priceDetails={priceDetails}
                onGetStarted={() => setIsUploadModalOpen(true)}
                onUploadLater={handleUploadLater}
              />
            </div>
          </div>

           <div className="block xl:hidden order-4">
               <PriceCalculator 
                priceDetails={priceDetails}
                onGetStarted={() => setIsUploadModalOpen(true)}
                onUploadLater={handleUploadLater}
              />
          </div>

        </div>

        <div className="mt-16 md:mt-24">
          <Tabs tabsContent={config.content.tabs} />
        </div>

        <div className="mt-16 md:mt-24 xl:hidden">
            <Benefits benefits={config.content.benefits}/>
        </div>
        
        <div className="mt-16 md:mt-24">
          <WhatsAppCta ctaContent={config.content.whatsAppCta} />
        </div>
      </main>

      {isUploadModalOpen && (
        <UploadModal 
          onClose={() => setIsUploadModalOpen(false)}
          onAddToCart={handleAddToCartWithArtwork}
        />
      )}
    </div>
  );
};