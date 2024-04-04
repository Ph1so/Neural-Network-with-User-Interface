/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./script.js":
/*!*******************!*\
  !*** ./script.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const canvas = document.getElementById(\"canvas\");\nconst context = canvas.getContext(\"2d\");\nconst headingText = document.getElementById(\"heading\");\n\nlet isDrawing = false;\nlet lastX = 0;\nlet lastY = 0;\n\ncanvas.addEventListener(\"mousedown\", startDrawing);\ncanvas.addEventListener(\"mousemove\", draw);\ncanvas.addEventListener(\"mouseup\", stopDrawing);\ncanvas.addEventListener(\"mouseout\", stopDrawing);\n\nfunction deleteHead() {\n  headingText.style.display = \"none\";\n}\n\nfunction startDrawing(e) {\n  isDrawing = true;\n  const rect = canvas.getBoundingClientRect();\n  [lastX, lastY] = [\n    (e.clientX - rect.left) * (canvas.width / rect.width),\n    (e.clientY - rect.top) * (canvas.height / rect.height),\n  ];\n  deleteHead();\n}\n\nfunction draw(e) {\n  if (!isDrawing) return;\n  const rect = canvas.getBoundingClientRect();\n  const currentX = (e.clientX - rect.left) * (canvas.width / rect.width);\n  const currentY = (e.clientY - rect.top) * (canvas.height / rect.height);\n  context.beginPath();\n  context.moveTo(lastX, lastY);\n  context.lineTo(currentX, currentY);\n  context.strokeStyle = \"#000\";\n  context.lineWidth = 35;\n  context.lineCap = \"round\";\n  context.lineJoin = \"round\";\n  context.stroke();\n  [lastX, lastY] = [currentX, currentY];\n}\n\nfunction stopDrawing() {\n  isDrawing = false;\n}\n\nfunction processDrawing() {\n  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);\n\n  // Accessing the pixel data array\n  const pixelData = imageData.data;\n\n  // Define a function to determine if a pixel is closer to white or black\n  function isBlack(alpha) {\n    // Return 1 for black, 0 for white\n    return alpha > 1 ? 1 : 0;\n  }\n\n  // Create a 280 by 280 array to store the modified pixel data\n  const modifiedPixels = [];\n\n  // Initialize the 280 by 280 array\n  for (let i = 0; i < 280; i++) {\n    modifiedPixels[i] = [];\n    for (let j = 0; j < 280; j++) {\n      modifiedPixels[i][j] = 0; // Initialize to 0\n    }\n  }\n\n  let row = 0;\n  let column = 0;\n\n  // Iterate over pixel data array\n  for (let i = 0; i < pixelData.length; i += 4) {\n    const a = pixelData[i + 3];\n    // Check if pixel is closer to black or white\n    const pixelValue = isBlack(a);\n    // Add pixel value to modified array\n    modifiedPixels[row][column] = pixelValue;\n\n    row++;\n    if (row == 280) {\n      row = 0;\n      column++;\n      if (column == 280) {\n        break; // Break loop if the 280x280 array is fully populated\n      }\n    }\n  }\n  const resizedData = resizeImageData(modifiedPixels);\n\n  return resizedData;\n}\n\nfunction resizeImageData(pix) {\n  const newPixel = [];\n  let a_count = 0;\n  let n_index = 0;\n  let m_index = 0;\n\n  for (let i = 0; i < 28; i++) {\n    newPixel[i] = [];\n    for (let j = 0; j < 28; j++) {\n      newPixel[i][j] = 0; // Initialize to 0\n    }\n  }\n\n  for (let i = 0; i < 28; i++) {\n    for (let j = 0; j < 28; j++) {\n      for (let n = 0; n < 10; n++) {\n        for (let m = 0; m < 10; m++) {\n          if (pix[n + n_index][m + m_index] == 1) a_count++;\n        }\n      }\n      if (a_count > 45) newPixel[i][j] = 1;\n      else newPixel[i][j] = 0;\n\n      n_index += 10;\n      a_count = 0;\n    }\n    m_index += 10;\n    n_index = 0;\n  }\n  // const ret = [];\n  // for (let i = 0; i < 28; i++) {\n  //   for (let j = 0; j < 28; j++) {\n  //     ret.push(newPixel[i][j]);\n  //   }\n  // }\n  // console.log(ret.length);\n  return newPixel;\n}\n\nfunction predict() {\n  const im = processDrawing();\n  let count = 0;\n  for (let i = 0; i < im.length; i++) {\n    for (let j = 0; j < im[0].length; j++) {\n      if (im[i][j] == 1) count++;\n    }\n  }\n  console.log(\"array: \" + im);\n  console.log(\"num black: \" + count);\n  console.log(\"array length: \" + im.length * im[0].length);\n\n  const { spawn } = __webpack_require__(Object(function webpackMissingModule() { var e = new Error(\"Cannot find module 'child_process'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));\n\n  // Define your 2D array\n  const arrayToSend = im;\n\n  // Spawn a child process for Python\n  const pythonProcess = spawn(\"python\", [\"test.py\"]);\n\n  // Send the array to the Python script\n  pythonProcess.stdin.write(JSON.stringify(arrayToSend));\n  pythonProcess.stdin.end();\n\n  // Receive the result from the Python script\n  pythonProcess.stdout.on(\"data\", (data) => {\n    const modifiedArray = JSON.parse(data.toString());\n    console.log(\"Prediction:\", modifiedArray);\n  });\n\n  // Handle errors\n  pythonProcess.stderr.on(\"data\", (data) => {\n    console.error(`Error from Python script: ${data}`);\n  });\n}\n\nfunction clearCanvas() {\n  context.clearRect(0, 0, canvas.width, canvas.height);\n}\n\nsubmit.addEventListener(\"click\", predict);\nclear.addEventListener(\"click\", clearCanvas);\n\n\n//# sourceURL=webpack:///./script.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./script.js");
/******/ 	
/******/ })()
;