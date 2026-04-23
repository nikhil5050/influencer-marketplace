from flask import Blueprint, request, jsonify
from datetime import datetime
from functools import wraps
from config import db
from bson.objectid import ObjectId
import jwt

messages_bp = Blueprint('messages', __name__, url_prefix='/api/messages')

# Middleware to check authentication
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            data = jwt.decode(token, 'your-secret-key', algorithms=['HS256'])
            request.user_id = data['id']
            request.user_email = data['email']
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(*args, **kwargs)
    return decorated

# Get all chats for current user
@messages_bp.route('/chats', methods=['GET'])
@token_required
def get_chats():
    try:
        user_id = ObjectId(request.user_id)
        chats = list(db.chats.find({
            'participants': user_id
        }).sort('lastMessageTime', -1))
        
        result = []
        for chat in chats:
            # Get the other participant
            participant_id = [p for p in chat['participants'] if p != user_id][0]
            participant = db.users.find_one({'_id': participant_id})
            
            result.append({
                'id': str(chat['_id']),
                'participantId': str(participant_id),
                'participantName': participant['name'],
                'participantRole': participant['role'],
                'lastMessage': chat.get('lastMessage', ''),
                'unreadCount': len([m for m in chat.get('messages', []) 
                                   if m['senderId'] != user_id and not m.get('read', False)]),
                'timestamp': chat['lastMessageTime']
            })
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Get messages for a specific chat
@messages_bp.route('/chats/<chat_id>', methods=['GET'])
@token_required
def get_messages(chat_id):
    try:
        user_id = ObjectId(request.user_id)
        chat = db.chats.find_one({
            '_id': ObjectId(chat_id),
            'participants': user_id
        })
        
        if not chat:
            return jsonify({'message': 'Chat not found'}), 404
        
        messages = []
        for msg in chat.get('messages', []):
            sender = db.users.find_one({'_id': ObjectId(msg['senderId'])})
            messages.append({
                'id': str(msg['_id']),
                'senderId': str(msg['senderId']),
                'senderName': sender['name'],
                'content': msg['content'],
                'timestamp': msg['timestamp'],
                'fileUrl': msg.get('fileUrl'),
                'fileName': msg.get('fileName')
            })
        
        return jsonify(messages), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Mark chat as read
@messages_bp.route('/chats/<chat_id>/read', methods=['POST'])
@token_required
def mark_as_read(chat_id):
    try:
        user_id = ObjectId(request.user_id)
        db.chats.update_one(
            {
                '_id': ObjectId(chat_id),
                'participants': user_id,
                'messages.read': False
            },
            {
                '$set': {
                    'messages.$[elem].read': True
                }
            },
            array_filters=[{'elem.senderId': {'$ne': request.user_id}}]
        )
        
        return jsonify({'message': 'Chat marked as read'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Send a message
@messages_bp.route('/send', methods=['POST'])
@token_required
def send_message():
    try:
        chat_id = request.form.get('chatId')
        content = request.form.get('content', '')
        file = request.files.get('file')
        
        user_id = ObjectId(request.user_id)
        chat = db.chats.find_one({
            '_id': ObjectId(chat_id),
            'participants': user_id
        })
        
        if not chat:
            return jsonify({'message': 'Chat not found'}), 404
        
        # Handle file upload
        file_url = None
        file_name = None
        if file:
            import base64
            file_data = file.read()
            file_url = f"data:{file.content_type};base64,{base64.b64encode(file_data).decode()}"
            file_name = file.filename
        
        message = {
            '_id': ObjectId(),
            'senderId': request.user_id,
            'content': content,
            'timestamp': datetime.utcnow().isoformat(),
            'read': False,
            'fileUrl': file_url,
            'fileName': file_name
        }
        
        db.chats.update_one(
            {'_id': ObjectId(chat_id)},
            {
                '$push': {'messages': message},
                '$set': {
                    'lastMessage': content[:50],
                    'lastMessageTime': datetime.utcnow().isoformat()
                }
            }
        )
        
        return jsonify({'message': 'Message sent', 'messageId': str(message['_id'])}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Start a new chat
@messages_bp.route('/start', methods=['POST'])
@token_required
def start_chat():
    try:
        data = request.json
        recipient_id = data.get('recipientId')
        
        user_id = ObjectId(request.user_id)
        recipient_obj_id = ObjectId(recipient_id)
        
        # Check if chat already exists
        existing_chat = db.chats.find_one({
            'participants': {'$all': [user_id, recipient_obj_id]}
        })
        
        if existing_chat:
            return jsonify({'chatId': str(existing_chat['_id'])}), 200
        
        # Create new chat
        chat = {
            'participants': [user_id, recipient_obj_id],
            'messages': [],
            'lastMessage': '',
            'lastMessageTime': datetime.utcnow().isoformat(),
            'createdAt': datetime.utcnow().isoformat()
        }
        
        result = db.chats.insert_one(chat)
        
        return jsonify({'chatId': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500
