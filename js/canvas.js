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
    gamePiece : {
        crossColor: "#4F9BA8",
        knotColor: "#D9695F",

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

var canvasCenter = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

grid = {
    margin: 50,
    celPadding: 15,
    lineLength: 350.5
};
grid.sectionLength = grid.lineLength / 3;
grid.width = grid.lineLength + grid.margin;
grid.height = grid.width;
grid.maxHeightWidth = 350.5;
grid.minHeighWidth = 200;
grid.maxWidth = 350.5;
grid.minWidth = 200;
grid.maxHeight = grid.maxWidth;
grid.minHeight = grid.minWidth;
grid.topLeftCoordinates= {
    x: canvasCenter.x - grid.sectionLength * 1.5,
    y: canvasCenter.y - grid.sectionLength * 1.5
}
grid.setHeightAndWidth = function(heightWidth){
    grid.width = heightWidth;
    
    //the grid is a square, so height and width are the same
    grid.height = grid.width;
}

var gameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

var computerHasMoved = false;
var playerCanClick = true;

game = {
    hasBeenWon: false,
    hasEnded: false,
    winningCombination: []
}

var winCombinations = [
    // horizontal
    [ [0, 0], [0, 1], [0, 2] ],
    [ [1, 0], [1, 1], [1, 2] ],
    [ [2, 0], [2, 1], [2, 2] ],
    
    // vertical
    [ [0, 0], [1, 0], [2, 0] ],
    [ [0, 1], [1, 1], [2, 1] ],
    [ [0, 2], [1, 2], [2, 2] ],

    // diagonal
    [ [0, 0], [1, 1], [2, 2] ],
    [ [0, 2], [1, 1], [2, 0] ]
]


var currentPlayer;



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

function logGameBoard(){
    var logString = "";

    var rotatedBoard = rotateBoard();

    rotatedBoard.forEach(function(row){
        row.forEach(function(item, index){
            var itemString = item;
            
            if(item === ""){
                itemString = "-";
            }
            if(index > 0){
                itemString = " " + itemString;
            }

            logString += itemString
        })
        
        logString+="\n";
    })
    console.log(logString);
}

function rotateBoard(){
    rotatedRows = [[], [], []];
    gameBoard.forEach(function(row){
        row.forEach(function(item, index){
            rotatedRows[index].push(row[index]);
        })
    });
    return rotatedRows;
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
    canvas.addEventListener("click", canvasClickEvent);
    window.addEventListener("resize", windowResizeEvent );
}

function canvasClickEvent(event){
    var clientXY = {
        x: event.clientX,
        y: event.clientY
    }

    canvasInteraction(clientXY);
}

var players = {
    humanPlayer: {
        piece: "X",
        canInteract: true
    },
    computerPlayer: {
        piece: "O"
    }
}

var computerPlayer = {
    placedPieces: [],
    isFirstTurn: true,
    takeTurn: function(){
        currentPlayer = players.computerPlayer;

        var turnCoordinates = computerPlayer.getTurnCoordinates();

        computerPlayer.placedPieces.push( turnCoordinates );

        // // update game state
        gameBoard[ turnCoordinates[0] ][ turnCoordinates[1] ] = "O";

        logGameBoard();
        checkGameEndConditions(currentPlayer);

        drawCircleOnCanvas(turnCoordinates[1], turnCoordinates[0]);

        if(computerPlayer.isFirstTurn)
            computerPlayer.isFirstTurn = false;
    },
    getTurnCoordinates: function(){
        if(computerPlayer.isFirstTurn){
            return computerPlayer.takeFirsTurn();
        }
        else{
            move = computerPlayer.calculateBoardSpace();
            return move;
        }
            
    },
    takeFirsTurn: function(){
        var turnCoordinates = computerPlayer.generateRandomBoardSpace();
        var turnIndex = convertToSingularIndex(turnCoordinates[0], turnCoordinates[1]);
        
        computerPlayer.baseIndex = turnIndex;

        computerPlayer.progressRow.push(turnIndex);

        return turnCoordinates;
    },
    generateRandomBoardSpace: function(){
        var randomX = Math.floor( Math.random() * 3 );
        var randomY = Math.floor( Math.random() * 3 );

        var isEmpty = gameBoard[ randomX ][ randomY ] === "";
        if(!isEmpty)
            computerPlayer.generateRandomBoardSpace();
        else
            return [randomX, randomY];
    },

    baseIndex: null,
    progressRow: [],
    calculateBoardSpace: function(){
        if(computerPlayer.progressRow.length == 1){
            var potentialMoves = moveTree[computerPlayer.progressRow.length][computerPlayer.baseIndex];
            var selectedMove = computerPlayer.selectMove(potentialMoves);

            computerPlayer.progressRow.push(convertToSingularIndex(selectedMove[0], selectedMove[1]));

            return selectedMove;
        }
        else{
            var LastMoveIndex  = moveTree[computerPlayer.progressRow.length][computerPlayer.baseIndex][computerPlayer.progressRow[1]];

            console.log(LastMoveIndex)

            var lastMoveCoordinates = convertIndexToBoardCoordinate(LastMoveIndex);

            computerPlayer.progressRow.push(LastMoveIndex);

            return lastMoveCoordinates;
        }
    },
    selectMove: function(potentialMoves){
        var possibleMoves = [];
        
        potentialMoves.forEach(function(item, index){
            var gameBoardCoordinates = convertIndexToBoardCoordinate(item);
            
            var gridSpaceIsEmpty = gameBoard[ gameBoardCoordinates[0] ] [gameBoardCoordinates[1] ] === "";

            if(gridSpaceIsEmpty)
                possibleMoves.push(item);
        });

        if(possibleMoves.length === 0)
            return null;
        
        var selectedIndex = Math.floor(Math.random()*possibleMoves.length);

        var boardSpot = possibleMoves[selectedIndex];
        var coordinates = convertIndexToBoardCoordinate(boardSpot);

        console.log("index: " + boardSpot + "  " + "coordinates: " + coordinates);

        var selectedSpace = convertIndexToBoardCoordinate(possibleMoves[selectedIndex]);

        return selectedSpace;
    }
};

function convertToSingularIndex(x, y){
    // 3 because it's a 3x3 grid
    return y * 3 + x;
}

function convertIndexToBoardCoordinate(index){
    var x = index % 3;
    var y = Math.floor( (index / 3) % 3 );

    return [x, y]
}


computerPlayer.takeTurn();
computerPlayer.takeTurn();
computerPlayer.takeTurn();

function canvasInteraction(clientCoordinates){
    for(x=0; x<3;x++){
        for(y=0;y<3;y++){
            
            var canvasCelCoordinates = convertBoardToCanvasCoordinates(x, y);
            var hasCollision = hasCollisionWithGridCel(clientCoordinates, canvasCelCoordinates);
            var boardSpaceIsEmpty = gameBoard[x][y] === "";
            var canInteract = players.humanPlayer.canInteract

            if(hasCollision && boardSpaceIsEmpty && canInteract && !game.hasEnded)
                playerTurn(x, y);
        }
    }
}

function playerTurn(x, y){
    currentPlayer = players.humanPlayer;

    // update board state
    gameBoard[x][y] = currentPlayer.piece;

    drawCrossOnCanvas(x, y);

    checkGameEndConditions(currentPlayer);
}

function checkGameEndConditions(player){
    if( checkIfPlayerHasWon(player) )
        console.log("player has won");
    else if( checkIfGameHasTied() )
        console.log("game has been tied");
}

function checkIfPlayerHasWon(player){
    winCombinations.forEach( function(winCombination){
        
        var sameCounter = 0;
        
        winCombination.forEach( function(boardPoint){
            if( gameBoard[ boardPoint[0] ][ boardPoint[1] ] === player.piece )
                sameCounter++;
        });

        if(sameCounter === 3){
            console.log("gameHasBeenWon")
            game.hasEnded = true;
            game.hasBeenWon = true;
            game.winningCombination = winCombination;
        }

    });

    if( game.hasBeenWon )
        return true;
    else
        return false

}

function checkIfGameHasTied(){
    var pieceCounter = 0;
    
    gameBoard.forEach(function(boardRow){
        boardRow.forEach(function(boardPiece){
            if(boardPiece !== "")
                pieceCounter++;
        })
    })

    if(pieceCounter === 9)
        return true
    else
        return false
}

function hasCollisionWithGridCel(clientXY, celXY){
    var startX = celXY.x;
    var endX = celXY.x + grid.sectionLength;
    var startY = celXY.y;
    var endY = celXY.y + grid.sectionLength;

    var hasXCollision = clientXY.x >= startX && clientXY.x <= endX;
    var hasYCollision = clientXY.y >= startY && clientXY.y <= endY;

    return hasXCollision && hasYCollision;
}





function drawCrossOnCanvas(boardX, boardY){
    var drawCoordinates = convertBoardToCanvasCoordinates(boardX, boardY);

    var lineStartY = drawCoordinates.y + grid.celPadding;
    var lineEndY = drawCoordinates.y + grid.sectionLength - grid.celPadding;

    var leftStart = drawCoordinates.x + grid.celPadding ;
    var rightStart = drawCoordinates.x + grid.sectionLength - grid.celPadding;
    var leftEnd = drawCoordinates.x + grid.sectionLength - grid.celPadding;
    var rightEnd =  drawCoordinates.x + grid.celPadding;

    canvasContext.beginPath();

    canvasContext.moveTo(leftStart, lineStartY);
    canvasContext.lineTo(leftEnd, lineEndY);

    canvasContext.moveTo(rightStart, lineStartY);
    canvasContext.lineTo(rightEnd, lineEndY);

    canvasContext.stroke();
}

function drawCircleOnCanvas(boardX, boardY){
    var drawCoordinates = convertBoardToCanvasCoordinates(boardX, boardY);

    var celCenterPoint = {
        x: drawCoordinates.x + grid.sectionLength/2,
        y: drawCoordinates.y + grid.sectionLength/2
    }

    var radius = (grid.sectionLength-(grid.celPadding*2))/2;

    canvasContext.beginPath();
    canvasContext.arc(celCenterPoint.x, celCenterPoint.y, radius, 0, Math.PI * 2);
    canvasContext.stroke();
}

function convertBoardToCanvasCoordinates(x, y){
    var canvasX = x * grid.sectionLength + grid.topLeftCoordinates.x;
    var canvasY = y * grid.sectionLength + grid.topLeftCoordinates.y;

    return {x: canvasX, y: canvasY};
}

function windowResizeEvent(){
    clearCanvas();
    updateCanvasAttributes(); 
    updateGridSize();
    updateGridAttributes();
    drawGridOnCanvas();
}

function clearCanvas(){
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

function updateCanvasAttributes(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasContext.translate(0.5, 0.5);

    canvasCenter = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };
}

function updateGridSize(){
    var winHeight = window.innerHeight;
    var winWidth = window.innerWidth;

    var totalMaxWidth = grid.maxWidth + grid.margin;
    var totalMaxHeight = grid.maxHeight + grid.margin;
    var totalMinWidth= grid.minWidth + grid.margin;
    var totalMinHeight = grid.minHeight + grid.margin;

    if(winWidth > totalMaxWidth && winHeight > totalMaxHeight)
        grid.setHeightAndWidth(grid.maxHeightWidth);
    else if(winWidth < totalMinWidth || winHeight < totalMinHeight)
        grid.setHeightAndWidth(grid.minHeighWidth)
    else
        scaleGridSize();
}

function scaleGridSize(){
    var innerHeight = window.innerHeight;
    var innerWidth = window.innerWidth;

    if(innerWidth < innerHeight)
        grid.setHeightAndWidth(innerWidth - grid.margin);
    else
        grid.setHeightAndWidth(innerHeight - grid.margin);
}

function updateGridAttributes(){
    grid.sectionLength = grid.width / 3;

    grid.topLeftCoordinates = {
        x: canvasCenter.x - grid.sectionLength * 1.5,
        y: canvasCenter.y - grid.sectionLength * 1.5
    };
}


function addMobileEvents(){
    canvas.addEventListener("touchstart", canvasTouchStartEvent);
}

function canvasTouchStartEvent(event){
    var clientXY = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    }

    canvasInteraction(clientXY);
}

