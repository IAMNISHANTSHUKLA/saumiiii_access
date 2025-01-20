from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Load the model and encoders
model = joblib.load('risk_model.pkl')
le_state = joblib.load('le_state.pkl')
le_crime = joblib.load('le_crime.pkl')
le_risk = joblib.load('le_risk.pkl')

# Dummy database for favorite contacts (replace with a real database in production)
favorite_contacts = {}

@app.route('/predict_risk', methods=['POST'])
def predict_risk():
    data = request.json
    state = data['state']
    crime_head = data['crime_head']
    year = int(data['year'])

    # Transform input
    state_encoded = le_state.transform([state])[0]
    crime_encoded = le_crime.transform([crime_head])[0]

    # Make prediction
    features = np.array([[state_encoded, crime_encoded, year]])
    risk_level_encoded = model.predict(features)[0]
    risk_level = le_risk.inverse_transform([risk_level_encoded])[0]

    return jsonify({'risk_level': risk_level})

@app.route('/get_states', methods=['GET'])
def get_states():
    return jsonify({'states': list(le_state.classes_)})

@app.route('/get_crime_heads', methods=['GET'])
def get_crime_heads():
    return jsonify({'crime_heads': list(le_crime.classes_)})

@app.route('/set_favorite_contacts', methods=['POST'])
def set_favorite_contacts():
    data = request.json
    user_id = data['user_id']
    contacts = data['contacts']
    favorite_contacts[user_id] = contacts
    return jsonify({'message': 'Favorite contacts updated successfully'})

@app.route('/get_favorite_contacts', methods=['GET'])
def get_favorite_contacts():
    user_id = request.args.get('user_id')
    contacts = favorite_contacts.get(user_id, [])
    return jsonify({'contacts': contacts})

@socketio.on('sos_alert')
def handle_sos_alert(data):
    user_id = data['user_id']
    user_location = data['location']
    contacts = favorite_contacts.get(user_id, [])
    
    # In a real-world scenario, you would send actual notifications to the contacts
    # For this example, we'll just emit a message back to the client
    emit('sos_sent', {
        'message': f'SOS alert sent to {len(contacts)} contacts',
        'location': user_location
    }, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)

