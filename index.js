const SIZE = 256, sampleNum = 5;
let inputCanvas, outputContainer, statusMsg, transferBtn, sampleIndex = 0, modelReady = false, isTransfering = false;
const inputImgs = [], outputImgs = [];

const edges2pikachu = pix2pix('./models/vangoghportrait_BtoA.pict', modelLoaded);

function setup() {
  // Create canvas
  inputCanvas = createCanvas(SIZE, SIZE);
  inputCanvas.class('border-box pencil').parent('canvasContainer');

  // Selcect output div container
  outputContainer = select('#output');
  statusMsg = select('#status');
  transferBtn = select('#transferBtn').hide();

  // Display initial input image
  loadImage('./images/input.png', inputImg => image(inputImg, 0, 0));

  // Display initial output image
  let out = createImg('./images/output.png');
  outputContainer.html('');
  out.class('border-box').parent('output');

  // Load other sample input/output images
  for (let i = 1; i <= sampleNum; i += 1) {
    loadImage(`./images/input${i}.png`, inImg => {
      inputImgs.push(inImg);
      let outImg = createImg(`./images/output${i}.png`);
      outImg.hide().class('border-box');
      outputImgs.push(outImg);
    });
  }

  // Set stroke to black
  stroke(0);
  pixelDensity(1);
}

// Draw on the canvas when mouse is pressed
function draw() {
  if (mouseIsPressed) {
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function mouseReleased() {
  if (modelReady && !isTransfering) {
    transfer()
  }
}

function transfer() {
  isTransfering = true;
  // Update status message
  statusMsg.html('Applying Style Transfer...!');

  // Select canvas DOM element
  let canvasElement = document.getElementById('defaultCanvas0');
  // Apply pix2pix transformation
  edges2pikachu.transfer(canvasElement, result => {
    // Clear output container
    outputContainer.html('');
    // Create an image based result
    createImg(result.src).class('border-box').parent('output');
    statusMsg.html('Done!');
    isTransfering = false;
  });
}

function transferimage(image) {
  isTransfering = true;
  // Update status message
  statusMsg.html('Applying Style Transfer...!');

  // Select canvas DOM element
  let canvasElement = image;
  // Apply pix2pix transformation
  edges2pikachu.transfer(canvasElement, result => {
    // Clear output container
    outputContainer.html('');
    // Create an image based result
    createImg(result.src).class('border-box').parent('output');
    statusMsg.html('Done!');
    isTransfering = false;
  });
}

// A function to be called when the models have loaded
function modelLoaded() {
  if (!statusMsg) statusMsg = select('#status');
  statusMsg.html('Model Loaded!');
  transferBtn.show();
  modelReady = true;
}

// Clear the canvas
function clearCanvas() {
  background(255);
}

function getRandomOutput() {
  image(inputImgs[sampleIndex], 0, 0);
  outputContainer.html('');
  outputImgs[sampleIndex].show().parent('output');
  sampleIndex += 1;
  if (sampleIndex > 4) sampleIndex = 0;
}

function usePencil() {
  stroke(0);
  strokeWeight(1);
  inputCanvas.removeClass('eraser');
  inputCanvas.addClass('pencil');
}

function useEraser() {
  stroke(255);
  strokeWeight(15);
  inputCanvas.removeClass('pencil');
  inputCanvas.addClass('eraser');
}

let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");

camera_button.addEventListener('click', async function() {
   	let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
	video.srcObject = stream;
});

click_button.addEventListener('click', function() {
   	canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
   	let image_data_url = canvas.toDataURL('image/jpeg');

   	// data url of the image
   	console.log(image_data_url);
	transferimage(canvas);
});