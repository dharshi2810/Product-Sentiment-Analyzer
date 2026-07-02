import json
from scraper import scrape_product

def main():
    print("===========================================")
    print("        Flipkart Sentiment Scraper         ")
    print("===========================================")
    
    # 1. Ask the user for input dynamically!
    user_product = input("\nEnter the product name you want to search: ")
    
    if not user_product.strip():
        print("Product name cannot be empty. Exiting...")
        return
        
    print(f"\n[app.py] Calling scraper.py for '{user_product}'...")
    print("[app.py] (Please wait 10-15 seconds for Chrome to scrape in the background)")
    
    # 2. Call the scraper module
    reviews = scrape_product(user_product)
    
    # 3. Print the results in JSON format
    print(f"\n✅ Scraping complete! Found {len(reviews)} reviews.")
    print("JSON Data:")
    print(json.dumps(reviews, indent=4))

if __name__ == "__main__":
    main()
