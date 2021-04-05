/*

    ~Index canvas.js~
    ----------------------

    1. Monkey Patches
    2. Global Utility Functions
    3. Canvas Properties
    4. Init Values
    5. Game Variables
        5.1 Win Combinations
    6. Event Listeners
    7. Animation Utility
    8. X Animation Function
    9. O Animation Function
    10. Drawing
    11. Game
    12. Initialize

*/

/** TO MORE AWAKE STEVEN
 * 
 * 
 * 
 * /

/**
 * 01:40:28 10-08-19 the fadeout reset animation worked for the first time
 * (it was actually 1:39, but I didn't catch the actual seconds so I had to look again)
 * 
 * 1:21:46 the first time the winline animation worked with a computer player
 * 
 * 22:10:33 12-08-19 after alot of testing, the combination manipulation bug seems to be fixed
 * 
 * 
 * THEME : #D9695F #FFB4A8 #EFCDBF #4F9BA8 #2D3742
 */









// monkey patches
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();
window.cancelAnimationFrame = (function () {
    return window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    function (timPtr) {
        window.clearTimeout(timPtr);
    };
})();

var theme = {
    cross : {
        color : "#4F9BA8",
        cap : "round",
        thickness : 10
    },
    knot : {
        color: "#D9695F",
        cap : "round",
        thickness : 10
    },
    grid : {
        color : "#2D3742",
        thickness : 10,
        cap : "round"
    },
    winLine : {
        color : "#FFEDE0",
        thickness : 10,
        cap : "round"
    },
    background : "#EFCDBF"
};









/*#####################################################\
 *|                                                    #
 *| 3. Canvas properties                               #
 *|                                                    #
\#####################################################*/

// setting up canvas
var canvas = document.getElementById("canvas");
canvas.style.backgroundColor = theme.background;
var canvasContext = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var canvasCenterCoordinates = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

grid = {
    margin: 50,
    celPadding: 15,
    lineLength: 350.5
};
grid.lineSectionLength = grid.lineLength / 3;
grid.width = grid.lineLength + grid.margin;
grid.height = grid.width;
grid.maxWidth = 350.5 + grid.margin;
grid.minWidth = 200 + grid.margin;
grid.maxHeight = grid.maxWidth;
grid.minHeight = grid.minWidth;
grid.topLeftCoordinates= {
    x: canvasCenterCoordinates.x - grid.lineSectionLength * 1.5,
    y: canvasCenterCoordinates.y - grid.lineSectionLength * 1.5
}


gameBoard = [
    [0, 0, 0]
    [0, 0, 0]
    [0, 0, 0]
];

var computerHasMoved = false;
var playerCanClick = true;

game = {
    hasBeenWon: false,
    hasEnded: false,
    winningCombination: []
}


function drawPath(startCoordinates, endCoordinates){
    canvasContext.moveTo(startCoordinates.x, startCoordinates.y);
    canvasContext.lineTo(endCoordinates.x, endCoordinates.y);
    c.stroke();
}

function convertGameBoardCoordinatesToCanvasCoordinates(gameBoardCoordinates){
    var canvasX = gameBoardCoordinates.x * grid.lineSectionLength + grid.topLeftCoordinates.x;
    var canvasY =  gameBoardCoordinates.y * grid.lineSectionLength + grid.topLeftCoordinates.y;
    return {x: canvasX, y: canvasY};
}

/**
 * resets canvas brush to default values
 */
function resetBrush(){
    c.lineWidth = 1;
    c.strokeStyle = "black";
    c.fillStyle = "black";
    c.lineCap = "butt";

    c.globalAlpha = 1;
}

