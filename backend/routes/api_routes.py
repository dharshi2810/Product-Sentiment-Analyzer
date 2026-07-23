from flask import Blueprint, request, jsonify
from datetime import datetime
from database import db
from middleware.auth_middleware import token_required
from services.scraper import scrape_product
from services.sentiment import analyze_reviews
from services.analytics import generate_summary, extract_keywords, calculate_metrics
from bson import ObjectId

api_bp = Blueprint('api', __name__)

@api_bp.route('/search', methods=['POST'])
@token_required
def search_product(current_user_id):
    data = request.get_json()
    product_name = data.get('product_name')
    
    if not product_name:
        return jsonify({'message': 'Product name is required'}), 400
        
    if db.db is None:
        return jsonify({'message': 'Database not connected'}), 500
        
    # Check if we recently scraped this product (cache essentially)
    existing_product = db.products.find_one({"name": {"$regex": f"^{product_name}$", "$options": "i"}})
    
    if existing_product:
        # Get existing reviews
        reviews_cursor = db.reviews.find({"product_id": existing_product["_id"]})
        reviews = list(reviews_cursor)
        
        # Log search history
        db.search_history.insert_one({
            "user_id": current_user_id,
            "keyword": product_name,
            "timestamp": datetime.utcnow(),
            "total_reviews_found": len(reviews),
            "average_rating": existing_product.get("average_rating", 0)
        })
        
        return jsonify({
            "success": True,
            "message": "Loaded from database",
            "count": len(reviews),
            "product_id": str(existing_product["_id"])
        }), 200

    # If not in DB, scrape it
    raw_reviews = scrape_product(product_name)
    
    if not raw_reviews:
        return jsonify({"success": False, "message": "No reviews found or failed to scrape"}), 404
        
    # Analyze Sentiment
    analyzed_reviews = analyze_reviews(raw_reviews)
    
    # Calculate metrics
    metrics = calculate_metrics(analyzed_reviews)
    
    # Save Product
    product_res = db.products.insert_one({
        "name": product_name,
        "total_reviews": len(analyzed_reviews),
        "average_rating": metrics.get("average_rating", 0),
        "created_at": datetime.utcnow()
    })
    product_id = product_res.inserted_id
    
    # Save Reviews
    for review in analyzed_reviews:
        review["product_id"] = product_id
        try:
            db.reviews.insert_one(review)
        except Exception as e:
            # Skip duplicates based on index
            pass
            
    # Log search history
    db.search_history.insert_one({
        "user_id": current_user_id,
        "keyword": product_name,
        "timestamp": datetime.utcnow(),
        "total_reviews_found": len(analyzed_reviews),
        "average_rating": metrics.get("average_rating", 0)
    })
    
    return jsonify({
        "success": True,
        "message": "Scraped and analyzed successfully",
        "count": len(analyzed_reviews),
        "product_id": str(product_id)
    }), 200

@api_bp.route('/reviews/<product_id>', methods=['GET'])
@token_required
def get_reviews(current_user_id, product_id):
    try:
        reviews_cursor = db.reviews.find({"product_id": ObjectId(product_id)}, {'_id': 0, 'product_id': 0})
        reviews = list(reviews_cursor)
        return jsonify(reviews), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api_bp.route('/summary/<product_id>', methods=['GET'])
@token_required
def get_summary(current_user_id, product_id):
    try:
        reviews_cursor = db.reviews.find({"product_id": ObjectId(product_id)}, {'_id': 0, 'product_id': 0})
        reviews = list(reviews_cursor)
        summary = generate_summary(reviews)
        metrics = calculate_metrics(reviews)
        return jsonify({"summary": summary, "metrics": metrics}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api_bp.route('/keywords/<product_id>', methods=['GET'])
@token_required
def get_keywords(current_user_id, product_id):
    try:
        reviews_cursor = db.reviews.find({"product_id": ObjectId(product_id)}, {'_id': 0, 'product_id': 0})
        reviews = list(reviews_cursor)
        keywords = extract_keywords(reviews)
        return jsonify({"keywords": keywords}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api_bp.route('/analytics', methods=['GET'])
@token_required
def get_global_analytics(current_user_id):
    try:
        total_products = db.products.count_documents({})
        total_reviews = db.reviews.count_documents({})
        
        # Get recent searches for this user
        recent_searches = list(db.search_history.find({"user_id": current_user_id}).sort("timestamp", -1).limit(5))
        for search in recent_searches:
            search["_id"] = str(search["_id"])
            
        return jsonify({
            "total_products": total_products,
            "total_reviews": total_reviews,
            "recent_searches": recent_searches
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api_bp.route('/history', methods=['GET'])
@token_required
def get_history(current_user_id):
    try:
        history = list(db.search_history.find({"user_id": current_user_id}).sort("timestamp", -1))
        for item in history:
            item["_id"] = str(item["_id"])
        return jsonify(history), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
