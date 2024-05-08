const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const headingText = document.getElementById("heading");

let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

function deleteHead() {
  headingText.style.display = "none";
}

function startDrawing(e) {
  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  [lastX, lastY] = [
    (e.clientX - rect.left) * (canvas.width / rect.width),
    (e.clientY - rect.top) * (canvas.height / rect.height),
  ];
  deleteHead();
}

function draw(e) {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const currentX = (e.clientX - rect.left) * (canvas.width / rect.width);
  const currentY = (e.clientY - rect.top) * (canvas.height / rect.height);
  context.beginPath();
  context.moveTo(lastX, lastY);
  context.lineTo(currentX, currentY);
  context.strokeStyle = "#000";
  context.lineWidth = 35;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.stroke();
  [lastX, lastY] = [currentX, currentY];
}

function stopDrawing() {
  isDrawing = false;
}

function processDrawing() {
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  // Accessing the pixel data array
  const pixelData = imageData.data;

  // Define a function to determine if a pixel is closer to white or black
  function isBlack(alpha) {
    // Return 1 for black, 0 for white
    return alpha > 1 ? 1 : 0;
  }

  // Create a 280 by 280 array to store the modified pixel data
  const modifiedPixels = [];

  // Initialize the 280 by 280 array
  for (let i = 0; i < 280; i++) {
    modifiedPixels[i] = [];
    for (let j = 0; j < 280; j++) {
      modifiedPixels[i][j] = 0; // Initialize to 0
    }
  }

  let row = 0;
  let column = 0;

  // Iterate over pixel data array
  for (let i = 0; i < pixelData.length; i += 4) {
    const a = pixelData[i + 3];
    // Check if pixel is closer to black or white
    const pixelValue = isBlack(a);
    // Add pixel value to modified array
    modifiedPixels[row][column] = pixelValue;

    row++;
    if (row == 280) {
      row = 0;
      column++;
      if (column == 280) {
        break; // Break loop if the 280x280 array is fully populated
      }
    }
  }
  const resizedData = resizeImageData(modifiedPixels);

  return resizedData;
}

function resizeImageData(pix) {
  const newPixel = [];
  let a_count = 0;
  let n_index = 0;
  let m_index = 0;

  for (let i = 0; i < 28; i++) {
    newPixel[i] = [];
    for (let j = 0; j < 28; j++) {
      newPixel[i][j] = 0; // Initialize to 0
    }
  }

  for (let i = 0; i < 28; i++) {
    for (let j = 0; j < 28; j++) {
      for (let n = 0; n < 10; n++) {
        for (let m = 0; m < 10; m++) {
          if (pix[n + n_index][m + m_index] == 1) a_count++;
        }
      }
      if (a_count > 45) newPixel[i][j] = 1;
      else newPixel[i][j] = 0;

      n_index += 10;
      a_count = 0;
    }
    m_index += 10;
    n_index = 0;
  }
  // const ret = [];
  // for (let i = 0; i < 28; i++) {
  //   for (let j = 0; j < 28; j++) {
  //     ret.push(newPixel[i][j]);
  //   }
  // }
  // console.log(ret.length);
  return newPixel;
}

function predict() {
  const im = processDrawing();
  let count = 0;
  for (let i = 0; i < im.length; i++) {
    for (let j = 0; j < im[0].length; j++) {
      if (im[i][j] == 1) count++;
    }
  }
  console.log("array: " + im);
  console.log("num black: " + count);
  console.log("array length: " + im.length * im[0].length);

  //sending and receiving data and prediction
  $.ajax({
    type: "POST",
    url: "/prediction",
    contentType: "application/json",
    data: JSON.stringify({ array: im }),
    success: function (response) {
      console.log("Prediction received from Python:", response);
    },
  });
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

submit.addEventListener("click", predict);
clear.addEventListener("click", clearCanvas);