function addEvents(){
    if(isMobileDevice())
        addMobileEvents();
    else
        addDesktopEvents();
}
function isMobileDevice(){
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function addDesktopEvents(){
    document.addEventListener("click", canvasClickEvent);
    window.addEventListener("resize", windowResizeEvent );
}
function canvasClickEvent(event){
    console.log("hello world!")
}

function addMobileEvents(){
    console.log("hello world!");
}
function windowResizeEvent(){
    updateCanvasAttributes(); 

    var winHeight = window.innerHeight;
    var winWidth = window.innerWidth;

    if(winWidth > grid.maxWidth && winHeight > grid.maxHeight){
        setGridSizeToMaximum();
    }
    else if(winWidth < grid.minWidth || winHeight < grid.minHeight){
        setGridSizeToMinimum();
    }    
    else {
        scaleGridSize();
    }

    // if(innerWidth<minGridWidth+gridPadding*2 || innerHeight<minGridWidth+gridPadding*2){
    // } 
    // else if(innerWidth<maxGridWidth+gridPadding*2 && innerHeight>innerWidth){
    // }
    // else if(innerHeight<maxGridWidth+gridPadding*2 && innerWidth>innerHeight){
    // }
    // else if(innerWidth>maxGridWidth && innerHeight>maxGridWidth){


}

grid.setHeightAndWidth = function(heightWidth){
    grid.width = heightWidth;
    
    //the grid is a square, so height and width are the same
    grid.height = grid.width;
}

function setGridSizeToMinimum(){
    console.log("minimum");
    grid.setHeightAndWidth(grid.minWidth);
}

function setGridSizeToMaximum(){
    console.log("maximum");
    grid.setHeightAndWidth(grid.maxWidth);
}

function scaleGridSize(){
    console.log("scale");
    var innerHeight = window.innerHeight;
    var innerWidth = window.innerWidth;

    if(innerWidth < innerHeight)
        grid.setHeightAndWidth( innerWidth - grid.margin );
    else
        grid.setHeightAndWidth( innerHeight - grid.margin );
}

function scaleThemeThickness(scaleFactor){
    theme.grid.thickness = Math.round((0.0285*scaleFactor)*10)/10;
    theme.knot.thickness = Math.round((0.0285*scaleFactor)*10)/10;
    theme.cross.thickness = Math.round((0.0285*scaleFactor)*10)/10;
    theme.winLine.thickness = Math.round((0.0285*scaleFactor)*10)/10;
}
function updateGridAttributes(){
    sectionWidth = gridWidth / 3;
    grid.topLeftCoordinates = {
        x: center.x - sectionWidth * 1.5,
        y: center.y - sectionWidth * 1.5
    };
}
function updateCanvasAttributes(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasCenterCoordinates = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };
}








/*#####################################################\
 *|                                                    #
 *| 6. Event Listeners                                 #
 *|                                                    #
\#####################################################*/



/**
 * Event that gets executed on tap or click of canvas
 * @param {number} clientX - X-Coordinate of where user taps or clicks
 * @param {number} clientY - Y-Coordinate or where user taps or clicks
 */
function canvasEvent(clientX, clientY){
    
    for(x=0; x<3;x++){
        for(y=0;y<3;y++){
            if(
                clientX >= gridX(x) && clientX <= gridX(x) + sectionWidth &&
                clientY >= gridY(y) && clientY <= gridY(y) + sectionWidth
            ){
                playerTurn(x, y);
            }
        }
    }

};

// Checks if browser is mobile, and adds a touch instead of click event
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    document.addEventListener("touchstart",function(event){
        // var clientX = event.touches[0].clientX;
        // var clientY = event.touches[0].clientY;

        // canvasEvent(clientX, clientY);
    });
}
else{
    // document.addEventListener("click",function(event) {
        // canvasEvent(event.clientX, event.clientY);
    // })
}


// window.addEventListener("resize",function(){
//     if(innerWidth<minGridWidth+gridPadding*2 || innerHeight<minGridWidth+gridPadding*2){
//         gridWidth = minGridWidth;
//     }
//     else if(innerWidth<maxGridWidth+gridPadding*2 && innerHeight>innerWidth){
//         gridWidth = innerWidth-gridPadding*2;

//         theme.grid.thickness = Math.round((0.0285*gridWidth)*10)/10;
//         theme.knot.thickness = Math.round((0.0285*gridWidth)*10)/10;
//         theme.cross.thickness = Math.round((0.0285*gridWidth)*10)/10;
//         theme.winLine.thickness = Math.round((0.0285*gridWidth)*10)/10;

//         // adjusts padding of grid cells
//         padding = Math.round((0.0713*gridWidth)*10)/10;
//     }
//     // checks if window width is smaller than the default grid height
//     // if true: adjusts grid size to the height of the window
//     else if(innerHeight<maxGridWidth+gridPadding*2 && innerWidth>innerHeight){
        
//         gridWidth = innerHeight-gridPadding*2;

//         // adjusts stroke-width to the size of the grid
//         theme.grid.thickness = Math.round((0.0285*gridWidth)*10)/10;
//         theme.knot.thickness = Math.round((0.0285*gridWidth)*10)/10;
//         theme.cross.thickness = Math.round((0.0285*gridWidth)*10)/10;
//         theme.winLine.thickness = Math.round((0.0285*gridWidth)*10)/10;

