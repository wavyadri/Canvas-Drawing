const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth - 60;
canvas.height = 500;

let context = canvas.getContext("2d");
context.fillStyle = "#F7F7F2";
context.fillRect(0, 0, canvas.width, canvas.height); 

let drawColour = "#000"
let drawWidth = "2";
let isDrawing = false;

let restoreArray = [];
let index = -1; // no path yet

function changeColour(element) {
    drawColour = element.style.background;
}

// mobile + tablet
canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("touchend", stop, false); 

// desktop
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);
canvas.addEventListener("mouseup", stop, false); 
canvas.addEventListener("mouseout", stop, false); 

function start(event) {
    isDrawing = true;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    event.preventDefault();
}

function draw(event) {
    if (isDrawing) {
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        context.strokeStyle = drawColour;
        context.lineWidth = drawWidth;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
    }
    event.preventDefault();
}

function stop(event) {
    if (isDrawing) {
        context.stroke();
        context.closePath();
        isDrawing = false;
    }
    event.preventDefault();

    // once stopped, add it to the restoreArray in case needs to be called by undoLast()
    // only add for the draw event
    if (event.type != "mouseout"){
        restoreArray.push(context.getImageData(0,0,canvas.width,canvas.height));
        index++;
    } 
}

function clearCanvas() {
    context.fillStyle = "#F7F7F2";
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillRect(0,0,canvas.width,canvas.height);

    // reset cached restoreArray
    restoreArray = [];
    index = -1;
}

function undoLast() {
    if (index <= 0) {
        clearCanvas();
    } else {
        index--;
        restoreArray.pop();
        context.putImageData(restoreArray[index], 0, 0);
    }
}