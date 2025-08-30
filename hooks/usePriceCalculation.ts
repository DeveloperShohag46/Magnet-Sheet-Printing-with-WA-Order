
import { useMemo } from 'react';
import { ProductOptions, PriceDetails, AppConfigType } from '../types';

export const usePriceCalculation = (options: ProductOptions, pricingConfig: AppConfigType['pricing']): PriceDetails => {
  const { 
      basePricePerSheet: BASE_PRICE, 
      multipliers,
      volumeDiscount
  } = pricingConfig;

  const printingMultipliers: { [key: string]: number } = multipliers.printing;
  const laminationMultipliers: { [key: string]: number } = multipliers.lamination;
  const shapeMultipliers: { [key: string]: number } = multipliers.shape;

  return useMemo(() => {
    const optionCosts: { label: string; cost: number }[] = [];
    
    const base = options.size === 'Custom Size' ? 25 : BASE_PRICE;

    let totalMultiplier = 1;
    totalMultiplier *= printingMultipliers[options.printing] || 1;
    totalMultiplier *= shapeMultipliers[options.shape] || 1;
    
    let pricePerSheet = base * totalMultiplier;
    pricePerSheet += base * (laminationMultipliers[options.lamination] || 0);

    let subtotal = pricePerSheet * options.quantity;

    // Volume Discount Calculation
    if (volumeDiscount.enabled && options.quantity >= volumeDiscount.minQuantity) {
      const discountIncrements = Math.floor(options.quantity / volumeDiscount.increment);
      const discountPercentage = Math.min(discountIncrements * volumeDiscount.discountPerIncrement, volumeDiscount.maxDiscount);
  
      if (discountPercentage > 0) {
        const discountAmount = subtotal * discountPercentage;
        subtotal -= discountAmount;
        optionCosts.push({ 
          label: `Volume Discount (${Math.round(discountPercentage * 100)}%)`, 
          cost: -discountAmount 
        });
      }
    }

    return {
      basePrice: base,
      optionCosts,
      totalPrice: subtotal,
    };

  }, [options, pricingConfig]);
};