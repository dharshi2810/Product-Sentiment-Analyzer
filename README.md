# Product Sentiment Analyzer & Review Dashboard

An enterprise-grade, full-stack application that dynamically scrapes product reviews from e-commerce sites (like Flipkart and Amazon) and performs AI-driven NLP sentiment analysis to provide business insights through a beautiful React dashboard.

## 🌟 Features
- **Dynamic Web Scraping**: Real-time extraction of reviews using Selenium and undetected_chromedriver.
- **AI Sentiment Analysis**: Powered by VADER and TextBlob to classify emotion and extract trending keywords.
- **Modern Premium UI**: Built with React (Vite), Tailwind CSS, Framer Motion, and ShadCN UI principles.
- **Interactive Analytics**: Data visualization using Recharts.
- **Secure Architecture**: JWT Authentication and RESTful APIs built with Flask.
- **Scalable Database**: MongoDB Atlas integration for storing history and processed analytics.
- **Cloud Ready**: Complete Docker support via `docker-compose`.

## 📁 Project Architecture
```
Product-Sentiment-Analyzer/
├── backend/                  # Flask REST API
│   ├── models/               # Database Schemas
│   ├── routes/               # API Endpoints
│   ├── services/             # Scraper, NLP, Analytics Logic
│   ├── middleware/           # JWT Authentication
│   ├── app.py                # Entry point
│   ├── config.py             # Environment config
│   ├── database.py           # MongoDB connection
│   └── Dockerfile
├── frontend/                 # React Application (Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI (Sidebar, Cards)
│   │   ├── layouts/          # Dashboard Layouts
│   │   ├── pages/            # Landing, Auth, Dashboard, Search, Analytics
│   │   ├── App.tsx           # Router Config
│   │   └── main.tsx          # React Entry
│   ├── tailwind.config.js
│   └── Dockerfile
└── docker-compose.yml        # Orchestration
```

## 🚀 Quick Start (Docker)
The easiest way to run the entire application stack is via Docker.

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd Product-Sentiment-Analyzer
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: `http://localhost:80`
   - Backend API: `http://localhost:5000`

## 💻 Manual Setup

### Backend Setup
1. Open a terminal and navigate to the `backend` folder.
2. Create a virtual environment: `python -m venv venv`
3. Activate it:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `python app.py`

*(Ensure you have Google Chrome installed on your system for the scraper to work)*

### Frontend Setup
1. Open a terminal and navigate to the `frontend` folder.
2. Install Node.js if you haven't already.
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`

## 🔒 Security Measures
- **Authentication**: JWT-based session management.
- **Passwords**: Bcrypt hashing.
- **Anti-Bot Scraping**: Utilizes `undetected-chromedriver` to bypass CAPTCHAs and bot detection on e-commerce platforms.

## 🤝 Contributing
Please branch off `main`, commit your changes with clear messages, and submit a Pull Request for review.
