from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from routes.auth_routes import auth_bp
from routes.api_routes import api_bp
from database import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS for the frontend
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(api_bp, url_prefix='/api')
    
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy", "db_connected": db.db is not None}), 200
        
    return app

if __name__ == '__main__':
    app = create_app()
    # Run on all interfaces for Docker compatibility
    app.run(host='0.0.0.0', port=5000, debug=True)
