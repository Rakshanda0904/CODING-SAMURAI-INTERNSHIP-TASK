import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClearImage: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  selectedImage,
  onClearImage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith('image/'));

      if (imageFile) {
        onImageSelect(imageFile);
        const url = URL.createObjectURL(imageFile);
        setPreviewUrl(url);
      }
    },
    [onImageSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith('image/')) {
        onImageSelect(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    },
    [onImageSelect]
  );

  const handleClear = useCallback(() => {
    onClearImage();
    setPreviewUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [onClearImage, previewUrl]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!selectedImage ? (
        <div
          className={`
            border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
            ${
              isDragging
                ? 'border-purple-500 bg-gray-800 scale-105 shadow-lg shadow-purple-500/20'
                : 'border-gray-700 hover:border-purple-400 hover:bg-gray-800'
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-6 bg-gray-800 rounded-full shadow-inner">
              <Upload className="w-12 h-12 text-purple-400" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">
                Upload an image to generate captions
              </h3>
              <p className="text-gray-400">
                Drag & drop an image here, or click to browse
              </p>
            </div>

            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-purple-500/30">
                Choose Image
              </div>
            </label>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={previewUrl || ''}
              alt="Selected for captioning"
              className="w-full h-auto max-h-96 object-contain bg-gray-900"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>

            <button
              onClick={handleClear}
              className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-700 transform hover:scale-110 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 p-4 bg-gray-800 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3">
              <ImageIcon className="w-5 h-5 text-purple-400" />
              <div>
                <p className="font-medium text-gray-200">{selectedImage.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
