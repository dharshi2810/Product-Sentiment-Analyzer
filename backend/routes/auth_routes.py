from flask import Blueprint, request, jsonify
import bcrypt
import jwt
from datetime import datetime, timedelta
import os
from database import db
from config import Config
from middleware.auth_middleware import token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'message': 'Missing required fields'}), 400
        
    if db.db is None:
        return jsonify({'message': 'Database not connected'}), 500
        
    # Check if user exists
    if db.users.find_one({'email': data['email']}):
        return jsonify({'message': 'User already exists'}), 400
        
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    user_id = db.users.insert_one({
        'name': data['name'],
        'email': data['email'],
        'password': hashed_password.decode('utf-8'),
        'created_at': datetime.utcnow()
    }).inserted_id
    
    return jsonify({'message': 'User created successfully', 'user_id': str(user_id)}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
        
    if db.db is None:
        return jsonify({'message': 'Database not connected'}), 500
        
    user = db.users.find_one({'email': data['email']})
    
    if not user:
        return jsonify({'message': 'Invalid credentials'}), 401
        
    if bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.utcnow() + timedelta(days=1) # 24 hour expiry
        }, Config.SECRET_KEY, algorithm="HS256")
        
        return jsonify({
            'token': token,
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email']
            }
        }), 200
        
    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user_id):
    from bson import ObjectId
    user = db.users.find_one({'_id': ObjectId(current_user_id)}, {'password': 0})
    if user:
        user['_id'] = str(user['_id'])
        return jsonify(user), 200
    return jsonify({'message': 'User not found'}), 404
