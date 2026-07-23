from collections import Counter
import re
from typing import List, Dict

def generate_summary(reviews: List[Dict]) -> str:
    """
    Generates a brief summary based on sentiment distribution.
    """
    if not reviews:
        return "No reviews available for summary."
        
    total = len(reviews)
    pos = sum(1 for r in reviews if r.get("sentiment") == "Positive")
    neg = sum(1 for r in reviews if r.get("sentiment") == "Negative")
    
    pos_pct = (pos / total) * 100
    
    if pos_pct > 80:
        return "This product has overwhelmingly positive reviews. Most users are highly satisfied."
    elif pos_pct > 60:
        return "This product has generally positive reviews, though some users reported minor issues."
    elif pos_pct > 40:
        return "This product has mixed reviews. Users have varied opinions about its value and performance."
    else:
        return "This product has mostly negative reviews. Users frequently cite dissatisfaction."

def extract_keywords(reviews: List[Dict], top_n: int = 20) -> List[Dict]:
    """
    Extracts the most frequent meaningful keywords for a word cloud.
    """
    stop_words = set(["the", "and", "is", "it", "to", "a", "of", "for", "in", "this", "that", "with", "i", "my", "on", "but", "very", "product", "good", "phone", "so", "as", "have", "are", "not", "it's", "be", "was", "all"])
    
    all_text = " ".join([r.get("review", "").lower() for r in reviews])
    words = re.findall(r'\b[a-z]{4,}\b', all_text)
    
    filtered_words = [w for w in words if w not in stop_words]
    
    word_counts = Counter(filtered_words)
    
    # Format for react-wordcloud: [{"text": "battery", "value": 50}, ...]
    result = [{"text": word, "value": count} for word, count in word_counts.most_common(top_n)]
    return result

def calculate_metrics(reviews: List[Dict]) -> Dict:
    """
    Calculates aggregated metrics for charts.
    """
    total = len(reviews)
    if total == 0:
        return {}
        
    pos = sum(1 for r in reviews if r.get("sentiment") == "Positive")
    neg = sum(1 for r in reviews if r.get("sentiment") == "Negative")
    neu = sum(1 for r in reviews if r.get("sentiment") == "Neutral")
    
    avg_rating = sum(r.get("rating", 0) for r in reviews) / total
    
    # Rating distribution
    ratings = [r.get("rating", 0) for r in reviews]
    rating_counts = Counter(ratings)
    rating_dist = [{"rating": str(k), "count": v} for k, v in sorted(rating_counts.items())]
    
    return {
        "total_reviews": total,
        "average_rating": round(avg_rating, 1),
        "sentiment_distribution": {
            "positive": pos,
            "negative": neg,
            "neutral": neu,
            "positive_pct": round((pos/total)*100, 1),
            "negative_pct": round((neg/total)*100, 1),
            "neutral_pct": round((neu/total)*100, 1),
        },
        "rating_distribution": rating_dist
    }
