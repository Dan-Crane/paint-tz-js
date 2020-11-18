let canvas = document.querySelector('.canvas')
let ctx = canvas.getContext('2d');
let radioBtn = document.querySelectorAll('.form-check-input')
let width = document.querySelector('.wrap-canvas').offsetWidth
let colorInput = document.querySelector('.pencil-mode__color')
let color = colorInput.value
let dragging = false
let dragStartLocation
let snapshot

let x 
let y 

canvas.width = width
canvas.height = 500

document.addEventListener('DOMContentLoaded', _=> {
  swithMode()
  init()
})

// set color
function setColor(e) {
  color = e.target.value
}

// create swithMode
function swithMode () {
  radioBtn.forEach(i => {
    i.addEventListener('click', ()=> {
      setMode(i.value)
    })
  })
}

// set mode
function setMode (mode) {
  switch (mode) {
    case 'pencil':
      return pencilMode()
    case 'line':
      return lineMode()
    case 'eraset':
      return erasetMode()
  }
}

function init() {
  colorInput.addEventListener('change', setColor)
  canvas.addEventListener('mousedown', pencilStart)
  canvas.addEventListener('mouseup', pencilStop)
}

// pencil
function pencilMode (){
  removeListeners()
  canvas.addEventListener('mousedown', pencilStart)
  canvas.addEventListener('mouseup', pencilStop)
}

function pencilStart (event) {
  let x = event.offsetX;
  let y = event.offsetY;
  ctx.strokeStyle = color
  ctx.lineJoin = 'round'
  ctx.lineCap = "round"
  ctx.moveTo (x,y);
  console.log(ctx.moveTo (x,y))

  canvas.addEventListener('mousemove', pencilDraw)
}

function pencilDraw (e) {
  let x = e.offsetX;
  let y = e.offsetY;
  console.log(x, y)
  ctx.lineTo (x,y)
  ctx.lineWidth = 4;
  ctx.stroke()
}

function pencilStop(e) {
  canvas.removeEventListener('mousemove', pencilDraw)
}


// line
function lineMode () {
  removeListeners()
  canvas.addEventListener('mousemove', drag)
  canvas.addEventListener('mousedown', lineStart)
  canvas.addEventListener('mouseup', lineStop)
}

function drag(e){
  let position
  if (dragging === true) { 
    restoreSnapshot()
    position = getCoordinates(e)
    drawLine(position)
  }
}

function lineStart(e){
  dragging = true,
  dragStartLocation = getCoordinates(e)
  takeSnapshot()
}

function lineStop(e){
  dragging = false
  restoreSnapshot()
  let position = getCoordinates(e)
  drawLine(position)
}

function getCoordinates(event) {
  let x = event.offsetX
  let y = event.offsetY
  return {x, y}
}

function drawLine(position){
  ctx.beginPath()
  ctx.moveTo(dragStartLocation.x, dragStartLocation.y)
  ctx.lineTo(position.x, position.y)
  ctx.lineWidth = 4;
  ctx.strokeStyle = color
  ctx.stroke()
}

function takeSnapshot() {
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}
function restoreSnapshot() {
  ctx.putImageData(snapshot, 0, 0)
}

// eraset
function erasetMode (){
  removeListeners()
  canvas.addEventListener('mousedown', erasetStart)
  canvas.addEventListener('mouseup', erasetStop)
}

function erasetStart (event) {
  canvas.addEventListener('mousemove', erasetDraw)
}

function erasetDraw (e) {
  let x = e.offsetX
  let y = e.offsetY
  ctx.clearRect(x, y, 6, 6)
}

function erasetStop(e) {
  canvas.removeEventListener('mousemove', erasetDraw)
}

// remove listeners
function removeListeners() {
  canvas.removeEventListener('mousedown', pencilStart)
  canvas.removeEventListener('mouseup', pencilStop)
  canvas.removeEventListener('mousedown', erasetStart)
  canvas.removeEventListener('mouseup', erasetStop)
  canvas.removeEventListener('mousemove', drag)
  canvas.removeEventListener('mousedown', lineStart)
  canvas.removeEventListener('mouseup', lineStop)
  
}