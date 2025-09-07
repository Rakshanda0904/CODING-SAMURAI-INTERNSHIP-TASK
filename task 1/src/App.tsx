import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { CaptionDisplay } from './components/CaptionDisplay';
import { StatsDisplay } from './components/StatsDisplay';
import { ServerStatus } from './components/ServerStatus';
import { useImageCaption } from './hooks/useImageCaption';
import { AlertCircle, RefreshCw, Settings } from 'lucide-react';

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [captionStyle, setCaptionStyle] = useState<string>('all');
  const { 
    captions, 
    isLoading, 
    error, 
    stats, 
    serverStatus,
    generateCaptions,
    generateSingleCaption,
    clearCaptions,
    checkServerStatus,
  } = useImageCaption();

  const handleImageSelect = async (file: File) => {
    setSelectedImage(file);
    
    if (captionStyle === 'all') {
      await generateCaptions(file);
    } else {
      await generateSingleCaption(file, captionStyle);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    clearCaptions();
  };

  const handleRegenerateCaption = async () => {
    if (selectedImage) {
      if (captionStyle === 'all') {
        await generateCaptions(selectedImage);
      } else {
        await generateSingleCaption(selectedImage, captionStyle);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Server Status */}
        <ServerStatus 
          serverStatus={serverStatus} 
          onCheckStatus={checkServerStatus}
        />

        {/* Stats Display */}
        {stats.totalImages > 0 && serverStatus.isRunning && (
          <div className="mb-12">
            <StatsDisplay {...stats} />
          </div>
        )}

        <div className="space-y-12">
          {/* Caption Style Selector */}
          {serverStatus.isRunning && (
            <section className="max-w-2xl mx-auto">
              <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Settings className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-semibold text-gray-100">Caption Generation Mode</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { value: 'all', label: 'All Styles', desc: 'Generate multiple captions' },
                    { value: 'descriptive', label: 'Descriptive', desc: 'BLIP model' },
                    { value: 'detailed', label: 'Detailed', desc: 'ViT-GPT2 model' },
                    { value: 'creative', label: 'Creative', desc: 'Enhanced style' },
                    { value: 'technical', label: 'Technical', desc: 'Detailed specs' },
                  ].map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setCaptionStyle(style.value)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        captionStyle === style.value
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <div>{style.label}</div>
                      <div className="text-xs opacity-75 mt-1">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Image Upload Section */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                AI-Powered Image Analysis
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Upload any image and watch our advanced AI models analyze it using 
                state-of-the-art computer vision and natural language processing.
              </p>
            </div>
            
            <ImageUpload
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onClearImage={handleClearImage}
            />
          </section>

          {/* Error Display */}
          {error && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-900 border border-red-600 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-300">Error</h3>
                  <p className="text-red-200 mt-1">{error}</p>
                  {selectedImage && serverStatus.isRunning && (
                    <button
                      onClick={handleRegenerateCaption}
                      className="mt-3 inline-flex items-center space-x-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md font-medium transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Try again</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Caption Display */}
          <section>
            <CaptionDisplay captions={captions} isLoading={isLoading} />
          </section>

          {/* Regenerate Button */}
          {selectedImage && captions.length > 0 && !isLoading && serverStatus.isRunning && (
            <div className="text-center">
              <button
                onClick={handleRegenerateCaption}
                className="inline-flex items-center space-x-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-all duration-200 shadow-md"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Generate New Captions</span>
              </button>
            </div>
          )}

          {/* Features Section */}
          {!selectedImage && serverStatus.isRunning && (
            <section className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gray-700 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Real AI Models</h3>
                  <p className="text-gray-400 text-sm">
                    Powered by BLIP and ViT-GPT2 models running on your local machine
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gray-700 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">GPU Accelerated</h3>
                  <p className="text-gray-400 text-sm">
                    Automatic GPU detection for faster processing when available
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gray-700 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Multiple Models</h3>
                  <p className="text-gray-400 text-sm">
                    Choose from different AI models for varied caption styles
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-700 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500">
          <p>&copy; 2025 AI Caption Generator. Powered by BLIP, ViT-GPT2, and Transformers.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
