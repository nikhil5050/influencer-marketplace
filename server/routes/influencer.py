"""
Influencer Routes: /api/influencers
- GET /        -> List approved influencers (public, with filters)
- GET /:id     -> Get influencer by ID (approved only, public)
- PUT /profile -> Update own influencer profile (JWT, INFLUENCER only)
- POST /media/upload -> Upload media file (image/video)
- POST /media/delete -> Delete media file
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from bson import ObjectId
from database import mongo
from utilsfunction.utils import serialize_doc
import os
import base64
from werkzeug.utils import secure_filename

influencers_bp = Blueprint("influencers", __name__)


@influencers_bp.route("/", methods=["GET"])
def list_influencers():
    """Public endpoint: list approved influencers with filters"""
    query = {"status": "approved"}

    # Filters
    niche = request.args.get("niche")
    if niche:
        query["niche"] = {"$in": [niche]}

    location = request.args.get("location")
    if location:
        query["location"] = {"$regex": location, "$options": "i"}

    min_followers = request.args.get("minFollowers")
    max_followers = request.args.get("maxFollowers")
    if min_followers or max_followers:
        query["followers"] = {}
        if min_followers:
            query["followers"]["$gte"] = int(min_followers)
        if max_followers:
            query["followers"]["$lte"] = int(max_followers)

    min_price = request.args.get("minPrice")
    max_price = request.args.get("maxPrice")
    if min_price or max_price:
        query["prices.post"] = {}
        if min_price:
            query["prices.post"]["$gte"] = int(min_price)
        if max_price:
            query["prices.post"]["$lte"] = int(max_price)

    search = request.args.get("search")
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"bio": {"$regex": search, "$options": "i"}},
        ]

    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 12))
    skip = (page - 1) * limit

    influencers = list(mongo.db.influencers.find(query).skip(skip).limit(limit))
    total = mongo.db.influencers.count_documents(query)

    return jsonify({
        "influencers": [serialize_doc(i) for i in influencers],
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
    }), 200


@influencers_bp.route("/<influencer_id>", methods=["GET"])
def get_influencer(influencer_id):
    """Public: get approved influencer by ID"""
    try:
        influencer = mongo.db.influencers.find_one({
            "_id": ObjectId(influencer_id),
            "status": "approved"
        })
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if not influencer:
        return jsonify({"error": "Influencer not found or not approved"}), 404

    # Get user info
    user = mongo.db.users.find_one({"_id": influencer["userId"]})
    result = serialize_doc(influencer)
    if user:
        result["userEmail"] = user["email"]

    return jsonify(result), 200


@influencers_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    """Update influencer's own profile"""
    try:
        user_id = get_jwt_identity()
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})

        if not user or user["role"] != "INFLUENCER":
            return jsonify({"error": "Only influencers can update profiles"}), 403

        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        allowed_fields = ["bio", "niche", "followers", "engagementRate", "location",
                          "prices", "socialLinks", "mediaUrls", "avatar", "coverPhoto"]
        update = {k: v for k, v in data.items() if k in allowed_fields}

        if not update:
            return jsonify({"error": "No valid fields to update"}), 400

        mongo.db.influencers.update_one(
            {"userId": ObjectId(user_id)},
            {"$set": update}
        )
        updated = mongo.db.influencers.find_one({"userId": ObjectId(user_id)})
        return jsonify(serialize_doc(updated)), 200
    except Exception as e:
        import traceback
        print(f"Update profile error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": f"Update failed: {str(e)}"}), 500


@influencers_bp.route("/my-profile", methods=["GET"])
@jwt_required()
def my_profile():
    """Get current influencer's profile (any status)"""
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})

    if not user or user["role"] != "INFLUENCER":
        return jsonify({"error": "Only influencers can access this"}), 403

    profile = mongo.db.influencers.find_one({"userId": ObjectId(user_id)})
    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    return jsonify(serialize_doc(profile)), 200


@influencers_bp.route("/media/upload", methods=["POST"])
@jwt_required()
def upload_media():
    """Upload media file (image or video) and return URL"""
    try:
        user_id = get_jwt_identity()
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})

        if not user or user["role"] != "INFLUENCER":
            return jsonify({"error": "Only influencers can upload media"}), 403

        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        # Check file type - more robust extraction
        allowed_extensions = {"png", "jpg", "jpeg", "gif", "webp", "mp4", "webm", "mov", "avi"}
        
        # Extract file extension
        filename_lower = file.filename.lower() if file.filename else ""
        if "." not in filename_lower:
            return jsonify({"error": "File must have an extension. Allowed: gif, webp, webm, mp4, jpeg, png, avi, mov, jpg"}), 400
        
        file_ext = filename_lower.rsplit(".", 1)[1] if "." in filename_lower else ""
        
        if not file_ext or file_ext not in allowed_extensions:
            print(f"Upload validation failed - Filename: {file.filename}, Ext: {file_ext}, Allowed: {allowed_extensions}")
            return jsonify({"error": f"File type not allowed. Allowed: gif, webp, webm, mp4, jpeg, png, avi, mov, jpg"}), 400

        # MIME type mapping
        mime_types = {
            "png": "image/png",
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "gif": "image/gif",
            "webp": "image/webp",
            "mp4": "video/mp4",
            "webm": "video/webm",
            "mov": "video/quicktime",
            "avi": "video/avi",
        }

        # Convert file to base64 data URL
        file_content = file.read()
        if len(file_content) > 50 * 1024 * 1024:  # 50MB limit
            return jsonify({"error": "File size exceeds 50MB limit"}), 413

        base64_data = base64.b64encode(file_content).decode("utf-8")
        mime_type = mime_types.get(file_ext, file.content_type or "application/octet-stream")
        data_url = f"data:{mime_type};base64,{base64_data}"

        return jsonify({"mediaUrl": data_url, "url": data_url, "mimeType": mime_type}), 200

    except Exception as e:
        import traceback
        print(f"Upload error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500


@influencers_bp.route("/media/delete", methods=["POST"])
@jwt_required()
def delete_media():
    """Delete media file from profile"""
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})

    if not user or user["role"] != "INFLUENCER":
        return jsonify({"error": "Only influencers can delete media"}), 403

    data = request.get_json()
    media_url = data.get("mediaUrl")

    if not media_url:
        return jsonify({"error": "Media URL required"}), 400

    # Remove from influencer's mediaUrls
    mongo.db.influencers.update_one(
        {"userId": ObjectId(user_id)},
        {"$pull": {"mediaUrls": media_url}}
    )

    return jsonify({"success": True, "message": "Media deleted"}), 200