
import tensorflow as tf

model = tf.keras.models.load_model('digit_model.keras')
model.summary()

import sys
import json

# Receive the array from JavaScript
data = sys.stdin.read()
array_received = json.loads(data)

# Add 1 to each element
prediction = model.predict(array_received)
print(prediction)

# Send the modified array back to JavaScript
sys.stdout.write(json.dumps(prediction))
sys.stdout.flush()



       





