npx create-react-app womens-safety-platform --template typescript
cd womens-safety-platform


npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install axios socket.io-client
npm install --save typescript @types/react @types/react-dom
npm start



backend: pip install fastapi uvicorn socketio python-socketio flask-socketio requests

Run the setup script: `node setup_backend.js`
Create a `caw1.csv` file with your crime data in the same directory.
Activate the virtual environment:

- On Windows: `venv\Scripts\activate`
- On macOS/Linux: `source venv/bin/activate`



Train the model: `python train_model.py`
Start the Flask server: `python app.py`


To integrate everything:

1. Start your Flask backend by following the steps above.
2. In your React project directory, run `npm install` to install the new dependencies.
3. Start your React development server with `npm start`.
