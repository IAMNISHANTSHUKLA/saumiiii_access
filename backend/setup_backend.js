const { execSync } = require('child_process');
const fs = require('fs');

// Create a virtual environment
console.log('Creating virtual environment...');
execSync('python -m venv venv');

// Activate the virtual environment and install dependencies
console.log('Installing dependencies...');
if (process.platform === 'win32') {
  execSync('venv\\Scripts\\activate && pip install flask scikit-learn pandas numpy joblib');
} else {
  execSync('source venv/bin/activate && pip install flask scikit-learn pandas numpy joblib');
}

// Create train_model.py
console.log('Creating train_model.py...');
fs.writeFileSync('train_model.py', `
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Load dataset
data = pd.read_csv('caw1.csv')

# Data Cleaning & Feature Engineering
data = data.dropna()  # Drop missing values
data = data.melt(id_vars=["STATE/UT", "CRIME HEAD"], 
                 var_name="YEAR", value_name="CRIME_COUNT")
data['YEAR'] = data['YEAR'].astype(int)

# Create a risk label based on crime count
bins = [0, 500, 1500, np.inf]
labels = ['low', 'medium', 'high']
data['RISK_LEVEL'] = pd.cut(data['CRIME_COUNT'], bins=bins, labels=labels)

# Encode categorical features
le_state = LabelEncoder()
data['STATE/UT_ENCODED'] = le_state.fit_transform(data['STATE/UT'])
le_crime = LabelEncoder()
data['CRIME_HEAD_ENCODED'] = le_crime.fit_transform(data['CRIME HEAD'])

# Feature selection
X = data[['STATE/UT_ENCODED', 'CRIME_HEAD_ENCODED', 'YEAR']]
y = data['RISK_LEVEL']

# Encode target labels
le_risk = LabelEncoder()
y_encoded = le_risk.fit_transform(y)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model and encoders
joblib.dump(model, 'risk_model.pkl')
joblib.dump(le_state, 'le_state.pkl')
joblib.dump(le_crime, 'le_crime.pkl')
joblib.dump(le_risk, 'le_risk.pkl')

print("Model and encoders saved successfully!")
`);

// Create app.py
console.log('Creating app.py...');
fs.writeFileSync('app.py', `
from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the model and encoders
model = joblib.load('risk_model.pkl')
le_state = joblib.load('le_state.pkl')
le_crime = joblib.load('le_crime.pkl')
le_risk = joblib.load('le_risk.pkl')

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

if __name__ == '__main__':
    app.run(debug=True)
`);

console.log('Backend setup complete!');