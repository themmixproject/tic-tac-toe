/*

    ~Index new_canvas.js~
    ----------------------

    1. Canvas Properties
    2. init values
    3. object prototype functions
    4. Event Listeners
    5. Utility Functions
    6. Functions
    7. Game Functions
    8. intialize

*/

/*#####################################################\
 *|                                                    #
 *| 1. Canvas properties                               #
 *|                                                    #
\#####################################################*/

var gridWidth = 350;
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
 *| 1. Game Variables                                  #
 *|                                                    #
\#####################################################*/

var grid = [];

for(var i=0;i<3;i++){
    grid.push([0,0,0]);
}


var combinations=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [6,4,2],
    [0,4,8]
];

var computerMoved = false;

var game = {
    end: false,
    win: false
}

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

            // var gridX = x * sectionWidth + topLeft.x;
            // var gridY = y * sectionWidth + topLeft.y;

            if(
                mouse.x >= gridX(x) && mouse.x <= gridX(x) + sectionWidth &&
                mouse.y >= gridY(y) && mouse.y <= gridY(y) + sectionWidth
            ){

                // index = x + (y * 3);

                playerTurn(x, y);

                // console.log(x + " " + y);

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

function gridX(x){
    return x * sectionWidth + topLeft.x;
}

function gridY(y){
    return y * sectionWidth + topLeft.y;
}

/*#####################################################\
 *|                                                    #
 *| 6. Functions                                       #
 *|                                                    #
\#####################################################*/

function drawGrid(){

    // horizontal lines
    for(var y = 1, o = 1; y <= 2; y++, o=-1){
        drawPath(
            center.x - (sectionWidth * 1.5), center.y + (sectionWidth * -0.5) * o,
            center.x + (sectionWidth * 1.5), center.y + (sectionWidth * -0.5) * o
        );

    }

    // vertical lines
    for(var x = 1, o = 1; x <= 2; x++, o=-1){

    drawPath(
        center.x + (sectionWidth * -0.5) * o, center.y - (sectionWidth * 1.5),
        center.x + (sectionWidth * -0.5) * o, center.y + (sectionWidth * 1.5)
    );

    }
    
}

function drawX(x, y, index){



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
 *| 7. Game Functions                                  #
 *|                                                    #
\#####################################################*/

function playerTurn(x, y, index){
    console.log(x + " " + y);
    if(game.end==true){game.end=false};

    if(grid[y][x] == 0){
        drawX(gridX(x), gridY(y));

        grid[y][x] = 1;

        console.log(grid);

        // checkWin(1);

        // if(game.end == false){computer();}
    }
    
    

};

function computerTurn(index){

    console.log(index);

    grid[index] = 2;

    var x = index % 3;
    var y = Math.floor( index / 3 );
    

    console.log(x+ " " + y);

    var gridX = x * sectionWidth + topLeft.x;
    var gridY = y * sectionWidth + topLeft.y;

    drawO(gridX, gridY);

    checkWin(2);

}

function computer(){
    
    function computerLoop(player){
        combinations.forEach(function(arr,index){
            for(var i=0; i<3; i++){
                if(
                    grid[arr[0]]==player &&
                    grid[arr[1]]==player &&
                    grid[arr[2]]==0 &&
                    


                    computerMoved == false
                ){  
                    computerTurn(arr[2]);
                    computerMoved = true;
                }
                else {
                    arr.unshift(arr[2]);
                    arr.pop();
                }
            }
            
        });
    }
    
    computerLoop(2);
    computerLoop(1);



    if(computerMoved ==false){

        function randomIndex(){
            function ranNum(){
                return Math.floor(Math.random()*8);
            }

            var ran=ranNum();
            if(grid[ran]!=0){randomIndex();}
            else{computerTurn(ran);}

            return;
        }

        randomIndex();
    }

    checkWin(2);

    computerMoved = false;

}

function checkWin(p){
    var counter=0;
    
        combinations.forEach(function(item,index){
            if(game.win==false){
                item.forEach(function(item,index){
                    if(grid[item]===p){counter++};
                });
            }
            if(counter===3 && game.win==false){
                game.win=true;
                game.end=true;
                console.log("win");
            }
            else{counter=0};
        });
    if(game.win==true && game.end==true){reset();
    };
    counter=0;
    grid.forEach(function(item){
        if(item!=0){counter++};
    });
       
    if(counter==9 && game.end==false){
        game.end=true;

        reset();
    };
    
    // counter=0;
}

function reset(){

    game.win = false;

    grid = [0,0,0,0,0,0,0,0,0];

    for(var x=0; x<3; x++){
        for(var y=0; y<3; y++){

            var gridX = x * sectionWidth + topLeft.x + (padding  / 2);
            var gridY = y * sectionWidth + topLeft.y + (padding / 2);

            c.clearRect(
                gridX,
                gridY, 
                sectionWidth - padding,
                sectionWidth - padding

            )
            
            // c.fillRect(
            //     gridX,
            //     gridY, 
            //     sectionWidth - padding,
            //     sectionWidth - padding

            // )
        }
    }

    

};

/*#####################################################\
 *|                                                    #
 *| 8. initialize                                      #
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
// animate()