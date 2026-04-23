"""
Configuration for InfluenceHub Flask Backend
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # MongoDB
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/influencehub")

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key-change-in-production")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_TOKEN_LOCATION = ["headers"]

    # Cloudinary (optional)
    CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "dt5dpbdb4")
    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "425916216982491")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "fEXfiWDQCLPzJ-dH-0Hdx4E5sbg")

    # App
    DEBUG = os.getenv("FLASK_DEBUG", "True") == "True"
    SECRET_KEY = os.getenv("SECRET_KEY", "flask-secret-change-in-production")
    
    # File Upload Configuration
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB max file upload size