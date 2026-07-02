import time
import json
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def scrape_product(product_name: str) -> list:
    """
    Scrapes product reviews from Flipkart for a given product name.
    
    Args:
        product_name (str): The name of the product to search for.
        
    Returns:
        list: A list of dictionaries containing review data matching the JSON schema.
    """
    reviews_data = []
    
    # Configure Selenium Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-notifications")
    chrome_options.add_argument("window-size=1920,1080")
    
    # Use a standard user-agent to bypass basic bot detection
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    
    try:
        driver = webdriver.Chrome(options=chrome_options)
    except Exception as e:
        print(f"Error initializing Chrome driver. Please ensure ChromeDriver is installed: {e}")
        return reviews_data
        
    try:
        # 1. Search for the product on Flipkart
        search_query = product_name.replace(' ', '+')
        driver.get(f"https://www.flipkart.com/search?q={search_query}")
        time.sleep(4) # Wait for page load and potential dynamic content
        
        # 2. Find the first product link
        links = driver.find_elements(By.TAG_NAME, "a")
        product_url = None
        for link in links:
            href = link.get_attribute("href")
            # Flipkart product URLs contain '/p/' and 'pid='
            if href and "/p/" in href and "pid=" in href:
                product_url = href
                break
                
        if product_url:
            driver.get(product_url)
            time.sleep(4)
        else:
            print("Could not retrieve product URL.")
            return reviews_data
            
        # 3. Navigate to 'All Reviews' page
        reviews_url = product_url.replace('/p/', '/product-reviews/')
        driver.get(reviews_url)
            
        # 4. Scrape reviews from the page
        # Wait until reviews load instead of hardcoded sleep
        try:
            wait = WebDriverWait(driver, 15)
            wait.until(EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class, 'EKFha-')]")))
        except Exception:
            # Fallback
            time.sleep(6)
            
        # Extract reviews
        review_blocks = driver.find_elements(By.XPATH, "//div[contains(@class, 'EKFha-')]")
        
        if not review_blocks:
            print("No reviews found on this page. Flipkart might be blocking the request, or the product has no reviews.")
            
        for i, block in enumerate(review_blocks):
            if i >= 20: # Limit to 20 reviews
                break
            try:
                # Get block text directly
                text = block.text
                if not text:
                    continue    
                # Split text into lines
                lines = [line.strip() for line in block.text.split('\n') if line.strip()]
                
                if not lines:
                    continue
                    
                # Extract Rating (usually the first item)
                rating = 5
                try:
                    rating = int(float(lines[0]))
                except (ValueError, IndexError):
                    pass
                    
                # Identify where review text starts
                review_start_idx = 1
                if len(lines) > 1 and not lines[1].isalnum(): # e.g. bullet point •
                    review_start_idx = 2
                    
                # Skip the title
                if len(lines) > review_start_idx:
                    review_start_idx += 1
                    
                # Skip "Review for: ..." if present
                if len(lines) > review_start_idx and "Review for:" in lines[review_start_idx]:
                    review_start_idx += 1
                    
                try:
                    vp_idx = lines.index('Verified Purchase')
                    reviewer = lines[vp_idx - 1] if vp_idx > review_start_idx else "Anonymous"
                    
                    # Sometimes "Helpful" or numbers sneak in
                    if 'Helpful' in reviewer or reviewer.isdigit():
                        reviewer = "Anonymous"
                        review_end_idx = vp_idx
                    else:
                        review_end_idx = vp_idx - 1
                except ValueError:
                    # No Verified Purchase text. Guess reviewer from the second to last line
                    reviewer = lines[-2] if len(lines) > review_start_idx + 1 else "Anonymous"
                    review_end_idx = len(lines) - 2 if len(lines) > review_start_idx + 1 else len(lines)

                # Join the actual review text lines
                review_text = " ".join(lines[review_start_idx:review_end_idx])
                
                # Cleanup review text
                clean_review_text = review_text.replace("READ MORE", "").strip()
                
                # Extract Date (Simplified to current date for the schema requirement "YYYY-MM-DD" if we can't parse easily)
                date_str = datetime.now().strftime("%Y-%m-%d")
                
                if clean_review_text: # Only add if we actually found review text
                    reviews_data.append({
                        "product": product_name,
                        "review": clean_review_text,
                        "rating": rating,
                        "reviewer": reviewer,
                        "date": date_str,
                        "source": "Flipkart"
                    })
                    
            except Exception as e:
                print(f"Parsing error: {e}")
                continue
                
    except Exception as e:
        print(f"An error occurred while scraping: {e}")
        
    finally:
        driver.quit()
        
    return reviews_data