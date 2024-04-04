
import tensorflow as tf
from flask import Flask, request, jsonify


model = tf.keras.models.load_model('digit_model.keras')
model.summary()

app = Flask(__name__)

@app.route('/prediction', methods=['POST'])
def calculate_sum():
    data = request.json
    array = data['array']
    pred = model.predict(array)
    return jsonify({pred})

if __name__ == '__main__':
    app.run(debug=True)



       





