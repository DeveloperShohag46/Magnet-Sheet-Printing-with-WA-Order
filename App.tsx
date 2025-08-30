

import React, { useState, useCallback, useEffect } from 'react';
import { Page, CartItem, AppConfigType, ProductOptions } from './types';
import { ProductPage } from './components/ProductPage';
import { CartPage } from './components/CartPage';
import { ShippingPage } from './components/ShippingPage';
import { fetchAppConfig } from './api';
import { LoadingSpinner } from './components/LoadingSpinner';

const getDefaultOptions = (config: AppConfigType): ProductOptions => ({
  size: config.options.size[0],
  customWidth: '',
  customHeight: '',
  unit: 'mm',
  quantity: typeof config.options.quantity[0] === 'number' ? config.options.quantity[0] : 1,
  quantitySelection: String(config.options.quantity[0]),
  printing: config.options.printing[0],
  material: config.options.material[0],
  shape: config.options.shape[1], // Default to Circle/Oval, seems intentional
  shipping: 'pickup',
});

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('product');
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const [config, setConfig] = useState<AppConfigType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ProductOptions | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const fetchedConfig = await fetchAppConfig();
        setConfig(fetchedConfig);
        setOptions(getDefaultOptions(fetchedConfig));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching configuration.');
      }
    };
    loadConfig();
  }, []);

  const handleOptionChange = useCallback(<K extends keyof ProductOptions>(key: K, value: ProductOptions[K]) => {
    setOptions(prev => (prev ? { ...prev, [key]: value } : null));
  }, []);

  const handleAddToCart = useCallback((item: CartItem) => {
    setCartItem(item);
    setCurrentPage('cart');
  }, []);

  const handleBackToProduct = useCallback(() => {
    setCurrentPage('product');
  }, []);

  const handleProceedToShipping = useCallback(() => {
    setCurrentPage('shipping');
  }, []);

  const handleBackToCart = useCallback(() => {
    setCurrentPage('cart');
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);
  
  useEffect(() => {
    if (config) {
      document.title = config.meta.title;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', config.meta.description);
      }
    }
  }, [config]);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-screen bg-red-50 text-red-800 p-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Configuration Error</h1>
        <p className="max-w-md">{error}</p>
        <p className="mt-4 text-sm text-red-600">Please contact the site administrator.</p>
      </div>
    );
  }

  if (!config || !options) {
    return <LoadingSpinner />;
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'product':
        return (
          <ProductPage 
            config={config}
            options={options}
            onOptionChange={handleOptionChange}
            onAddToCart={handleAddToCart} 
          />
        );
      case 'cart':
        return (
          <CartPage 
            cartItem={cartItem} 
            onBackToProduct={handleBackToProduct} 
            onProceedToShipping={handleProceedToShipping} 
          />
        );
      case 'shipping':
        return (
          <ShippingPage 
            config={config} 
            cartItem={cartItem} 
            onBackToCart={handleBackToCart}
          />
        );
      default:
        return null;
    }
  }

  return <>{renderPage()}</>;
};

export default App;