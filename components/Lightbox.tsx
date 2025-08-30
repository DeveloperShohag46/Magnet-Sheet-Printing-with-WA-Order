import React, { useState, useEffect, useRef, useCallback } from 'react';
import { XIcon } from './icons/XIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { ArrowPathIcon } from './icons/ArrowPathIcon';


interface LightboxProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  const resetZoomAndPan = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const nextImage = useCallback(() => {
    resetZoomAndPan();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length, resetZoomAndPan]);

  const prevImage = useCallback(() => {
    resetZoomAndPan();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length, resetZoomAndPan]);
  
  useEffect(() => {
    // Prevent background scrolling when lightbox is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      // Restore background scrolling when lightbox is closed
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, nextImage, prevImage]);

  const handleZoom = (direction: 'in' | 'out') => {
    const zoomFactor = 0.2;
    const newScale = direction === 'in' ? scale + zoomFactor : scale - zoomFactor;
    if (newScale >= 1) {
      setScale(newScale);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setStartDrag({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || scale <= 1) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - startDrag.x,
      y: e.clientY - startDrag.y,
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };
  
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling up
    if (e.deltaY < 0) {
      handleZoom('in');
    } else {
      handleZoom('out');
    }
  };

  const getCursor = () => {
    if (scale > 1) {
      return isDragging ? 'grabbing' : 'grab';
    }
    return 'zoom-in';
  };
  
  const handleImageClick = () => {
    if (scale === 1) {
        handleZoom('in');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fadeIn"
      onWheel={handleWheel}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
      
      {/* --- CONTROLS --- */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-20">
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg">
            <button title="Zoom In" onClick={() => handleZoom('in')} className="p-2 text-white hover:bg-white/20 rounded-md transition-colors"><PlusIcon className="w-6 h-6"/></button>
            <button title="Zoom Out" disabled={scale <= 1} onClick={() => handleZoom('out')} className="p-2 text-white hover:bg-white/20 rounded-md transition-colors disabled:opacity-50"><MinusIcon className="w-6 h-6"/></button>
            <button title="Reset View" disabled={scale <= 1 && position.x === 0 && position.y === 0} onClick={resetZoomAndPan} className="p-2 text-white hover:bg-white/20 rounded-md transition-colors disabled:opacity-50"><ArrowPathIcon className="w-6 h-6"/></button>
        </div>
        <button title="Close" onClick={onClose} className="p-2 bg-black/40 text-white hover:bg-white/20 rounded-lg transition-colors"><XIcon className="w-6 h-6" /></button>
      </div>

      <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-white/20 transition-colors z-10"><ChevronLeftIcon className="w-8 h-8" /></button>
      <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-white/20 transition-colors z-10"><ChevronRightIcon className="w-8 h-8" /></button>

      {/* --- IMAGE CONTAINER --- */}
      <div 
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        <img 
            src={images[currentIndex]} 
            alt={`Enlarged product view ${currentIndex + 1}`} 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            style={{ 
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                cursor: getCursor(),
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
            onMouseDown={handleMouseDown}
            onClick={handleImageClick}
            draggable="false"
        />
      </div>
    </div>
  );
};