

export interface ProductOptions {
  size: string;
  customWidth: string;
  customHeight: string;
  unit: 'mm' | 'cm' | 'in';
  quantity: number; // The final numeric quantity
  quantitySelection: string; // The dropdown selection (e.g., '50' or 'Custom')
  printing: string;
  material: string;
  shape: string;
  shipping: 'pickup' | 'ride';
}

export interface CartItem {
  options: ProductOptions;
  priceDetails: PriceDetails;
  artwork?: {
    file: File;
    previewUrl: string;
  };
}

export interface PriceDetails {
  basePrice: number;
  optionCosts: { label: string; cost: number }[];
  totalPrice: number;
}

export interface ShippingDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export type Page = 'product' | 'cart' | 'shipping';

// This interface defines the structure for the configuration
// data that will be fetched from the WordPress REST API.
export interface AppConfigType {
  meta: {
    title: string;
    description: string;
    name: string;
  };
  product: {
    mainHeading: string;
    images: string[];
  };
  options: {
    size: string[];
    quantity: (string | number)[];
    printing: string[];
    material: string[];
    shape: string[];
  };
  pricing: {
    basePricePerSheet: number;
    shippingCost: number;
    multipliers: {
      printing: { [key: string]: number };
      shape: { [key: string]: number };
    };
    volumeDiscount: {
      enabled: boolean;
      minQuantity: number;
      increment: number;
      discountPerIncrement: number;
      maxDiscount: number;
    };
  };
  content: {
    tabs: {
      description: {
        title: string;
        content: string;
      };
      faqs: { q: string; a: string }[];
      template: {
        title: string;
        content: string;
        downloadLink: string;
      };
      whyUs: {
        title: string;
        points: string[];
      };
    };
    benefits: {
      icon: string;
      title: string;
      description: string;
    }[];
    whatsAppCta: {
      heading: string;
      subheading: string;
      phoneNumber: string;
      message: string;
      buttonText: string;
      footerText: string;
    };
  };
  integrations: {
    wooCommerce: {
      productId: number;
      wordpressUrl: string;
    };
  };
}