function drawGridOnCanvas(){
    var lineStart = grid.sectionLength * 1.5;
    var lineEnd = -lineStart;

    var verticalStart = canvasCenter.y + lineStart;
    var verticalEnd = canvasCenter.y + lineEnd;

    var horizontalStart = canvasCenter.x + lineStart;
    var horizontalEnd = canvasCenter.x + lineEnd;

    canvasContext.beginPath();

    for(i=1; i>=-2; i-=2){
        var lineDifference = grid.sectionLength * 0.5 * i;
        var horizontalDifference = canvasCenter.y - lineDifference;
        var verticalDifference = canvasCenter.x - lineDifference;

        canvasContext.moveTo(verticalDifference, verticalStart);
        canvasContext.lineTo(verticalDifference, verticalEnd);

        canvasContext.moveTo(horizontalStart, horizontalDifference);
        canvasContext.lineTo(horizontalEnd, horizontalDifference);
    }

    canvasContext.stroke();
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
// function playerTurn(x, y){

//     // checks if the player is able to click, if the game hasn't been won, or isn't ended
//     if(grid[y][x] == 0 && playerClick==true & game.end == false & game.win == false){
        
//         // sets game-grid value to 1 where player put piece
//         grid[y][x] = 1;

//         animateX(x, y);
//         playerClick=false;

//         // checks if player has won
//         winCheck(1);
        
//         // executes delays for if player has won
//         if(game.end==true || game.win==true){
//             gameEndDelay(1);
//         }
//         // if the game hasn't ended, it's the turn of the computer
//         else if(game.end == false){

//             // delays time of when player can click again
//             setTimeout(function(){
//                 computer();
//                 playerClick=true;
//             }, xDuration-350)
//         }
//     }
    
// };

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
drawGridOnCanvas();