//         padding = Math.round((0.0713*gridWidth)*10)/10;
//     }
//     else if(innerWidth>maxGridWidth && innerHeight>maxGridWidth){

//         // sets grid properties back to default values
//         gridWidth = maxGridWidth;
//         theme.grid.thickness = 10;
//         theme.knot.thickness = 10;
//         theme.cross.thickness = 10;
//         theme.winLine.thickness = 10;
//         padding = 25;
//     }

//     // updates section-width value to gridWidth
//     sectionWidth = gridWidth / 3;

//     //update canvas height and width to window height and width 
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     //update coordinates of the center of the canvas
//     center = {
//         x: canvas.width / 2,
//         y: canvas.height / 2
//     };


//     //update top-left coordinates of the grid
//     topLeft = {
//         x: center.x - sectionWidth * 1.5,
//         y: center.y - sectionWidth * 1.5
//     };

//     // drawGrid();
//     redraw(); 
// });



























/*#####################################################\
 *|                                                    #
 *| 7. Animation Utility                               #
 *|                                                    #
\#####################################################*/



// X animation function position


// O animation function position


// animate winLine function position


// fadeOutRest() animation method position



/*#####################################################\
 *|                                                    #
 *| 10. Drawing                                        #
 *|                                                    #
\#####################################################*/
/**
 * Draws game grid on canvas
 */
function drawGrid(){

    // sets stroke-style to grid-style
    c.lineCap = theme.grid.cap;
    c.strokeStyle = theme.grid.color;
    c.lineWidth = theme.grid.thickness;
    
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
    
    // resets stroke-style to default values
    resetBrush();

}

/**
 * Redraws game grid with placed pieces
 */
function redraw(){
    // clears entire canvas
    c.clearRect(0,0,innerHeight,innerWidth);
    
    drawGrid();

    // loops through every grid item
    // and draws a game piece if it's
    // placed
    grid.forEach(function(item,y){
        item.forEach(function(piece,x){
            if(piece==1){
                drawX(x,y);
            }if(piece==2){
                drawO(x,y);
            }
        });
    });
}



// drawX function position




// drawO() function position











/*#####################################################\
 *|                                                    #
 *| 11. Game                                           #
 *|                                                    #
\#####################################################*/

/**
 * Function that gets executed for the turn of player 1
 * @param {number} x X coordinate of where the player puts his piece
 * @param {number} y Y coordinate of where the player puts his piece
 */
function playerTurn(x, y){

    // checks if the player is able to click, if the game hasn't been won, or isn't ended
    if(grid[y][x] == 0 && playerClick==true & game.end == false & game.win == false){
        
        // sets game-grid value to 1 where player put piece
        grid[y][x] = 1;

        animateX(x, y);
        playerClick=false;

        // checks if player has won
        winCheck(1);
        
        // executes delays for if player has won
        if(game.end==true || game.win==true){
            gameEndDelay(1);
        }
        // if the game hasn't ended, it's the turn of the computer
        else if(game.end == false){

            // delays time of when player can click again
            setTimeout(function(){
                computer();
                playerClick=true;
            }, xDuration-350)
        }
    }
    
};

/**
 * Function that gets executed for the turn of the computer
 * @param {*} x X coordinate of where the computer puts his piece
 * @param {*} y Y coordinate of where the computer puts his piece
 */
function computerTurn(x, y){
    grid[y][x] = 2;
    animateO(x, y);
    winCheck(2);
    if(game.win==true){
        gameEndDelay(2);
    }
}

/**
 * Generates index of where the computer will place it's piece and executes
 * computerTurn method
 * ---
 * How the computer player works:
 * The computer player is hardcoded, it sees weather it is able to win
 * or if the player is able to win by looking at the state of the grid.
 * If the computer is one piece away from winning, it will place the
 * winning piece. If the player is one piece away from winning, it will
 * block the player.
 */
