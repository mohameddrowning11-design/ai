
import React, { useState, useRef } from 'react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  id: string;
  label: string;
  onImageUpload: (file: ImageFile | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        const base64Data = result.split(',')[1];
        onImageUpload({ base64: base64Data, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      onImageUpload(null);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUpload(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
      <label className="block text-lg font-semibold mb-3 text-gray-300">{label}</label>
      <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 h-64 flex justify-center items-center text-center hover:border-purple-500 transition duration-300">
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <div className="text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">Click to upload or drag & drop</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          id={id}
          accept="image/*"
          onChange={handleFileChange}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ImageUploader;
