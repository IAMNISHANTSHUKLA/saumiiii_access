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