function computer(){
    var l = combinations.length;
    var item;
    var turnArray;
    
    function computerLoop(player){

        // loops through every win combination
        combinations.forEach(function(array,index){

            item = combinations[i];

            for(var o=0; o<3; o++){
                if(
                    // checks if 2 spaces of a win combination are taken
                    // and the last piece is still free. If it is free
                    // the computer will place a piece.
                    grid[ array[0][1] ][ array[0][0] ] == player &&
                    grid[ array[1][1] ][ array[1][0] ] == player &&
                    grid[ array[2][1] ][ array[2][0] ] == 0 &&

                    // checks if the computer already has chosen a spot
                    // to place a piece.
                    computerMoved == false
                ){
                    // stores the combination the computer can move
                    turnArray = [array[2][0] , array[2][1]];
                    // says the computer has moved
                    computerMoved = true;

                    // changes state of win combination to
                    // return to original state
                    array.unshift(array[2]);
                    array.pop();
                }
                else {
                    // if the computer hasn't found a win 
                    // combination or player isn't about to in

                    // changes state of possible win combination
                    // since there are 3 possible ways the pieces
                    // are able to be arranges before a player can win
                    array.unshift(array[2]);
                    array.pop();
                }
            };
            
        });

    }
    
    // 2 stands for the computer
    // 1 stands for the player
    // it first checks if the computer can win
    // then checks if the player is about to win
    computerLoop(2);
    computerLoop(1);


    // if the computer can't win or the player
    // can't be blocked, the computer will choose
    // a random index
    if(computerMoved == false){


        // chooses random indexes for X and Y axis
        function randomBox(){

            function randomX(){
                return Math.floor(Math.random()*3);
            }
            function randomY(){
                return Math.floor(Math.random() * 3);
            }
            
            var x = randomX();
            var y = randomY();

            // checks if chosen spaces doesn't
            // already have a piece.
            if( grid[y][x] != 0 ){
                // if true, re-run function
                randomBox();
            }
            else{
                // set indexes to turn array
                turnArray = [x , y];
            }

            return;
        }

        randomBox();

    }
    
    // place piece at turnArray coordinates
    computerTurn(turnArray[0], turnArray[1]);

    // set computerMoved to false so the
    // computer can move next turn
    computerMoved = false;

    return;
}

// drawWinLine() function position

/**
 * Checks if a player has won
 * @param {number} player code of the player (1 = player, 2 = computer)
 */
function winCheck(player){

    // win combination for which the player has won
    var winArray;

    // counts if there are 3 of the same pieces on
    // a win combination
    var counter=0;
    
    // loops through each win combination to check
    //  if the player has won
    combinations.forEach(function(combination){

        // checks if the game already has been won
        if(game.win==false){
            combination.forEach(function(array){
                if(grid[ array[1] ][ array[0] ] == player){
                    // adds to counter
                    counter++
                };
            });
        }

        // checks if a possible win combination has already
        // been made
        if(counter===3 && game.win==false){
            game.win=true;
            game.end=true;
            winArray = combination;
        }
        else{
            // resets counter
            counter=0
        };

    });

    // stores the win combination in the win array
    if(game.win==true && game.end==true){
        game.winArray = winArray;
    };

    counter=0;

    // checks if there is a tie
    // (if each square has a piece but no
    // player has won)
    grid.forEach(function(array){
        array.forEach(function(item){
            if(item!=0){
                counter++;
            };
        })
    });
    if(counter==9 && game.end==false && game.win==false){
        game.end=true;
        playerClick = false;
    };

    // counter=0;
}


/**
 * resets game variables and grid
 */
function reset(){
    game.win = false;
    game.end=false;

    grid.forEach(function(item,index){
        grid[index] = [0,0,0];
    })

    playerClick=true;

    return;
};

/**
 * Delays for if a player has won in order for animations to flow
 * after each other instead of being executed at the same time
 * @param {number} player code of the player (1 = player, 2 = computer)
 */
function gameEndDelay(player){
    if(player==1){
        setTimeout(function(){
            if(game.win==true){
                animateWinLine(game.winArray);
                setTimeout(function(){
                    // if the game has been won
                    // the player can't click anymore
                    playerClick = false;
                    fadeOutReset(true, game.winArray);
                    setTimeout(function(){
                        reset();
                    }, fadeDuration)
                }, winLineDuration)
            }
            else if(game.win==false && game.end==true){
                fadeOutReset();
                setTimeout(function(){
                    reset();
                }, fadeDuration)
            }
        }, xDuration)
    }
    else{
        playerClick = false;
        setTimeout(function(){
            animateWinLine(game.winArray);
            setTimeout(function(){
                fadeOutReset(true, game.winArray);
                setTimeout(function(){
                    reset();
                }, fadeDuration)
            }, winLineDuration+50)
        }, oDuration-200);
    }
}











/*#####################################################\
 *|                                                    #
 *| 12. Intialize                                      #
 *|                                                    #
\#####################################################*/

// Implementation
// drawGrid();
addEvents();
