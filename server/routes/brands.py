"""
Brand Routes: /api/brands
- GET /campaigns         -> List brand's campaigns
- POST /campaigns        -> Create campaign
- GET /campaigns/:id     -> Get campaign detail
- PUT /campaigns/:id     -> Update campaign
- POST /campaigns/:id/connect -> Connect influencer to campaign
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
from database import mongo
from utilsfunction.utils import serialize_doc, require_role, log_activity

brands_bp = Blueprint("brands", __name__)


@brands_bp.route("/campaigns", methods=["GET"])
@jwt_required()
@require_role("BRAND")
def list_campaigns():
    user_id = get_jwt_identity()
    brand = mongo.db.brands.find_one({"userId": ObjectId(user_id)})
    if not brand:
        return jsonify({"error": "Brand profile not found"}), 404

    campaigns = list(mongo.db.campaigns.find({"brandId": brand["_id"]}).sort("createdAt", -1))
    result = []
    for c in campaigns:
        doc = serialize_doc(c)
        if c.get("influencerId"):
            inf = mongo.db.influencers.find_one({"_id": c["influencerId"]})
            if inf:
                doc["influencer"] = {"id": str(inf["_id"]), "name": inf.get("name", "")}
        result.append(doc)

    return jsonify({"campaigns": result}), 200


@brands_bp.route("/campaigns", methods=["POST"])
@jwt_required()
@require_role("BRAND")
def create_campaign():
    user_id = get_jwt_identity()
    brand = mongo.db.brands.find_one({"userId": ObjectId(user_id)})
    if not brand:
        return jsonify({"error": "Brand profile not found"}), 404

    data = request.get_json()
    if not data.get("title"):
        return jsonify({"error": "Campaign title is required"}), 400

    campaign = {
        "brandId": brand["_id"],
        "influencerId": ObjectId(data["influencerId"]) if data.get("influencerId") else None,
        "title": data["title"],
        "brief": data.get("brief", ""),
        "budget": data.get("budget", 0),
        "status": "draft",
        "niches": data.get("niches", []),
        "deliverables": data.get("deliverables", []),
        "createdAt": datetime.utcnow(),
    }
    result = mongo.db.campaigns.insert_one(campaign)
    log_activity(ObjectId(user_id), "CAMPAIGN_CREATED", {"campaignId": str(result.inserted_id), "title": data["title"]})

    return jsonify({"message": "Campaign created", "id": str(result.inserted_id)}), 201


@brands_bp.route("/campaigns/<campaign_id>", methods=["GET"])
@jwt_required()
@require_role("BRAND")
def get_campaign(campaign_id):
    user_id = get_jwt_identity()
    brand = mongo.db.brands.find_one({"userId": ObjectId(user_id)})

    try:
        campaign = mongo.db.campaigns.find_one({
            "_id": ObjectId(campaign_id),
            "brandId": brand["_id"]
        })
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if not campaign:
        return jsonify({"error": "Campaign not found"}), 404

    doc = serialize_doc(campaign)
    if campaign.get("influencerId"):
        inf = mongo.db.influencers.find_one({"_id": campaign["influencerId"]})
        if inf:
            doc["influencer"] = serialize_doc(inf)

    return jsonify(doc), 200


@brands_bp.route("/campaigns/<campaign_id>", methods=["PUT"])
@jwt_required()
@require_role("BRAND")
def update_campaign(campaign_id):
    user_id = get_jwt_identity()
    brand = mongo.db.brands.find_one({"userId": ObjectId(user_id)})

    data = request.get_json()
    allowed = ["title", "brief", "budget", "status", "niches", "deliverables", "influencerId"]
    update = {k: v for k, v in data.items() if k in allowed}

    if "influencerId" in update and update["influencerId"]:
        update["influencerId"] = ObjectId(update["influencerId"])

    mongo.db.campaigns.update_one(
        {"_id": ObjectId(campaign_id), "brandId": brand["_id"]},
        {"$set": update}
    )
    return jsonify({"message": "Campaign updated"}), 200


@brands_bp.route("/profile", methods=["GET"])
@jwt_required()
@require_role("BRAND")
def brand_profile():
    user_id = get_jwt_identity()
    brand = mongo.db.brands.find_one({"userId": ObjectId(user_id)})
    if not brand:
        return jsonify({"error": "Brand profile not found"}), 404
    return jsonify(serialize_doc(brand)), 200


@brands_bp.route("/profile", methods=["PUT"])
@jwt_required()
@require_role("BRAND")
def update_brand_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    allowed = ["companyName", "industry", "website", "description", "logo"]
    update = {k: v for k, v in data.items() if k in allowed}

    mongo.db.brands.update_one(
        {"userId": ObjectId(user_id)},
        {"$set": update}
    )
    updated = mongo.db.brands.find_one({"userId": ObjectId(user_id)})
    return jsonify(serialize_doc(updated)), 200