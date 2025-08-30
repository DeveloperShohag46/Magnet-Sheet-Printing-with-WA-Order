
import React, { useState } from 'react';
import { CartItem, AppConfigType, ShippingDetails } from '../types';

interface ShippingPageProps {
  config: AppConfigType;
  cartItem: CartItem | null;
  onBackToCart: () => void;
}

const DetailRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between py-2">
    <dt className="text-sm text-gray-500">{label}</dt>
    <dd className="text-sm font-medium text-gray-800 text-right">{value}</dd>
  </div>
);

const InputField: React.FC<{ label: string; name: keyof ShippingDetails; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; error?: string; type?: string; required?: boolean, rows?: number }> = 
({ label, name, value, onChange, error, type = 'text', required = true, rows }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1">
            {type === 'textarea' ? (
                 <textarea 
                    id={name} 
                    name={name}
                    value={value}
                    onChange={onChange}
                    rows={rows || 3}
                    required={required}
                    className={`w-full bg-white border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] transition-all duration-200 ${error ? 'border-red-500' : 'border-gray-300'}`}
                />
            ) : (
                <input 
                    type={type} 
                    id={name} 
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`w-full bg-white border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] transition-all duration-200 ${error ? 'border-red-500' : 'border-gray-300'}`}
                />
            )}
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

export const ShippingPage: React.FC<ShippingPageProps> = ({ config, cartItem, onBackToCart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
      name: '',
      email: '',
      phone: '',
      address: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingDetails, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({...prev, [name]: value}));
    if (errors[name as keyof ShippingDetails]) {
      setErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingDetails, string>> = {};
    if (!shippingDetails.name.trim()) newErrors.name = "Name is required.";
    if (!shippingDetails.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!shippingDetails.email.trim()) {
        newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(shippingDetails.email)) {
        newErrors.email = "Email is not valid.";
    }
    if (!shippingDetails.address.trim()) newErrors.address = "Address is required for delivery estimate.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handlePlaceOrder = async () => {
    if (!validateForm() || !cartItem) return;

    setIsLoading(true);

    let artworkUrl = "Artwork was not provided by the customer.";

    // --- LIVE FILE UPLOAD ---
    if (cartItem.artwork) {
      try {
        const formData = new FormData();
        // The key 'artwork' must match the key expected by the PHP script.
        formData.append('artwork', cartItem.artwork.file);
        
        const response = await fetch('https://klccprint.com/wp-json/klcc-print/v1/upload-artwork', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
            // Attempt to parse error message from the server's JSON response
            const errorData = await response.json().catch(() => ({ message: `File upload failed with status: ${response.status}` }));
            throw new Error(errorData.message || 'File upload failed due to a server error.');
        }

        const result = await response.json();

        // Check for a successful response structure from the PHP script
        if (!result.success || !result.url) {
          throw new Error(result.message || 'Server did not return a valid file URL.');
        }
        artworkUrl = result.url; // The URL of the uploaded file from your server
      } catch (error) {
        console.error("Upload Error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during upload.";
        alert(`There was an error uploading your artwork: ${errorMessage}\nPlease try again or contact us directly.`);
        setIsLoading(false);
        return;
      }
    }

    // --- GENERATE WHATSAPP MESSAGE ---
    const { options, priceDetails } = cartItem;
    const { phoneNumber } = config.content.whatsAppCta;

    const messageParts = [
      `*New Magnet Sheet Order Request*`,
      `---------------------------------`,
      `*Order Details:*`,
      `*- Size:* ${options.size === 'Custom Size' ? `${options.customWidth}x${options.customHeight} ${options.unit}` : options.size}`,
      `*- Quantity:* ${options.quantity} A3 Sheets`,
      `*- Printing:* ${options.printing}`,
      `*- Material:* ${options.material}`,
      `*- Shape:* ${options.shape}`,
      `*- Shipping:* ${options.shipping === 'ride' ? 'Ride Hailing' : 'Self Pickup'}`,
      `---------------------------------`,
      `*Artwork Link:*`,
      `${artworkUrl}`,
      `---------------------------------`,
      `*Customer Details:*`,
      `*- Name:* ${shippingDetails.name}`,
      `*- Phone:* ${shippingDetails.phone}`,
      `*- Email:* ${shippingDetails.email}`,
      `*- Address:*`,
      `${shippingDetails.address}`,
      `---------------------------------`,
      `*Price Breakdown:*`,
      ...priceDetails.optionCosts.map(item => `  - ${item.label}: ${item.cost < 0 ? `-RM${(-item.cost).toFixed(2)}` : `RM${item.cost.toFixed(2)}`}`),
      `*Total: RM ${priceDetails.totalPrice.toFixed(2)}*`,
      `---------------------------------`,
      `Please confirm this order and provide payment details.`
    ];

    const encodedMessage = encodeURIComponent(messageParts.join('\n'));
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.location.href = whatsappUrl;
    setIsLoading(false);
  };

  if (!cartItem) {
    return (
      <div className="bg-white text-gray-800 min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Redirecting you back to the product page...</p>
        {setTimeout(() => onBackToCart(), 2000)}
      </div>
    );
  }

  const { options, priceDetails } = cartItem;

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBackToCart} className="text-[#00AEEF] hover:text-[#0098d7] mb-6 text-sm font-semibold">
          &larr; Back to Cart
        </button>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">Shipping Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-200 shadow-lg h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="flex flex-col gap-4">
                <InputField label="Full Name" name="name" value={shippingDetails.name} onChange={handleInputChange} error={errors.name} />
                <InputField label="Email" name="email" type="email" value={shippingDetails.email} onChange={handleInputChange} error={errors.email} />
                <InputField label="Phone Number" name="phone" type="tel" value={shippingDetails.phone} onChange={handleInputChange} error={errors.phone} />
                <InputField label="Shipping Address" name="address" type="textarea" value={shippingDetails.address} onChange={handleInputChange} error={errors.address} />
            </div>
          </div>
          
          {/* Order Summary Section */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-4">Order Summary</h2>
                <dl className="divide-y divide-gray-200">
                    <div className="py-3 space-y-2">
                        <DetailRow label="Artwork Size" value={options.size === 'Custom Size' ? `${options.customWidth}x${options.customHeight} ${options.unit}` : options.size} />
                        <DetailRow label="Quantity" value={`${options.quantity} A3 Sheets`} />
                        <DetailRow label="Printing" value={options.printing} />
                        <DetailRow label="Shape" value={options.shape} />
                    </div>
                    <div className="py-3 space-y-1">
                        {priceDetails.optionCosts.map((item, i) => (
                            <div key={i} className={`flex justify-between text-sm ${item.cost < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                                <span>{item.label}</span>
                                <span>{item.cost < 0 ? `- RM ${(-item.cost).toFixed(2)}` : `RM ${item.cost.toFixed(2)}`}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-3">
                        <span>Total</span>
                        <span>RM {priceDetails.totalPrice.toFixed(2)}</span>
                    </div>
                </dl>
                <div className="mt-8">
                    <button 
                        onClick={handlePlaceOrder}
                        disabled={isLoading}
                        className="w-full bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors text-lg disabled:bg-gray-400 disabled:cursor-wait shadow-md"
                    >
                        {isLoading ? 'Processing...' : 'Place Order via WhatsApp'}
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};