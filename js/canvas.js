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

/** TO MORE AWAKE STEVEN, RESTRUCTURE THE "setCoordinates()" FUNCTION
 * BASICALLY, PUT IT IN A DIFFERENT PLACE, OR JUST CREATE A SEPERATE CHAPTER FOR IT
 * 
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




// for(var y = 0; y < 3; y++){
//     var array = [];
//     for(var x = 0; x < 3; x++){
//         array.push([x,y])
//     }
//     combinations.push(array);
// }

// for(var y = 0; y < 3; y++){
//     var array = [];
//     for(var x = 0; x < 3; x++){
//         array.push([y,x]);
//     }
//     combinations.push(array);
// }
// // for(o=0;o<1;o++){
// //     var array = [];
// //     for(i=0;i<3;i++){
        
// //         array.push([i,i]); 
// //     }
// //     combinations.push(array);
// // }

// for(i=0;i<1;i++){
//     var array = [];
//     var array1 = [];
//         for(var x=2, y=0; x >= 0; x--, y++){

//             array1.push([x,x]); 

//             array.push([x, y]);

//         }
    
//     combinations.push(array1,array);
// }


var combinations=[];



function setCombinations(){
    

    for(var y = 0; y < 3; y++){
        var array = [];
        for(var x = 0; x < 3; x++){
            array.push([x,y])
        }
        combinations.push(array);
    }
    
    for(var y = 0; y < 3; y++){
        var array = [];
        for(var x = 0; x < 3; x++){
            array.push([y,x]);
        }
        combinations.push(array);
    }

    for(i=0;i<1;i++){
        var array = [];
        var array1 = [];
            for(var x=2, y=0; x >= 0; x--, y++){
    
                array1.push([x,x]); 
    
                array.push([x, y]);
    
            }
        
        combinations.push(array1,array);
    }

    // [6,4,2],
    // [0,4,8]
    // [
    //     [0,0],
    //     [1,1],
    //     [2,2]
    // ],
    // [
    //     [2,0],
    //     [1,1],
    //     [0,2]
    // ]

}


var computerMoved = false;

var game = {
    end: false,
    win: false
}

// 


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

    );

    drawPath(
        x + sectionWidth - padding,
        y + padding,
        x + padding,
        y + sectionWidth - padding
    );

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

        checkWin(1);

        if(game.end == false){computer();
        }
    }
    
    

};

function computerTurn(x, y){

    grid[y][x] = 2;

    drawO( gridX(x) , gridY(y) );

    checkWin(2);

}

function computer(){
    
    function computerLoop(player){
        combinations.forEach(function(array,index){
            for(var i=0; i<3; i++){
                if(
                    grid[ array[0][1] ][ array[0][0] ] == player &&
                    grid[ array[1][1] ][ array[1][0] ] == player &&
                    grid[ array[2][1] ][ array[2][0] ] == 0 &&
                    computerMoved == false
                ){
                    computerTurn( array[2][0] , array[2][1] );
                    computerMoved = true;
                }
                else {
                    array.unshift(array[2]);
                    array.pop();
                }
            }
        });
    }
    
    computerLoop(1);
    computerLoop(2);

    if(computerMoved == false){

        function randomBox(){
            function randomX(){
                return Math.floor(Math.random()*3);
            }
            function randomY(){
                return Math.floor(Math.random() * 3);
            }
            var x = randomX();
            var y = randomY();
            if( grid[y][x] != 0 ){
                randomBox();
            }
            else{
                computerTurn( x, y);
            }
            return;
        }
        randomBox();
    }
    computerMoved = false;
    return;
}

function checkWin(player){
    var counter=0;
    
        combinations.forEach(function(combination,index){
            if(game.win==false){
                combination.forEach(function(array,index){
                    if(
                        grid[ array[1] ][ array[0] ] == player
                    ){
                        counter++
                    };
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

    grid.forEach(function(array){

        array.forEach(function(item){
            if(item!=0){
                counter++;
            };
        })
        

        
    });

    console.log(counter);
       
    if(counter==9 && game.end==false){
        game.end=true;
        console.log("tie");
        reset();
    };
    
    counter=0;
}

function reset(){

    game.win = false;

    // grid = [0,0,0,0,0,0,0,0,0];

    grid.forEach(function(item,index){
        grid[index] = [0,0,0];
    })

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

    setCombinations();

    console.log(combinations);
    console.log(grid);

    drawGrid();

}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

}

init();
// animate()