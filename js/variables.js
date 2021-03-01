// setting up canvas
var canvas = document.getElementById("canvas");
var canvasContext = canvas.getContext('2d');

function setCanvasHeightAndWidth(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

var canvasCenterCoordinates = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

var playerCanClick = true;
var computerCanMove = false;

game = {
    hasBeenWon: false,
    hasEnded: false,
    winningCombination
}

gameBoard = [
    [0, 0, 0]
    [0, 0, 0]
    [0, 0, 0]
]

gameBoardAttributes = {
    topLeftCoordinates: {
        x: canvasCenter.x - this.style.sectionWidth * 1.5,
        y: canvasCenter.y - this.style.sectionWidth * 1.5
    },
    style: {
        celPadding: 15,
        padding: 25,
        gridLineLength: 350.5,
        maximumBoardWidth: 350.5,
        minimumBoardWidth: 200,
        gridLineSectionLength: this.width / 3,
    },
}


// array of win-combinations relative to grid[] variable
var winCombinationCoordinates = [
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

// stores the game theme
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
