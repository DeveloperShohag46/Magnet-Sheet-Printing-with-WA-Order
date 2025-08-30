

import React from 'react';
import { CartItem } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface CartPageProps {
  cartItem: CartItem | null;
  onBackToProduct: () => void;
  onProceedToShipping: () => void;
}

const DetailRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b border-gray-200">
    <dt className="text-sm text-gray-500">{label}</dt>
    <dd className="text-sm font-medium text-gray-800">{value}</dd>
  </div>
);

export const CartPage: React.FC<CartPageProps> = ({ cartItem, onBackToProduct, onProceedToShipping }) => {

  if (!cartItem) {
    return (
      <div className="bg-white text-gray-800 min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <button
          onClick={onBackToProduct}
          className="bg-[#00AEEF] text-white font-semibold py-2 px-5 rounded-lg hover:bg-[#0098d7] transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  const { options, priceDetails, artwork } = cartItem;

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBackToProduct} className="text-[#00AEEF] hover:text-[#0098d7] mb-6 text-sm font-semibold">
          &larr; Back to Product Page
        </button>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">Shopping Cart</h1>

        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-1">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Artwork Preview</h2>
                {artwork ? (
                  <img src={artwork.previewUrl} alt="Artwork preview" className="w-full aspect-square object-contain bg-gray-100 rounded-lg p-2 border border-gray-200" />
                ) : (
                  <div className="w-full aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500 border border-gray-200">
                    <UploadIcon className="w-12 h-12 mb-2"/>
                    <span className="text-sm font-medium text-center">Artwork to be uploaded later</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                 <h2 className="text-lg font-bold text-gray-900 mb-3">Order Summary</h2>
                 <dl>
                    <DetailRow label="Artwork Size" value={options.size === 'Custom Size' ? `${options.customWidth}x${options.customHeight} ${options.unit}` : options.size} />
                    <DetailRow label="Quantity (A3 Sheets)" value={options.quantity} />
                    <DetailRow label="Printing" value={options.printing} />
                    <DetailRow label="Lamination" value={options.lamination} />
                    <DetailRow label="Material" value={options.material} />
                    <DetailRow label="Shape" value={options.shape} />
                    <DetailRow label="Shipping" value={options.shipping === 'ride' ? 'Ride Hailing' : options.shipping.charAt(0).toUpperCase() + options.shipping.slice(1)} />
                 </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="max-w-sm ml-auto">
                {priceDetails.optionCosts.map((item, i) => (
                    <div key={i} className={`flex justify-between text-sm mb-1 ${item.cost < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                        <span>{item.label}</span>
                        <span>{item.cost < 0 ? `- RM ${(-item.cost).toFixed(2)}` : `RM ${item.cost.toFixed(2)}`}</span>
                    </div>
                ))}
                 <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span>RM {priceDetails.totalPrice.toFixed(2)}</span>
                </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
            <button 
                onClick={onProceedToShipping}
                className="bg-[#8DC63F] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#7aaf36] transition-colors text-lg shadow-md"
            >
                Proceed to Shipping
            </button>
        </div>
      </div>
    </div>
  );
};