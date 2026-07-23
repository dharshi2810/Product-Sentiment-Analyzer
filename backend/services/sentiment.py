from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import nltk

try:
    nltk.download('punkt', quiet=True)
except Exception:
    pass

analyzer = SentimentIntensityAnalyzer()

def analyze_reviews(reviews: list) -> list:
    """
    Predict sentiment for every review in a list.
    Adds: sentiment, confidence, and compound_score
    """
    analyzed_reviews = []
    
    for review_item in reviews:
        text = review_item.get("review", "")
        if not text:
            review_item["sentiment"] = "Neutral"
            review_item["confidence"] = 0.5
            review_item["compound_score"] = 0.0
            analyzed_reviews.append(review_item)
            continue
            
        # VADER Analysis (better for social media/reviews)
        vader_scores = analyzer.polarity_scores(text)
        compound = vader_scores['compound']
        
        # TextBlob Analysis (fallback/hybrid approach)
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        
        # Determine final sentiment label based on VADER compound score
        if compound >= 0.05:
            sentiment_label = "Positive"
        elif compound <= -0.05:
            sentiment_label = "Negative"
        else:
            sentiment_label = "Neutral"
            
        # Calculate confidence (a bit synthetic, based on intensity)
        # Intensity is higher if positive or negative scores are high
        intensity = max(vader_scores['pos'], vader_scores['neg'])
        # If it's neutral, confidence is based on neutrality
        if sentiment_label == "Neutral":
            intensity = vader_scores['neu']
            
        # Normalize to 0-1
        confidence = round(min(intensity + 0.3, 1.0), 2)
        
        review_item["sentiment"] = sentiment_label
        review_item["confidence"] = confidence
        review_item["compound_score"] = compound
        
        analyzed_reviews.append(review_item)
        
    return analyzed_reviews
