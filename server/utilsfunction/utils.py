"""
Utility functions for InfluenceHub backend
"""
from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from bson import ObjectId
from datetime import datetime
from database import mongo
import cloudinary
import cloudinary.uploader
from config import Config

# Configure Cloudinary
cloudinary.config(
    cloud_name=Config.CLOUDINARY_CLOUD_NAME,
    api_key=Config.CLOUDINARY_API_KEY,
    api_secret=Config.CLOUDINARY_API_SECRET
)


def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable dict"""
    if doc is None:
        return None
    result = {}
    for key, value in doc.items():
        if key == "_id":
            result["id"] = str(value)
        elif isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        elif isinstance(value, list):
            result[key] = [
                serialize_doc(item) if isinstance(item, dict) else
                str(item) if isinstance(item, ObjectId) else
                item.isoformat() if isinstance(item, datetime) else item
                for item in value
            ]
        elif isinstance(value, dict):
            result[key] = serialize_doc(value)
        else:
            result[key] = value
    return result


def log_activity(user_id, action, details=None):
    """Log user activity to activity_logs collection"""
    try:
        mongo.db.activity_logs.insert_one({
            "userId": user_id,
            "action": action,
            "details": details or {},
            "createdAt": datetime.utcnow(),
        })
    except Exception as e:
        print(f"Failed to log activity: {e}")


def require_role(*roles):
    """Decorator to require specific roles for a route"""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
            if not user:
                return jsonify({"error": "User not found"}), 404
            if user["role"] not in roles:
                return jsonify({"error": f"Access denied. Required role: {', '.join(roles)}"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def upload_to_cloudinary(file_obj, folder="influencehub"):
    """
    Upload file to Cloudinary
    Args:
        file_obj: File object from request
        folder: Cloudinary folder name
    Returns:
        dict with public_id, url, and secure_url or error message
    """
    try:
        result = cloudinary.uploader.upload(
            file_obj,
            folder=folder,
            resource_type="auto"
        )
        return {
            "success": True,
            "public_id": result.get("public_id"),
            "url": result.get("url"),
            "secure_url": result.get("secure_url")
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def delete_from_cloudinary(public_id):
    """
    Delete file from Cloudinary
    Args:
        public_id: Cloudinary public_id of the file
    Returns:
        dict with success status
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        return {
            "success": True,
            "result": result
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }