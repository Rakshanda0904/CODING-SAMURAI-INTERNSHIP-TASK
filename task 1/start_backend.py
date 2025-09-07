#!/usr/bin/env python3
"""
Startup script for the AI Image Caption Generator backend.
This script handles model downloading and server initialization.
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def check_requirements():
    """Check if required packages are installed"""
    try:
        import torch
        import transformers
        import fastapi
        import uvicorn
        import PIL
        print("✅ All required packages are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing required package: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def check_models():
    """Check if models are already cached"""
    cache_dir = Path.home() / ".cache" / "huggingface" / "transformers"
    
    models_to_check = [
        "models--Salesforce--blip-image-captioning-base",
        "models--nlpconnect--vit-gpt2-image-captioning"
    ]
    
    cached_models = []
    for model in models_to_check:
        if (cache_dir / model).exists():
            cached_models.append(model)
    
    if len(cached_models) == len(models_to_check):
        print("✅ All AI models are already cached")
        return True
    else:
        print(f"📥 {len(models_to_check) - len(cached_models)} models need to be downloaded")
        return False

def download_models():
    """Pre-download models to avoid timeout during first request"""
    print("🤖 Pre-downloading AI models...")
    print("This may take 5-10 minutes depending on your internet connection...")
    
    try:
        from transformers import BlipProcessor, BlipForConditionalGeneration
        from transformers import VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer
        
        print("📥 Downloading BLIP model...")
        BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
        BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
        print("✅ BLIP model downloaded")
        
        print("📥 Downloading ViT-GPT2 model...")
        VisionEncoderDecoderModel.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
        ViTImageProcessor.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
        AutoTokenizer.from_pretrained("nlpconnect/vit-gpt2-image-captioning")
        print("✅ ViT-GPT2 model downloaded")
        
        print("🎉 All models downloaded successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error downloading models: {e}")
        return False

def start_server():
    """Start the FastAPI server"""
    print("🚀 Starting AI Caption Generator server...")
    print("Server will be available at: http://localhost:8000")
    print("Health check: http://localhost:8000/health")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        os.chdir(Path(__file__).parent)
        subprocess.run([sys.executable, "backend/main.py"], check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Server error: {e}")

def main():
    print("🤖 AI Image Caption Generator - Backend Startup")
    print("=" * 50)
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Check and download models if needed
    if not check_models():
        if not download_models():
            print("❌ Failed to download models. Please check your internet connection.")
            sys.exit(1)
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()