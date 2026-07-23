from pymongo import MongoClient
from config import Config

class Database:
    def __init__(self):
        try:
            self.client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=5000)
            
            # Extract default DB from URI, or fallback to 'product_sentiment_db'
            try:
                self.db = self.client.get_database()
            except Exception:
                self.db = self.client["product_sentiment_db"]
                
            # Initialize collections
            self.users = self.db.users
            self.products = self.db.products
            self.reviews = self.db.reviews
            self.search_history = self.db.search_history
            self.analytics = self.db.analytics
            
            # Create indexes
            self.users.create_index("email", unique=True)
            self.products.create_index("name", unique=True)
            self.reviews.create_index([("product_id", 1), ("reviewer", 1), ("date", 1)], unique=True) # Basic duplicate prevention
            print(f"Connected to MongoDB successfully: {self.db.name}")
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            self.db = None

# Global database instance
db = Database()
