import React from 'react';
import { Copy, Download, Sparkles, Clock, CheckCircle, Brain, Zap } from 'lucide-react';

interface Caption {
  id: string;
  text: string;
  confidence: number;
  style: string;
  model: string;
  timestamp: Date;
}

interface CaptionDisplayProps {
  captions: Caption[];
  isLoading: boolean;
}

export const CaptionDisplay: React.FC<CaptionDisplayProps> = ({
  captions,
  isLoading,
}) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadCaption = (caption: Caption) => {
    const element = document.createElement('a');
    const file = new Blob([caption.text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `caption-${caption.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getModelIcon = (model: string) => {
    switch (model) {
      case 'BLIP':
        return <Brain className="w-4 h-4" />;
      case 'ViT-GPT2':
        return <Zap className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'descriptive':
        return 'bg-blue-500';
      case 'detailed':
        return 'bg-purple-500';
      case 'creative':
        return 'bg-green-500';
      case 'technical':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-md">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            <h2 className="text-xl font-semibold text-white">Processing your image...</h2>
          </div>
          <p className="text-gray-400 text-center mb-4">
            Please wait while we analyze your image and generate captions.
          </p>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-800 rounded-lg h-16"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (captions.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h2 className="text-xl font-semibold text-white">Generated Captions</h2>
        </div>

        <div className="space-y-6">
          {captions.map((caption, index) => (
            <div
              key={caption.id}
              className="group p-5 bg-gray-800 border border-gray-700 rounded-lg hover:border-indigo-500 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-8 h-8 ${getStyleColor(caption.style)} rounded-full text-white text-sm font-medium`}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-white font-medium capitalize">{caption.style} Style</h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                      {getModelIcon(caption.model)}
                      <span>{caption.model}</span>
                      <span className="text-gray-500">•</span>
                      <Clock className="w-4 h-4" />
                      <span>{caption.timestamp.toLocaleTimeString()}</span>
                      <span className="text-gray-500">•</span>
                      <span>Confidence: {Math.round(caption.confidence * 100)}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => copyToClipboard(caption.text)}
                    className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
                    title="Copy caption"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => downloadCaption(caption)}
                    className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
                    title="Download caption"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                  <div
                    className={`${getStyleColor(caption.style)} h-2 rounded-full`}
                    style={{ width: `${caption.confidence * 100}%` }}
                  ></div>
                </div>
                <p className="text-gray-300 text-base">{caption.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          Powered by <span className="text-gray-200">BLIP</span> & <span className="text-gray-200">ViT-GPT2</span> models.
        </div>
      </div>
    </div>
  );
};
