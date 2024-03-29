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

var styles = {
    defaultThickness: 10,
    cross : {
        color : "#4F9BA8",
        cap : "round",
        thickness : 10
    },
    circle : {
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
};

var canvasBackgroundColor = "#EFCDBF";


/*#####################################################\
 *|                                                    #
 *| 3. Canvas properties                               #
 *|                                                    #
 \#####################################################*/

// setting up canvas
var canvas = document.getElementById("canvas");
canvas.style.backgroundColor = canvasBackgroundColor;
 
var canvasContext = canvas.getContext('2d');

var devicePixelRatio = Math.ceil(window.devicePixelRatio || 1);
var backingStoreRatio =
    canvasContext.webkitBackingStorePixelRatio ||
    canvasContext.mozBackingStorePixelRatio ||
    canvasContext.msBackingStorePixelRatio ||
    canvasContext.oBackingStorePixelRatio ||
    canvasContext.backingStorePixelRatio ||
    1;

devicePixelRatio = devicePixelRatio / backingStoreRatio;


var height = window.innerHeight;
var width = window.innerWidth;
canvas.width = width * devicePixelRatio;
canvas.height = height * devicePixelRatio;
canvas.style.height = height + "px";
canvas.style.width = width + "px";

canvasContext.scale(window.devicePixelRatio, window.devicePixelRatio)

var canvasCenter = {
    x: width / 2,
    y: height / 2
};

function loadStyle(style){
    canvasContext.lineWidth = style.thickness;
    canvasContext.lineCap = style.cap;
    canvasContext.strokeStyle = style.color;
}

function resetContextStyleToDefault(){
    canvasContext.lineWidth = 1;
    canvasContext.lineCap = "butt";
    canvasContext.strokeStyle = "#000000";
}

grid = {
    margin: 15,
    celPadding: 20,
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

function scaleCanvasOnLoad(){
    updateCanvasAttributes();
    updateGridSize();
    updateGridAttributes();
}

var gameBoard = {
    _board: [
        "", "", "",
        "", "", "",
        "", "", "",
    ],
    setState: function(index, state){
        gameBoard._board[index] = state;
    },
    getState: function(index){
        return gameBoard._board[index]
    },
    getStates: function(indexes){
        var states=[]
        for(i = 0; i < indexes.length; i++){
            var index = indexes[i]
            states.push(gameBoard._board[index])
        }

        return states;
    },
    getAllStates: function(){
        return gameBoard._board;
    },
    reset: function(){
        for(i = 0; i < gameBoard._board.length; i++){
            gameBoard._board[i] = ""
        }
    }
}

var computerHasMoved = false;
var playerCanClick = true;

var game = {
    hasBeenWon: false,
    hasEnded: false,
    winningCombination: [],
    endFunctionHasBeenCalled: false
}

var winCombinations = [
    // horizontal
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // vertical
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    
    // diagonal
    [0, 4, 8],
    [6, 4, 2]
];


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

function convertBoardCoordinateToIndex(x, y){
    // 3 because it's a 3x3 grid
    return y * 3 + x;
}

function convertIndexToBoardCoordinate(index){
    var x = index % 3;
    var y = Math.floor( (index / 3) % 3 );

    return [x, y]
}

function shuffleArray(array) {
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

function canvasInteraction(clientCoordinates){
    for(x=0; x<3;x++){
        for(y=0;y<3;y++){
            var canvasCelCoordinates = convertBoardToCanvasCoordinates(x, y);
            var hasCollision = hasCollisionWithGridCel(clientCoordinates, canvasCelCoordinates);
            
            var boardIndex = convertBoardCoordinateToIndex(x, y);

            var boardSpaceIsEmpty = gameBoard.getState(boardIndex) === "";
            var canInteract = players.humanPlayer.canInteract;
            if(hasCollision && boardSpaceIsEmpty && canInteract && !game.hasEnded)
                playerTurn(x, y, boardIndex);
        }
    }
}

function playerTurn(x, y, index){
    players.humanPlayer.canInteract = false;

    currentPlayer = players.humanPlayer;
    gameBoard.setState(index, currentPlayer.piece)

    checkGameEndConditions(currentPlayer);
    playCrossAnimationAtBoardCoordinates(x, y, function(){
        if(game.hasEnded && !game.endFunctionHasBeenCalled)
            endGame();
        else
            computerPlayer.takeTurn();
    });
}

function checkGameEndConditions(player){
    checkIfPlayerHasWon(player);
    checkIfGameHasTied();
}

function endGame(){
    game.endFunctionHasBeenCalled = true;
    if(game.hasBeenWon){
        playWinLineAnimation(function(){
            restartGame();
        });
    }
    else if(game.hasEnded){
        restartGame();
    }
}

function restartGame(){
    players.humanPlayer.canInteract = false;
    playFadeOutBoardPiecesAnimation(function(){
        clearCanvas();
        drawGridOnCanvas();

        resetGameVariablesToDefault();
        gameBoard.reset()
    
        computerPlayer.resetVariablesToDefault();
        computerPlayer.init();

        players.humanPlayer.canInteract = true;
    });
}

function resetGameVariablesToDefault(){
    game.hasBeenWon = false;
    game.hasEnded = false;
    game.winningCombination = [];
    game.endFunctionHasBeenCalled = false;
};

function clearPiecesFromGrid(){
    for(x = 0; x < 3; x++){
        for(y = 0; y < 3; y++){
            clearCanvasGridCel(x, y);
        }
    }
}

function checkIfPlayerHasWon(player){
    winCombinations.forEach( function(winCombination){
        var sameCounter = 0;
        for(i = 0; i < winCombination.length; i++){
            var index = winCombination[i]
            if(gameBoard.getState(index) === player.piece)
                sameCounter++;
        }

        if(sameCounter === 3){
            game.hasEnded = true;
            game.hasBeenWon = true;
            game.winningCombination = winCombination;
        }

    });    
}

function checkIfGameHasTied(){
    if(gameBoard.getAllStates().indexOf("") === -1){
        game.hasEnded = true;    
    };
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
    loadStyle(styles.cross);

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
    loadStyle(styles.circle);
    
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
    drawBoardPiecesOnCanvas();
}

function clearCanvas(){
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

function clearCanvasGridCel(x, y){
    var clearStartCoordinates = convertBoardToCanvasCoordinates(x, y);

    var clearStartX = clearStartCoordinates.x + (grid.celPadding / 2) + 2;
    var clearStartY = clearStartCoordinates.y + (grid.celPadding / 2) + 2;
    var clearLength = grid.sectionLength - ((grid.celPadding/2) * 2) - 2;

    canvasContext.clearRect(clearStartX, clearStartY, clearLength, clearLength);
}

function updateCanvasAttributes(){
    var height = window.innerHeight;
    var width = window.innerWidth;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.height = height + "px";
    canvas.style.width = width + "px";
    
    canvasContext.scale(window.devicePixelRatio, window.devicePixelRatio)
    
    canvasCenter = {
        x: width / 2,
        y: height / 2
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
        grid.setHeightAndWidth(grid.minHeighWidth);
    else
        scaleGridSize();
    
    scaleBoardPieces();
}

function scaleGridSize(){
    var innerHeight = window.innerHeight;
    var innerWidth = window.innerWidth;

    if(innerWidth < innerHeight)
        grid.setHeightAndWidth(innerWidth - grid.margin);
    else
        grid.setHeightAndWidth(innerHeight - grid.margin);
}

function scaleBoardPieces(){
    // (grid.sectionLength - (grid.celPadding))/grid.width
    var newThickness =  Math.round((0.028530 * grid.width) * 10) / 10;

    setGlobalStyleThickness(newThickness);

    // calculated by "grid.celPadding / grid.width";
    var paddingScaleFactor = 0.05706134094151213;
    grid.celPadding = Math.round((paddingScaleFactor * grid.width) * 10) / 10;
}

function setGlobalStyleThickness(newThickness){
    styles.grid.thickness = newThickness;
    styles.circle.thickness = newThickness;
    styles.cross.thickness = newThickness;
    styles.winLine.thickness = newThickness;
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
    loadStyle(styles.grid);

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

function drawBoardPiecesOnCanvas(){
    clearPiecesFromGrid();
    for(i = 0; i < gameBoard.getAllStates().length; i++){
        var boardPiece = gameBoard.getState(i);
        var coords = convertIndexToBoardCoordinate(i)

        if(boardPiece !== "")
            drawBoardPieceAt(coords[0], coords[1], boardPiece)
    }
}

function drawBoardPieceAt(x, y, piece){
    if(piece === players.humanPlayer.piece )
        drawCrossOnCanvas(x, y);
    else
        drawCircleOnCanvas(x, y);
}

function drawWinLineOnCanvas(){
    loadStyle(styles.winLine);

    var winCombination = game.winningCombination.sort();
    var startBoardCoordinates = winCombination[0];
    var endBoardCoordinates = winCombination[winCombination.length-1];

    var startCoordinates = convertBoardToCanvasCoordinates(startBoardCoordinates[0], startBoardCoordinates[1]);
    var endCoordinates = convertBoardToCanvasCoordinates(endBoardCoordinates[0], endBoardCoordinates[1]);

    var halfSection = grid.sectionLength / 2;
    var horizontalStart = startCoordinates.x + halfSection;
    var verticalStart = startCoordinates.y + halfSection;

    var horizontalEnd = endCoordinates.x  + halfSection;
    var verticalEnd = endCoordinates.y + halfSection;

    canvasContext.beginPath();
    canvasContext.moveTo(horizontalStart, verticalStart);
    canvasContext.lineTo(horizontalEnd, verticalEnd);
    canvasContext.stroke();
}

/*#####################################################\
 *|                                                    #
 *| 12. Intialize                                      #
 *|                                                    #
\#####################################################*/

// Implementation

addEvents();
scaleCanvasOnLoad();
drawGridOnCanvas();
