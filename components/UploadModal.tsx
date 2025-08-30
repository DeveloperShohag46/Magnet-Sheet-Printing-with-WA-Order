
import React, { useState, useCallback } from 'react';
import { XIcon } from './icons/XIcon';
import { UploadIcon } from './icons/UploadIcon';

interface UploadModalProps {
  onClose: () => void;
  onAddToCart: (file: File, previewUrl: string) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ onClose, onAddToCart }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      if(previewUrl) URL.revokeObjectURL(previewUrl);

      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);


  const handleAddToCartClick = () => {
    if (file && previewUrl) {
      onAddToCart(file, previewUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity animate-fadeIn">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-gray-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Upload Your Artwork</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <div 
            className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${isDragging ? 'border-[#00AEEF] bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
              accept="image/*,application/pdf,.ai,.psd"
            />
             {previewUrl ? (
                <img src={previewUrl} alt="Artwork preview" className="w-full h-full object-contain p-2 rounded-lg" />
              ) : (
                <div className="text-center text-gray-500">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400"/>
                    <p className="mt-2 font-semibold text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs">PDF, AI, PSD, PNG, JPG</p>
                </div>
              )}
          </div>
          {file && (
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>File: <span className="font-medium text-gray-800">{file.name}</span></p>
            </div>
          )}
          <div className="mt-6 flex flex-col gap-3">
             <button 
                onClick={handleAddToCartClick}
                disabled={!file}
                className="w-full bg-[#00AEEF] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#0098d7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00AEEF]"
            >
              Add to Cart
            </button>
             <button onClick={onClose} className="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition-all duration-200">
                Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};