# AI-Powered Image Caption Generator

A complete full-stack application that generates captions for images using state-of-the-art AI models including BLIP and ViT-GPT2.

## Features

- **Real AI Models**: Uses BLIP and ViT-GPT2 models for actual image captioning
- **Multiple Caption Styles**: Descriptive, detailed, creative, and technical captions
- **GPU Acceleration**: Automatic GPU detection for faster processing
- **Modern UI**: Beautiful React frontend with Tailwind CSS
- **Real-time Processing**: Live server status and processing feedback
- **Export Options**: Copy and download generated captions

## Architecture

### Backend (Python)
- **FastAPI**: High-performance web framework
- **PyTorch**: Deep learning framework
- **Transformers**: Hugging Face models (BLIP, ViT-GPT2)
- **PIL**: Image processing

### Frontend (React)
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client for API communication

## Setup Instructions

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

**Note**: First-time setup will download AI models (~2-3GB). This may take several minutes.

### 2. Start the Backend Server

```bash
python backend/main.py
```

The server will start on `http://localhost:8000`. Wait for the models to load completely.

### 3. Start the Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## AI Models Used

### BLIP (Bootstrapping Language-Image Pre-training)
- **Model**: `Salesforce/blip-image-captioning-base`
- **Purpose**: General image captioning with high accuracy
- **Style**: Descriptive captions

### ViT-GPT2 (Vision Transformer + GPT-2)
- **Model**: `nlpconnect/vit-gpt2-image-captioning`
- **Purpose**: Detailed image descriptions
- **Style**: More elaborate and detailed captions

## API Endpoints

### `POST /generate-captions`
Generate multiple captions using all available models.

**Request**: Multipart form with image file
**Response**: Array of captions with confidence scores and metadata

### `POST /generate-single-caption`
Generate a single caption with specified style.

**Parameters**: 
- `file`: Image file
- `style`: Caption style (descriptive, detailed)

### `GET /health`
Check server status and model information.

## System Requirements

### Minimum Requirements
- **RAM**: 8GB (16GB recommended)
- **Storage**: 5GB free space for models
- **Python**: 3.8 or higher
- **Node.js**: 16 or higher

### GPU Support
- **CUDA**: Automatic GPU detection if available
- **Performance**: 5-10x faster with GPU
- **Fallback**: CPU processing supported

## Usage

1. **Start Backend**: Run `python backend/main.py`
2. **Wait for Models**: Allow 2-5 minutes for initial model loading
3. **Start Frontend**: Run `npm run dev`
4. **Upload Image**: Drag and drop or click to select
5. **Choose Style**: Select caption generation mode
6. **Get Results**: View AI-generated captions with confidence scores

## Troubleshooting

### Backend Issues
- **Models not loading**: Check internet connection for initial download
- **Memory errors**: Ensure sufficient RAM (8GB minimum)
- **GPU not detected**: Install CUDA toolkit if using NVIDIA GPU

### Frontend Issues
- **Server offline**: Ensure backend is running on port 8000
- **CORS errors**: Backend includes CORS middleware for localhost
- **Upload failures**: Check image format (JPG, PNG, WebP supported)

## Development

### Adding New Models
1. Install model in `backend/main.py`
2. Add processing method in `CaptionGenerator` class
3. Update frontend to handle new caption styles

### Customizing Styles
- Modify `generate_creative_caption()` for creative variations
- Update `generate_technical_caption()` for technical details
- Add new style processors in the backend

## Performance Optimization

### Backend
- **Model Caching**: Models loaded once at startup
- **Image Preprocessing**: Automatic resizing for optimal processing
- **Batch Processing**: Support for multiple images (future enhancement)

### Frontend
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Client-side image compression
- **Error Boundaries**: Graceful error handling

## License

MIT License - Feel free to use and modify for your projects.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Acknowledgments

- **Hugging Face**: For providing pre-trained models
- **Salesforce**: BLIP model development
- **NLP Connect**: ViT-GPT2 model implementation
- **PyTorch Team**: Deep learning framework