// import utils from './utils'

// global variables

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

var gridSquareArray = [];

var gridCoordinatesArray = [];

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

function resetBrush() {

    c.lineWidth = 1;

}

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
// function Ball(x, y, dx, dy, radius, color) {
//     this.x = x;
//     this.y = y;

//     this.dy = dy;
//     this.dx = dx;

//     this.radius = radius;
//     this.color = color;
// }

class gridSquare{
    constructor(x_tl, y_tl, x_tr, y_tr, x_bl, y_bl, x_br, y_br){

        this.topLeft = {x:x_tl, y:y_tl};

        this.topRight - {x:x_tr, y: Y_tr};
        
        this.bottomLeft = {x: x_bl, y: y_bl};

        this.bottomRight = {x: x_br, y: y_br};

        // this.x_tl = x_tl;
        // this.y_tl = y_tl;

        // this.x_tr = x_tr;
        // this.y_tr = y_tr;

        // this.x_bl = x_bl;
        // this.y_bl = y_bl;

        // this.x_br = x_br;
        // this.y_br = y_br;

    }
}



// draws the first grid
function drawGrid(){
    
    gridCoordinatesArray = [];

    c.lineWidth = 5;

    var gridPadding = 60;

    var x = center.x - gridPadding;

    var height = (gridPadding * 6) / 2;

    var y = center.y;

    drawPath(x, y + height,
             x, y - height);


    var leftVertical = {
        description: "left vertical",
        top: {
            x: x,
            y: y + height
        },
        bottom: {
            x: x,
            y: y - height
        }
    }

    gridCoordinatesArray.push(leftVertical);

    var x = center.x + gridPadding;

    
    drawPath(x, y + height,
             x, y - height );

    var rightVertical = {
        description: "right vertical",
        top: {
            x: x,
            y: y + height
        },
        bottom: {
            x: x,
            y: y - height
        }
    }

    gridCoordinatesArray.push(rightVertical);

    var x = center.x;

    var y = center.y - gridPadding;

    var width = height;

    drawPath(x + width, y,
             x - width, y);

    var topHorizontal = {
        description: "top horizontal",
        top: {
            x: x + width,
            y: y
        },
        bottom: {
            x: x - width,
            y: y
        }
    }

    gridCoordinatesArray.push(topHorizontal)

    var y = center.y + gridPadding;

    drawPath(x + width, y,
             x - width, y);

    var bottomHorizontal = {
        description: "bottom horizontal",
        top: {
            x: x + width,
            y: y
        },
        bottom: {
            x: x - width,
            y: y
        }
    }

    gridCoordinatesArray.push(bottomHorizontal)

    console.log(gridCoordinatesArray);
    

   resetBrush();
    
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

var gridSquareArray = [];

function init() {

    c.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();

}

// Animation Loop
function animate() {


}

init();
