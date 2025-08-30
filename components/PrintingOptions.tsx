
import React, { useEffect } from 'react';
import { ProductOptions } from '../types';

interface PrintingOptionsProps {
  options: ProductOptions;
  onOptionChange: <K extends keyof ProductOptions>(key: K, value: ProductOptions[K]) => void;
  optionLists: {
    size: string[];
    quantity: (string | number)[];
    printing: string[];
    lamination: string[];
    material: string[];
    shape: string[];
  }
}

export const PrintingOptions: React.FC<PrintingOptionsProps> = ({ options, onOptionChange, optionLists }) => {

  useEffect(() => {
    // Automatically set shape for round sizes
    if (options.size.toLowerCase().includes('round')) {
      if (options.shape !== 'Circle/Oval') {
        onOptionChange('shape', 'Circle/Oval');
      }
    } else if (options.size === 'Custom Size') {
      // Default custom size to square
      if (options.shape === 'Circle/Oval') {
        onOptionChange('shape', 'Square/Rectangle');
      }
    }
  }, [options.size, options.shape, onOptionChange]);

  const handleQuantitySelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    onOptionChange('quantitySelection', value);
    if (value !== 'Custom') {
      onOptionChange('quantity', parseInt(value, 10));
    }
  };
  
  const getPiecesPerSheet = (size: string): number => {
    if (size.includes('7cm')) return 15;
    if (size.includes('55mm')) return 24;
    return 0;
  };

  const totalPieces = getPiecesPerSheet(options.size) * options.quantity;

  const OptionWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">{title}</label>
      {children}
    </div>
  );

  const SelectInput: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode; disabled?: boolean }> = ({ value, onChange, children, disabled }) => (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      {children}
    </select>
  );

  const RadioGroup: React.FC<{ name: string; selectedValue: string; options: {value: string; label: string; description?: string}[]; onChange: (value: string) => void }> = ({ name, selectedValue, options: radioOptions, onChange }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {radioOptions.map(opt => (
            <label key={opt.value} className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${selectedValue === opt.value ? 'bg-[#00AEEF]/10 border-[#00AEEF]' : 'bg-white border-gray-300 hover:border-gray-400'}`}>
                <input type="radio" name={name} value={opt.value} checked={selectedValue === opt.value} onChange={() => onChange(opt.value)} className="hidden" />
                <span className="font-semibold text-gray-800 block">{opt.label}</span>
                {opt.description && <span className="text-xs text-gray-500">{opt.description}</span>}
            </label>
        ))}
    </div>
  );


  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Customize Your Order</h2>
      <div className="flex flex-col gap-y-6">
        <OptionWrapper title="Individual Artwork Size">
          <SelectInput value={options.size} onChange={(e) => onOptionChange('size', e.target.value)}>
            {optionLists.size.map(s => <option key={s} value={s}>{s}</option>)}
          </SelectInput>
           <p className="text-xs text-gray-500 mt-1">
            Pricing is based on the quantity of A3 sheets. Select your desired individual sticker size here.
          </p>
        </OptionWrapper>

        {options.size === 'Custom Size' && (
          <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <input 
                type="number"
                placeholder="Width"
                value={options.customWidth}
                onChange={(e) => onOptionChange('customWidth', e.target.value)}
                className="col-span-1 bg-white border-gray-300 text-gray-800 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF]"
              />
               <input 
                type="number"
                placeholder="Height"
                value={options.customHeight}
                onChange={(e) => onOptionChange('customHeight', e.target.value)}
                className="col-span-1 bg-white border-gray-300 text-gray-800 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF]"
              />
              <SelectInput value={options.unit} onChange={(e) => onOptionChange('unit', e.target.value as ProductOptions['unit'])}>
                <option value="mm">mm</option>
                <option value="cm">cm</option>
                <option value="in">in</option>
              </SelectInput>
          </div>
        )}

        <OptionWrapper title="Quantity (A3 Sheets)">
          <SelectInput value={options.quantitySelection} onChange={handleQuantitySelectionChange}>
            {optionLists.quantity.map(q => <option key={q} value={String(q)}>{q}</option>)}
          </SelectInput>
          {totalPieces > 0 && (
             <p className="text-sm font-semibold text-[#00AEEF] mt-1">
                Total Pieces: {totalPieces}
            </p>
          )}
        </OptionWrapper>

        {options.quantitySelection === 'Custom' && (
           <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg -mt-3">
              <label className="text-xs text-gray-500 mb-1 block">Custom Quantity</label>
              <input 
                type="number"
                placeholder="Enter quantity"
                value={options.quantity}
                min="1"
                onChange={(e) => onOptionChange('quantity', Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full bg-white border-gray-300 text-gray-800 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF]"
              />
          </div>
        )}

        <OptionWrapper title="Printing">
          <SelectInput value={options.printing} onChange={(e) => onOptionChange('printing', e.target.value)}>
            {optionLists.printing.map(p => <option key={p} value={p}>{p}</option>)}
          </SelectInput>
        </OptionWrapper>
        
        <OptionWrapper title="Lamination">
          <SelectInput value={options.lamination} onChange={(e) => onOptionChange('lamination', e.target.value)}>
            {optionLists.lamination.map(l => <option key={l} value={l}>{l}</option>)}
          </SelectInput>
        </OptionWrapper>

        <OptionWrapper title="Material">
          <SelectInput 
            value={options.material} 
            onChange={() => {}}
            disabled={true}
          >
            {optionLists.material.map(m => <option key={m} value={m}>{m}</option>)}
          </SelectInput>
          <p className="text-xs text-gray-500 mt-1">Currently we only have 1 type of material</p>
        </OptionWrapper>
        
        <OptionWrapper title="Magnet Shape">
          <SelectInput 
            value={options.shape} 
            onChange={(e) => onOptionChange('shape', e.target.value)}
            disabled={options.size.toLowerCase().includes('round')}
          >
            {optionLists.shape.map(s => <option key={s} value={s}>{s}</option>)}
          </SelectInput>
           {options.size.toLowerCase().includes('round') && 
            <p className="text-xs text-gray-500 mt-1">Shape is automatically set to Circle/Oval for round sizes.</p>}
        </OptionWrapper>
        
        <OptionWrapper title="Shipping Method">
            <RadioGroup
                name="shipping"
                selectedValue={options.shipping}
                onChange={(value) => onOptionChange('shipping', value as ProductOptions['shipping'])}
                options={[
                    {value: 'pickup', label: 'Self Pickup', description: 'Free'},
                    {value: 'ride', label: 'Ride Hailing', description: 'Arrange own'},
                ]}
            />
        </OptionWrapper>
      </div>
    </div>
  );
};