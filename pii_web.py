import hashlib
from flask import Flask, request, jsonify
import io
import base64
from pii_list import PIIDetector
from flask_cors import CORS
import os
from PIL import Image
import numpy as np
import sys
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import requests

app = Flask(__name__)
CORS(app)
detector = PIIDetector()
limiter = Limiter(app=app, key_func=get_remote_address)

pii_type_not_to_blur = sys.argv[1:] if len(sys.argv) > 1 else []

@app.route('/')
def index():
    return "Error 403"

@app.route('/blur', methods=['POST'])
@limiter.limit("10 per minute")
def blur_options():
    try:
        data = request.json

        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400

        image_data = data['image']
        MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB limit
        if len(image_data) > MAX_IMAGE_SIZE:
            return jsonify({'error': 'Image size exceeds the limit'}), 400

        try:
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            app.logger.error(f"Error processing image: {e}")
            return jsonify({'error': 'Invalid image data'}), 400

        image_np = np.array(image)

        dont_blur_options = {pii_type: [True] for pii_type in pii_type_not_to_blur}
        pii_positions, detected_pii = detector.calculate_pii_positions(image_np, dont_blur_options)
        
        if detected_pii and "error" in detected_pii:
            return jsonify({'error': detected_pii["error"]}), 400
        
        blurred_image = detector.blur_pii(image, pii_positions)

        buffered = io.BytesIO()
        blurred_image.save(buffered, format="PNG")
        blurred_image_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
        if detected_pii:
            pii_types = ', '.join(detected_pii.keys()) 
            image_hash = hashlib.sha256(image_bytes).hexdigest() 

            try:
                blockchain_response = requests.post(
                    'http://localhost:8082/log-pii',
                    json={
                        'sender': 'flask-backend',
                        'piiTypes': pii_types,
                        'imageHash': image_hash
                    }
                )

                if blockchain_response.status_code != 200:
                    app.logger.error(f"Failed to log PII detection on blockchain: {blockchain_response.text}")
            except Exception as e:
                app.logger.error(f"Error communicating with blockchain middleware: {e}")

        return jsonify({
            'status': 'success',
            'blurredImage': blurred_image_base64,
            'detectedPii': detected_pii
        })
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({'error': 'An error occurred while processing blur options. Please try again.'}), 500

if __name__ == '__main__':
    app.run(port=8081, debug=True)