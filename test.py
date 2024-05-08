import tensorflow as tf
import numpy as np
from flask import Flask, request, jsonify

model = tf.keras.models.load_model('digit_model.keras')
model.summary()

app = Flask(__name__)

@app.route('/prediction', methods=['POST'])
def make_prediction():
    data = request.json
    array = data['array']
    
    # Convert the JavaScript array to a NumPy array
    input_array = np.array(array)
    
    # Reshape the input array if necessary (depends on the model's input shape)
    input_array = np.reshape(input_array, (-1, input_array.shape[0]))  # Adjust shape as needed
    
    # Make prediction
    prediction = model.predict(input_array)
    
    # Convert prediction to JSON-compatible format
    prediction_json = prediction.tolist()
    
    return jsonify({'prediction': prediction_json})

if __name__ == '__main__':
    app.run(debug=True)




       





