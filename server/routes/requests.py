"""
Campaign Requests Routes: /api/requests
Handles collaboration requests from brands to influencers
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
from database import mongo
from utilsfunction.utils import serialize_doc, log_activity, require_role

requests_bp = Blueprint("requests", __name__)


@requests_bp.route("/", methods=["POST"])
@jwt_required()
@require_role("BRAND")
def create_request():
    """Brand sends a collaboration request to an influencer"""
    user_id = get_jwt_identity()
    data = request.get_json()

    required = ["influencerId", "campaignTitle", "businessName", "businessType",
                "location", "phoneNumber", "deliverables", "budget", "startDate", "endDate", "message"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    # Validate influencer exists and is approved
    try:
        influencer = mongo.db.influencers.find_one({
            "_id": ObjectId(data["influencerId"]),
            "status": "approved"
        })
    except Exception:
        return jsonify({"error": "Invalid influencer ID"}), 400

    if not influencer:
        return jsonify({"error": "Influencer not found or not approved"}), 404

    # Get brand info
    brand = mongo.db.brands.find_one({"userId": ObjectId(user_id)})
    brand_user = mongo.db.users.find_one({"_id": ObjectId(user_id)})

    # Check for date conflict: influencer already booked for overlapping dates
    start = datetime.fromisoformat(data["startDate"])
    end = datetime.fromisoformat(data["endDate"])

    conflict = mongo.db.campaign_requests.find_one({
        "influencerId": influencer["_id"],
        "status": {"$in": ["pending", "accepted"]},
        "$or": [
            {"startDate": {"$lte": end, "$gte": start}},
            {"endDate": {"$lte": end, "$gte": start}},
            {"startDate": {"$lte": start}, "endDate": {"$gte": end}},
        ]
    })
    if conflict:
        return jsonify({
            "error": "Influencer already has a confirmed booking for overlapping dates",
            "conflict": True
        }), 409

    # Create request document
    req = {
        "influencerId": influencer["_id"],
        "influencerName": influencer.get("name", ""),
        "brandId": brand["_id"] if brand else None,
        "brandUserId": ObjectId(user_id),
        "brandName": brand_user.get("name", "") if brand_user else "",
        "brandEmail": brand_user.get("email", "") if brand_user else "",
        "campaignTitle": data["campaignTitle"],
        "businessName": data["businessName"],
        "businessType": data["businessType"],
        "location": data["location"],
        "phoneNumber": data["phoneNumber"],
        "website": data.get("website", ""),
        "deliverables": data["deliverables"],     # list of strings
        "postTypes": data.get("postTypes", []),   # ['post', 'story', 'reel']
        "budget": float(data["budget"]),
        "startDate": start,
        "endDate": end,
        "message": data["message"],
        "status": "pending",   # pending | accepted | rejected | completed
        "influencerNote": "",
        "adminViewed": False,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    }
    result = mongo.db.campaign_requests.insert_one(req)

    # Create notification for influencer
    mongo.db.notifications.insert_one({
        "userId": influencer["userId"],
        "type": "NEW_CAMPAIGN_REQUEST",
        "title": "New Collaboration Request",
        "message": f"{data['businessName']} wants to collaborate on '{data['campaignTitle']}'",
        "requestId": result.inserted_id,
        "read": False,
        "createdAt": datetime.utcnow(),
    })

    # Create notification for brand (confirmation)
    mongo.db.notifications.insert_one({
        "userId": ObjectId(user_id),
        "type": "REQUEST_SENT",
        "title": "Collaboration Request Sent",
        "message": f"Your request to {influencer.get('name')} has been sent. They'll respond within 48 hours.",
        "requestId": result.inserted_id,
        "read": False,
        "createdAt": datetime.utcnow(),
    })

    log_activity(ObjectId(user_id), "CAMPAIGN_REQUEST_SENT", {
        "requestId": str(result.inserted_id),
        "influencerId": data["influencerId"],
        "campaignTitle": data["campaignTitle"],
    })

    return jsonify({
        "message": "Collaboration request sent successfully!",
        "requestId": str(result.inserted_id),
    }), 201


@requests_bp.route("/brand", methods=["GET"])
@jwt_required()
@require_role("BRAND")
def brand_requests():
    """Get all requests made by this brand"""
    user_id = get_jwt_identity()
    reqs = list(mongo.db.campaign_requests.find(
        {"brandUserId": ObjectId(user_id)}
    ).sort("createdAt", -1))
    return jsonify({"requests": [serialize_doc(r) for r in reqs]}), 200


@requests_bp.route("/influencer", methods=["GET"])
@jwt_required()
@require_role("INFLUENCER")
def influencer_requests():
    """Get all requests received by this influencer"""
    user_id = get_jwt_identity()
    influencer = mongo.db.influencers.find_one({"userId": ObjectId(user_id)})
    if not influencer:
        return jsonify({"requests": []}), 200

    reqs = list(mongo.db.campaign_requests.find(
        {"influencerId": influencer["_id"]}
    ).sort("createdAt", -1))
    return jsonify({"requests": [serialize_doc(r) for r in reqs]}), 200


@requests_bp.route("/<req_id>/respond", methods=["POST"])
@jwt_required()
@require_role("INFLUENCER")
def respond_request(req_id):
    """Influencer accepts or rejects a collaboration request"""
    user_id = get_jwt_identity()
    data = request.get_json()
    action = data.get("action")  # "accept" or "reject"
    note = data.get("note", "")

    if action not in ["accept", "reject"]:
        return jsonify({"error": "action must be 'accept' or 'reject'"}), 400

    try:
        req = mongo.db.campaign_requests.find_one({"_id": ObjectId(req_id)})
    except Exception:
        return jsonify({"error": "Invalid request ID"}), 400

    if not req:
        return jsonify({"error": "Request not found"}), 404

    # Verify this influencer owns the request
    influencer = mongo.db.influencers.find_one({"userId": ObjectId(user_id)})
    if not influencer or str(req["influencerId"]) != str(influencer["_id"]):
        return jsonify({"error": "Not authorized"}), 403

    new_status = "accepted" if action == "accept" else "rejected"

    mongo.db.campaign_requests.update_one(
        {"_id": ObjectId(req_id)},
        {"$set": {
            "status": new_status,
            "influencerNote": note,
            "updatedAt": datetime.utcnow(),
            "respondedAt": datetime.utcnow(),
        }}
    )

    # Notify brand
    notif_msg = (
        f"{influencer.get('name', 'The influencer')} accepted your campaign '{req['campaignTitle']}'! ðŸŽ‰"
        if action == "accept"
        else f"{influencer.get('name', 'The influencer')} declined your campaign '{req['campaignTitle']}'."
    )
    mongo.db.notifications.insert_one({
        "userId": req["brandUserId"],
        "type": "REQUEST_ACCEPTED" if action == "accept" else "REQUEST_REJECTED",
        "title": "Campaign Update",
        "message": notif_msg,
        "requestId": req["_id"],
        "read": False,
        "createdAt": datetime.utcnow(),
    })

    log_activity(ObjectId(user_id), f"REQUEST_{new_status.upper()}", {
        "requestId": req_id,
        "campaignTitle": req["campaignTitle"],
    })

    return jsonify({"message": f"Request {new_status}"}), 200


@requests_bp.route("/notifications", methods=["GET"])
@jwt_required()
def get_notifications():
    """Get notifications for current user"""
    user_id = get_jwt_identity()
    notifs = list(mongo.db.notifications.find(
        {"userId": ObjectId(user_id)}
    ).sort("createdAt", -1).limit(20))
    unread = mongo.db.notifications.count_documents({"userId": ObjectId(user_id), "read": False})
    return jsonify({
        "notifications": [serialize_doc(n) for n in notifs],
        "unread": unread,
    }), 200


@requests_bp.route("/notifications/read-all", methods=["POST"])
@jwt_required()
def mark_all_read():
    user_id = get_jwt_identity()
    mongo.db.notifications.update_many(
        {"userId": ObjectId(user_id), "read": False},
        {"$set": {"read": True}}
    )
    return jsonify({"message": "All marked read"}), 200


# â”€â”€ ADMIN endpoints â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

@requests_bp.route("/admin/all", methods=["GET"])
@jwt_required()
@require_role("ADMIN")
def admin_all_requests():
    """Admin: see all campaign requests with booking calendar info"""
    status = request.args.get("status", "")
    query = {}
    if status:
        query["status"] = status

    reqs = list(mongo.db.campaign_requests.find(query).sort("createdAt", -1))
    return jsonify({"requests": [serialize_doc(r) for r in reqs]}), 200


@requests_bp.route("/admin/bookings", methods=["GET"])
@jwt_required()
@require_role("ADMIN")
def admin_bookings():
    """Admin: accepted bookings for calendar view"""
    bookings = list(mongo.db.campaign_requests.find(
        {"status": "accepted"}
    ).sort("startDate", 1))
    result = []
    for b in bookings:
        doc = serialize_doc(b)
        result.append(doc)
    return jsonify({"bookings": result}), 200
