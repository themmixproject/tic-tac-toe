// import utils from './utils'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

var center = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

var gravity = 0.5;
// var friction = 0.99;
var friction = 0.99;


var defaultStroke = 1;

console.log(c.lineWidth);



// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
})

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    center = {
        x: canvas.width / 2,
        y: canvas.height / 2
    }

    init();

})

addEventListener("click", function(){
    init();
});

// Utility Functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
}

function drawPath(x, y, x1, y1){
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x1, y1);
    c.stroke();
}

// Objects
function Ball(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;

    this.dy = dy;
    this.dx = dx;

    this.radius = radius;
    this.color = color;
}


// draws the first grid
function drawGrid(){
    
    c.lineWidth = 5;

    var gridPadding = 60;

    var x = center.x - gridPadding;

    var height = gridPadding * 6;

    var y = center.y;

    drawPath(x, y + ( height / 2 ),
             x, y - ( height / 2 ));

    var x = center.x + gridPadding;

    drawPath(x, y + ( height / 2),
             x, y - (height / 2) );

    var x = center.x;

    var y = center.y - gridPadding;

    var width = gridPadding * 6

    drawPath(x + width / 2, y,
             x - width / 2, y);

    var y = center.y + gridPadding;

    drawPath(x + width / 2, y,
             x - width / 2, y);

}

Object.prototype.draw = function() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color

    c.fill()

    // c.stroke();

    c.closePath()
}

Object.prototype.update = function() {
   
}

// Implementation

function init() {

    c.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();

}

// Animation Loop
function animate() {


}

init()
