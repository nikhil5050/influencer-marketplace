"""
Admin Routes: /api/admin
All routes require ADMIN role JWT
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
from database import mongo
from utilsfunction.utils import serialize_doc, log_activity, require_role

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/dashboard", methods=["GET"])
@jwt_required()
@require_role("ADMIN")
def dashboard():
    """Admin overview stats"""
    total_users = mongo.db.users.count_documents({})
    total_influencers = mongo.db.influencers.count_documents({})
    pending = mongo.db.influencers.count_documents({"status": "pending"})
    approved = mongo.db.influencers.count_documents({"status": "approved"})
    rejected = mongo.db.influencers.count_documents({"status": "rejected"})
    total_brands = mongo.db.brands.count_documents({})
    total_campaigns = mongo.db.campaigns.count_documents({})

    # Recent activity
    recent_logs = list(
        mongo.db.activity_logs.find().sort("createdAt", -1).limit(10)
    )

    return jsonify({
        "stats": {
            "totalUsers": total_users,
            "totalInfluencers": total_influencers,
            "pendingInfluencers": pending,
            "approvedInfluencers": approved,
            "rejectedInfluencers": rejected,
            "totalBrands": total_brands,
            "totalCampaigns": total_campaigns,
        },
        "recentActivity": [serialize_doc(log) for log in recent_logs],
    }), 200


@admin_bp.route("/influencers/pending", methods=["GET"])
@jwt_required()
@require_role("ADMIN")
def pending_influencers():
    """List pending influencer approvals"""
    status = request.args.get("status", "pending")
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))
    skip = (page - 1) * limit

    query = {"status": status}
    influencers = list(mongo.db.influencers.find(query).sort("createdAt", -1).skip(skip).limit(limit))
    total = mongo.db.influencers.count_documents(query)

    # Enrich with user email
    result = []
    for inf in influencers:
        doc = serialize_doc(inf)
        user = mongo.db.users.find_one({"_id": inf["userId"]})
        if user:
            doc["userEmail"] = user["email"]
        result.append(doc)

    return jsonify({"influencers": result, "total": total}), 200


@admin_bp.route("/influencers/<influencer_id>/approve", methods=["POST"])
@jwt_required()
@require_role("ADMIN")
def approve_influencer(influencer_id):
    """Approve an influencer"""
    admin_id = get_jwt_identity()
    data = request.get_json() or {}

    try:
        influencer = mongo.db.influencers.find_one({"_id": ObjectId(influencer_id)})
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if not influencer:
        return jsonify({"error": "Influencer not found"}), 404

    mongo.db.influencers.update_one(
        {"_id": ObjectId(influencer_id)},
        {"$set": {
            "status": "approved",
            "adminNotes": data.get("notes", ""),
            "approvedAt": datetime.utcnow(),
            "approvedBy": ObjectId(admin_id),
        }}
    )

    log_activity(
        ObjectId(admin_id), "INFLUENCER_APPROVED",
        {"influencerId": influencer_id, "userId": str(influencer["userId"])}
    )

    return jsonify({"message": "Influencer approved successfully"}), 200


@admin_bp.route("/influencers/<influencer_id>/reject", methods=["POST"])
@jwt_required()
@require_role("ADMIN")
def reject_influencer(influencer_id):
    """Reject an influencer"""
    admin_id = get_jwt_identity()
    data = request.get_json() or {}

    try:
        influencer = mongo.db.influencers.find_one({"_id": ObjectId(influencer_id)})
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if not influencer:
        return jsonify({"error": "Influencer not found"}), 404

    mongo.db.influencers.update_one(
        {"_id": ObjectId(influencer_id)},
        {"$set": {
            "status": "rejected",
            "adminNotes": data.get("notes", "Rejected by admin"),
            "rejectedAt": datetime.utcnow(),
            "rejectedBy": ObjectId(admin_id),
        }}
    )

    log_activity(
        ObjectId(admin_id), "INFLUENCER_REJECTED",
        {"influencerId": influencer_id, "userId": str(influencer["userId"]), "reason": data.get("notes", "")}
    )

    return jsonify({"message": "Influencer rejected"}), 200


@admin_bp.route("/users", methods=["GET"])
@jwt_required()
@require_role("ADMIN")
def list_users():
    """List all users"""
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))
    skip = (page - 1) * limit

    users = list(mongo.db.users.find({}, {"password": 0}).sort("createdAt", -1).skip(skip).limit(limit))
    total = mongo.db.users.count_documents({})

    return jsonify({
        "users": [serialize_doc(u) for u in users],
        "total": total,
    }), 200


@admin_bp.route("/users/<user_id>", methods=["DELETE"])
@jwt_required()
@require_role("ADMIN")
def delete_user(user_id):
    """Delete a user and related data"""
    admin_id = get_jwt_identity()
    
    try:
        user_obj_id = ObjectId(user_id)
    except Exception:
        return jsonify({"error": "Invalid user ID"}), 400

    user = mongo.db.users.find_one({"_id": user_obj_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Prevent deleting the current admin
    if str(user_obj_id) == str(admin_id):
        return jsonify({"error": "Cannot delete your own account"}), 403

    try:
        # Delete user's related data based on role
        if user["role"] == "INFLUENCER":
            mongo.db.influencers.delete_many({"userId": user_obj_id})
            mongo.db.requests.delete_many({"influencerId": user_obj_id})
        elif user["role"] == "BRAND":
            mongo.db.brands.delete_many({"userId": user_obj_id})
            mongo.db.campaigns.delete_many({"brandId": user_obj_id})
            mongo.db.requests.delete_many({"brandId": user_obj_id})
        
        # Delete user
        mongo.db.users.delete_one({"_id": user_obj_id})

        # Log the activity
        log_activity(
            ObjectId(admin_id), "USER_DELETED",
            {"userId": user_id, "userName": user.get("name", ""), "userEmail": user.get("email", ""), "userRole": user.get("role", "")}
        )

        return jsonify({"message": f"User {user['name']} deleted successfully"}), 200

    except Exception as e:
        import traceback
        print(f"Delete user error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": f"Failed to delete user: {str(e)}"}), 500


@admin_bp.route("/activity-logs", methods=["GET"])
@jwt_required()
@require_role("ADMIN")
def activity_logs():
    """Get activity logs"""
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 30))
    skip = (page - 1) * limit

    logs = list(mongo.db.activity_logs.find().sort("createdAt", -1).skip(skip).limit(limit))
    total = mongo.db.activity_logs.count_documents({})

    return jsonify({
        "logs": [serialize_doc(log) for log in logs],
        "total": total,
    }), 200