import React, { useState } from 'react';
import { Lightbox } from './Lightbox';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface ImageShowcaseProps {
  images: string[];
}

export const ImageShowcase: React.FC<ImageShowcaseProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const openLightbox = () => {
    setIsLightboxOpen(true);
  };

  if (!images || images.length === 0) {
    return <div className="aspect-square w-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">No Images Available</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200">
        <img
          src={images[activeIndex]}
          alt={`Magnet sheet preview ${activeIndex + 1}`}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-500 hover:scale-105"
          onClick={openLightbox}
        />
        <button
          onClick={prevImage}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition-all duration-200 shadow-md"
          aria-label="Previous image"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition-all duration-200 shadow-md"
          aria-label="Next image"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {images.map((img, index) => (
          <div
            key={img}
            className={`aspect-square w-full rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
              activeIndex === index ? 'border-[#00AEEF] scale-105' : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => setActiveIndex(index)}
          >
            <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {isLightboxOpen && (
        <Lightbox 
            images={images} 
            startIndex={activeIndex} 
            onClose={() => setIsLightboxOpen(false)} 
        />
      )}
    </div>
  );
};
