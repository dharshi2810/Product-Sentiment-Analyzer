import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-jwt-key-for-development-only")
    MONGO_URI = os.getenv("MONGO_URI", os.getenv("MONGODB_URI", "mongodb://localhost:27017/product_sentiment_db"))
