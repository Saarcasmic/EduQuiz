import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
import re
import json as pyjson
from supabase import create_client, Client
from typing import Optional

# Load environment variables from .env
load_dotenv()

# Environment variables
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173"],  # React dev server
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Validate required environment variables
if not GEMINI_API_KEY:
    raise RuntimeError('GEMINI_API_KEY not set in .env')
if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError('SUPABASE_URL and/or SUPABASE_KEY not set in .env')

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('models/gemini-2.0-flash')

# Authentication routes
@app.route('/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password are required'}), 400

        email = data['email']
        password = data['password']
        
        # Optional: Add additional validation for email and password
        if not email or not password:
            return jsonify({'error': 'Email and password cannot be empty'}), 400

        # Attempt to sign up the user with Supabase
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })

        # Check if user was created successfully
        if response.user and response.user.id:
            return jsonify({
                'message': 'User registered successfully',
                'user_id': response.user.id,
                'email': response.user.email
            }), 201
        else:
            return jsonify({'error': 'Failed to create user'}), 500

    except Exception as e:
        import traceback
        print("[ERROR] /auth/signup exception:")
        traceback.print_exc()
        error_message = str(e)
        if 'User already registered' in error_message:
            return jsonify({'error': 'Email already exists'}), 400
        elif 'Password should be at least' in error_message:
            return jsonify({'error': 'Password too weak'}), 400
        else:
            return jsonify({'error': f'Registration failed: {error_message}'}), 500

@app.route('/auth/signin', methods=['POST'])
def signin():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password are required'}), 400

        email = data['email']
        password = data['password']

        # Attempt to sign in the user with Supabase
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        # Check if login was successful
        if response.session and response.user:
            return jsonify({
                'message': 'Logged in successfully',
                'access_token': response.session.access_token,
                'user': {
                    'id': response.user.id,
                    'email': response.user.email
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        import traceback
        print("[ERROR] /auth/signin exception:")
        traceback.print_exc()
        error_message = str(e)
        if 'Invalid login credentials' in error_message:
            return jsonify({'error': 'Invalid email or password'}), 401
        else:
            return jsonify({'error': f'Login failed: {error_message}'}), 500

@app.route('/auth/signout', methods=['POST'])
def signout():
    try:
        # Get the JWT token from the Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No authentication token provided'}), 401

        # Sign out the user
        supabase.auth.sign_out()
        return jsonify({'message': 'Logged out successfully'}), 200

    except Exception as e:
        return jsonify({'error': f'Logout failed: {str(e)}'}), 500

# Helper function to verify JWT token
def verify_token(token: Optional[str]) -> tuple[bool, Optional[str]]:
    if not token:
        return False, 'No token provided'
    try:
        # Verify the JWT token with Supabase
        user = supabase.auth.get_user(token)
        return True, None
    except Exception as e:
        return False, str(e)

# Example of a protected route
@app.route('/protected', methods=['GET'])
def protected_route():
    # Get the token from the Authorization header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'No authentication token provided'}), 401
    
    token = auth_header.split(' ')[1]
    is_valid, error = verify_token(token)
    
    if not is_valid:
        return jsonify({'error': f'Invalid token: {error}'}), 401
    
    return jsonify({'message': 'Access granted to protected resource'}), 200

@app.route('/generate-quiz', methods=['POST'])
def generate_quiz():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'Missing "text" field in request.'}), 400
    user_text = data['text']
    prompt = (
        "Generate 5 multiple-choice questions with 4 options each based on the following content. "
        "Return the result as a JSON array, where each item is an object with 'question' and 'options' (an array of 4 strings).\n"
        "Ensure the output is ONLY the JSON array, with no additional text or markdown formatting outside the JSON block.\n"
        "The JSON should be enclosed within ```json and ```.\n" # Added explicit instruction for markdown block
        f"{user_text}\n"
        "Example format:\n"
        "```json\n" # Added example markdown block
        "[\n"
        "  { \"question\": \"What is the capital of France?\", \"options\": [\"Berlin\", \"Madrid\", \"Paris\", \"Rome\"] },\n"
        "  { \"question\": \"Which planet is known as the Red Planet?\", \"options\": [\"Earth\", \"Mars\", \"Jupiter\", \"Venus\"] }\n"
        "]\n"
        "```" # Added example markdown block close
    )
    try:
        response = model.generate_content(prompt)
        raw_text = response.text.strip()
        
        # --- Start of improved JSON extraction ---
        json_string = ""
        
        # Try to find the JSON within a markdown block first (most common and reliable)
        match = re.search(r'```json\s*(.*?)\s*```', raw_text, re.DOTALL)
        if match:
            json_string = match.group(1).strip()
        else:
            # If no markdown block, try to find the first '[' and last ']' to extract potential JSON
            # This is a fallback and less robust, but might catch cases where markdown block is missed.
            start_idx = raw_text.find('[')
            end_idx = raw_text.rfind(']')
            if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
                json_string = raw_text[start_idx : end_idx + 1].strip()
            else:
                # As a last resort, assume the entire raw_text is intended to be JSON
                json_string = raw_text

        # Important: Remove the single quote replacement if Gemini is consistently using double quotes.
        # If Gemini sometimes uses single quotes, keep it. But your raw_response uses double quotes.
        # If you still get errors about quotes, uncomment this.
        # json_string = json_string.replace("'", '"')
        
        # --- End of improved JSON extraction ---

        if not json_string:
            return jsonify({'error': 'No JSON content found in Gemini response.', 'raw_response': raw_text}), 500

        try:
            quiz = pyjson.loads(json_string)
            
            # Validate the structure of the parsed JSON
            if not isinstance(quiz, list):
                raise ValueError("Root of the JSON is not a list.")
            
            # Check if the list is empty (can happen if the model produced an empty array)
            if not quiz:
                return jsonify({'quiz': []})

            for q in quiz:
                if not isinstance(q, dict):
                    raise ValueError("Quiz item is not an object.")
                if 'question' not in q or not isinstance(q['question'], str):
                    raise ValueError("Quiz item missing 'question' or 'question' is not a string.")
                if 'options' not in q or not isinstance(q['options'], list):
                    raise ValueError("Quiz item missing 'options' or 'options' is not a list.")
                
                # Ensure exactly 4 options and they are all strings
                if len(q['options']) != 4:
                    # Attempt to pad if less than 4 options, or truncate if more.
                    # This makes the output more consistent for the frontend.
                    q['options'] = q['options'][:4] # Take first 4 if more
                    while len(q['options']) < 4:
                        q['options'].append("") # Pad with empty strings if less

                if not all(isinstance(opt, str) for opt in q['options']):
                    # Convert non-string options to string to prevent frontend issues
                    q['options'] = [str(opt) for opt in q['options']]

            return jsonify({'quiz': quiz})
            
        except pyjson.JSONDecodeError as e:
            # Include the json_string that caused the error for debugging
            return jsonify({'error': f'Failed to decode JSON from Gemini response: {e}', 'raw_response': raw_text, 'extracted_json_string': json_string}), 500
        except ValueError as e:
            # Include the json_string that caused the error for debugging
            return jsonify({'error': f'Invalid quiz structure received from Gemini: {e}', 'raw_response': raw_text, 'extracted_json_string': json_string}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)