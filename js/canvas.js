/*

    ~Index new_canvas.js~
    ----------------------

    1. Canvas Properties
    2. init values
    3. object prototype functions
    4. Event Listeners
    5. Utility Functions
    6. Functions
    7. intialize

*/

/*#####################################################\
 *|                                                    #
 *| 1. Canvas properties                               #
 *|                                                    #
\#####################################################*/

var gridWidth = 250;
var sectionWidth = gridWidth / 3;

var padding = 10;

/*#####################################################\
 *|                                                    #
 *| 2.init values                                      #
 *|                                                    #
 *| These values are the standard var's of canvas.js   #
 *|                                                    #
\#####################################################*/

// setting up canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
c.translate(0.5,0.5);

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

var topLeft = {
    x: center.x - sectionWidth * 1.5,
    y: center.y - sectionWidth * 1.5
}

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

/*#####################################################\
 *|                                                    #
 *| 3. object prototype functions                      #
 *|                                                    #
\#####################################################*/

// Objects
Object.prototype.draw = function() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
}

Object.prototype.update = function() {
    this.draw()
}

/*#####################################################\
 *|                                                    #
 *| 4. Event Listeners                                 #
 *|                                                    #
\#####################################################*/

addEventListener('click', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY

    for(x=0; x<3;x++){
        for(y=0;y<3;y++){

            var gridX = x * sectionWidth + topLeft.x;
            var gridY = y * sectionWidth + topLeft.y;

            if(
                mouse.x >= gridX && mouse.x <= gridX + sectionWidth &&
                mouse.y >= gridY && mouse.y <= gridY + sectionWidth
            ){

                index = x + (y * 3);

                console.log(index);
                
                drawO(gridX,gridY, index);

            }
        }
    }
})

// addEventListener('mousemove',function(){

// });

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    center = {
        x: canvas.width / 2,
        y: canvas.height / 2
    }

    topLeft = {
        x: center.x - sectionWidth * 1.5,
        y: center.y - sectionWidth * 1.5
    }

    init()
})

/*#####################################################\
 *|                                                    #
 *| 5. utility functions                               #
 *|                                                    # 
\#####################################################*/

function drawPath(x, y, x1, y1){
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x1, y1);
    c.stroke();
}

/*#####################################################\
 *|                                                    #
 *| 6. Functions                                       #
 *|                                                    # 
\#####################################################*/

function drawGrid(){
    var lineStart = 4;
    var lineLength = gridWidth - 5;

    for(var y = 1, o = 1; y <= 2; y++, o=-1){
        drawPath(
            center.x - (sectionWidth * 1.5), center.y + (sectionWidth * -0.5) * o,
            center.x + (sectionWidth * 1.5), center.y + (sectionWidth * -0.5) * o
        );

    }

    for(var x = 1, o = 1; x <= 2; x++, o=-1){

    drawPath(
        center.x + (sectionWidth * -0.5) * o, center.y - (sectionWidth * 1.5),
        center.x + (sectionWidth * -0.5) * o, center.y + (sectionWidth * 1.5)
    );

    }
    
}

function drawX(x, y, index){
    console.log(x + " " + y);

    drawPath(x + padding, y + padding,
        x+ sectionWidth - padding,
        y + sectionWidth - padding

    )

    drawPath(
        x + sectionWidth - padding,
        y + padding,
        x + padding,
        y + sectionWidth - padding
    )

}

function drawO(x, y, index){
    c.beginPath();
    c.arc(
        x + sectionWidth / 2,
        y + sectionWidth / 2,
        sectionWidth / 2 - padding,
        0,
        Math.PI*2,
        false
    )
    c.stroke();
}

/*#####################################################\
 *|                                                    #
 *| 7. initialize                                      #
 *|                                                    # 
\#####################################################*/

// Implementation
function init() {
    drawGrid();
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

}

init();

drawO(topLeft.x + (sectionWidth * 2), topLeft.y + (sectionWidth * 2), 3);
drawX(topLeft.x + (sectionWidth * 2), topLeft.y + (sectionWidth * 2), 3);
// animate()