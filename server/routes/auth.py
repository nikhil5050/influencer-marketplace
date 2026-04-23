"""
Authentication Routes: /api/auth
- POST /register
- POST /login
- GET /me
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from bson import ObjectId
from database import mongo
from utilsfunction.utils import serialize_doc, log_activity

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    required = ["email", "password", "name", "role"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    role = data["role"].upper()
    if role not in ["BRAND", "INFLUENCER", "ADMIN"]:
        return jsonify({"error": "Role must be BRAND, INFLUENCER, or ADMIN"}), 400

    # Check if email already exists
    existing = mongo.db.users.find_one({"email": data["email"].lower()})
    if existing:
        return jsonify({"error": "Email already registered"}), 409

    # Create user
    user = {
        "email": data["email"].lower(),
        "password": generate_password_hash(data["password"]),
        "name": data["name"],
        "role": role,
        "createdAt": datetime.utcnow(),
    }
    result = mongo.db.users.insert_one(user)
    user_id = str(result.inserted_id)

    # If INFLUENCER, create influencer profile with pending status
    if role == "INFLUENCER":
        influencer_data = data.get("influencerProfile", {})
        influencer = {
            "userId": result.inserted_id,
            "name": data["name"],
            "bio": influencer_data.get("bio", ""),
            "niche": influencer_data.get("niche", []),
            "followers": influencer_data.get("followers", 0),
            "engagementRate": influencer_data.get("engagementRate", 0.0),
            "location": influencer_data.get("location", ""),
            "prices": influencer_data.get("prices", {"post": 0, "story": 0, "reel": 0}),
            "socialLinks": influencer_data.get("socialLinks", {}),
            "mediaUrls": influencer_data.get("mediaUrls", []),
            "avatar": influencer_data.get("avatar", ""),
            "status": "pending",
            "adminNotes": "",
            "approvedAt": None,
            "createdAt": datetime.utcnow(),
        }
        mongo.db.influencers.insert_one(influencer)

    # If BRAND, create brand profile
    if role == "BRAND":
        brand_data = data.get("brandProfile", {})
        brand = {
            "userId": result.inserted_id,
            "companyName": brand_data.get("companyName", data["name"]),
            "industry": brand_data.get("industry", ""),
            "website": brand_data.get("website", ""),
            "createdAt": datetime.utcnow(),
        }
        mongo.db.brands.insert_one(brand)

    # Log activity
    log_activity(result.inserted_id, "USER_REGISTERED", {"email": data["email"], "role": role})

    # Create token
    token = create_access_token(identity=user_id)

    return jsonify({
        "message": "Registration successful",
        "token": token,
        "user": {
            "id": user_id,
            "name": data["name"],
            "email": data["email"].lower(),
            "role": role,
        }
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400

    user = mongo.db.users.find_one({"email": data["email"].lower()})
    if not user or not check_password_hash(user["password"], data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user["_id"]))

    log_activity(user["_id"], "USER_LOGIN", {"email": data["email"]})

    return jsonify({
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
        }
    }), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404

    result = {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "createdAt": user["createdAt"].isoformat() if user.get("createdAt") else None,
    }

    # Attach profile based on role
    if user["role"] == "INFLUENCER":
        profile = mongo.db.influencers.find_one({"userId": user["_id"]})
        if profile:
            result["profile"] = serialize_doc(profile)

    if user["role"] == "BRAND":
        profile = mongo.db.brands.find_one({"userId": user["_id"]})
        if profile:
            result["profile"] = serialize_doc(profile)

    return jsonify(result), 200