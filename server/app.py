"""
InfluenceHub - Influencer Marketing Platform
Flask Backend Application
"""

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from database import init_db
from routes.auth import auth_bp
from routes.influencer import influencers_bp
from routes.admin import admin_bp
from routes.brands import brands_bp
from routes.requests import requests_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    CORS(app, origins=["http://localhost:3000", "https://*.vercel.app"], supports_credentials=True)
    JWTManager(app)
    init_db(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(influencers_bp, url_prefix="/api/influencers")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(brands_bp, url_prefix="/api/brands")
    app.register_blueprint(requests_bp, url_prefix="/api/requests")

    @app.route("/api/health")
    def health():
        return {"status": "ok", "message": "InfluenceHub API running"}, 200

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)