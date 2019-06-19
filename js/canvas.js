// import utils from './utils'

/*

    ~Index canvas.js~
    ----------------------

    1. init values
    2. init functions
    3. Utility functions
    4. draw grid function
    5. intialize

*/


/*#####################################################\
 *|                                                    #
 *| 1.init values                                      #
 *|                                                    #
 *| These values are the standart var's of canvas.js   #
 *|                                                    #
\#####################################################*/


// global variables

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// c.translate(0.5, 0.5);

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

var gridCoordinates = {};


var crossPoints={};


/*#####################################################\
 *|                                                    #
 *| 4. init classes                                    #
 *|                                                    #
\#####################################################*/



/*#####################################################\
 *|                                                    #
 *| 2.init functions                                   #
 *|                                                    #
\#####################################################*/

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

/*#######################################################\
 *|                                                      #
 *| 3.uitility functions                                 #
 *|                                                      # 
\#######################################################*/

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
    // constructor(x_tl, y_tl, x_tr, y_tr, x_bl, y_bl, x_br, y_br){
    constructor(topLeft, topRight, bottomLeft, bottomRight){



        this.topLeft = topLeft;

        this.topRight = topRight;
        
        this.bottomLeft = bottomLeft;

        this.bottomRight = bottomRight;


        // this.topLeft = {x:x_tl, y:y_tl};

        // this.topRight = {x:x_tr, y: y_tr};
        
        // this.bottomLeft = {x: x_bl, y: y_bl};

        // this.bottomRight = {x: x_br, y: y_br};

        // this.x_tl = x_tl;
        // this.y_tl = y_tl;

        // this.x_tr = x_tr;
        // this.y_tr = y_tr;

        // this.x_bl = x_bl;
        // this.y_bl = y_bl;

        // this.x_br = x_br;
        // this.y_br = y_br;

        // this.center = {
        //     x: this.bottomLeft.x + ( (this.bottomRight.x - this.bottomLeft.x) / 2),
        //     y: this.topRight.y + ( (this.bottomRight.y - this.topRight.y) / 2)
        // }

    }
    
     center(){
       return { x: this.bottomLeft.x + ( (this.bottomRight.x - this.bottomLeft.x) / 2),
            y: this.topRight.y + ( (this.bottomRight.y - this.topRight.y) / 2)};
    }
    
    

}

/*#####################################################\
 *|                                                    #
 *| 4. draw grid function                              #
 *|                                                    #
\#####################################################*/

// draws the first grid
function drawGrid(){
    


    c.lineWidth = 5;

    var gridPadding = 60;

    var x = center.x - gridPadding;

    var height = (gridPadding * 6) / 2;

    var y = center.y;

    drawPath(x, y - height,
             x, y + height);


    gridCoordinates.leftVertical = {
        description: "left vertical",
        top: {
            x: x,
            y: y - height
        },
        bottom: {
            x: x,
            y: y + height
        },
        x: x
    }

    // gridCoordinatesArray.push(leftVertical);

    var x = center.x + gridPadding;

    
    drawPath(x, y - height,
             x, y + height );

    gridCoordinates.rightVertical = {
        description: "right vertical",
        top: {
            x: x,
            y: y - height
        },
        bottom: {
            x: x,
            y: y + height
        },
        x: x
    }

    // gridCoordinatesArray.push(rightVertical);

    var x = center.x;

    var y = center.y - gridPadding;

    var width = height;

    drawPath(x - width, y,
             x + width, y);

    gridCoordinates.topHorizontal = {
        description: "top horizontal",
        left: {
            x: x - width,
            y: y
        },
        right: {
            x: x + width,
            y: y
        },
        y: y
    }

    // gridCoordinatesArray.push(topHorizontal)

    var y = center.y + gridPadding;

    drawPath(x - width, y,
             x + width, y);

    gridCoordinates.bottomHorizontal = {
        description: "bottom horizontal",
        left: {
            x: x - width,
            y: y
        },
        right: {
            x: x + width,
            y: y
        },
        y: y
    }


    crossPoints.topLeft = {x: gridCoordinates.leftVertical.x ,y: gridCoordinates.topHorizontal.y};

    crossPoints.topRight = {x: gridCoordinates.rightVertical.x, y: gridCoordinates.topHorizontal.y};

    crossPoints.bottomLeft = {x: gridCoordinates.leftVertical.x ,y: gridCoordinates.bottomHorizontal.y};

    crossPoints.bottomRight = {x: gridCoordinates.rightVertical.x, y: gridCoordinates.bottomHorizontal.y};



    // gridCoordinatesArray.push(bottomHorizontal);

    console.log(gridCoordinates);
    

   resetBrush();

   
    
}

function setBlockCoordinates(){

    console.log(gridCoordinates);
    

    gridSquareArray[0] = new gridSquare(
        {
            x: gridCoordinates.topHorizontal.left.x,
            y: gridCoordinates.leftVertical.top.y
        },
            gridCoordinates.leftVertical.top,
            gridCoordinates.topHorizontal.left,
            crossPoints.topLeft

    );

    gridSquareArray[1] = new gridSquare(

        gridCoordinates.leftVertical.top,
        gridCoordinates.rightVertical.top,
        crossPoints.topLeft,
        crossPoints.topRight

    );

    gridSquareArray[2] = new gridSquare(
        gridCoordinates.rightVertical.top,
        {
            x: gridCoordinates.rightVertical.top.x,
            y: gridCoordinates.topHorizontal.right.x
        },
        crossPoints.topRight,
        gridCoordinates.topHorizontal.right
    )


    gridSquare[3] = new gridSquare(
        
    )

    // drawPath(gridSquareArray[0].topLeft.x, gridSquareArray[0].topLeft.y,gridSquareArray[0].center().x, gridSquareArray[0].center().y);

    console.log(gridSquareArray);
    

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

/*########################################################\
 *|                                                       #
 *| 7. initialize function                                #
 *|                                                       #
\########################################################*/

// Implementation

function init() {

    c.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    setBlockCoordinates();
}

// Animation Loop
function animate() {


}

init();
