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
 * SPLIT THE FUNCTIONS CHAPTER INTO TWO OR THREE SEPERATE CHAPTERS
 * SPLIT THE VARABLES TO THE PROPERLY ASSIGNED CHAPTERS
 * 
 * REORGANIZE CHAPTERS
 * 
 * CREATE ANIMATION CLASS TO MINIMIZE ANIMATION CHAPTER
 * 
 * MAYBE SPLIT THE CODE INTO DIFFERENT FILES
 * 
 * ALL YOU NEED TO DO NOW IS ADD THE DRAWINLINE INTO THE FADEOUTRESET FUNCTION, MAKE SURE THERE'S AN ANIMATION BOOLEAN WITHIN IT
 * 
 * IF YOU HAVE THE TIME, REMOVE DEFAULT VARIABLES
 * 
 * 
 *
 * THEME : #D9695F #FFB4A8 #EFCDBF #4F9BA8 #2D3742
 * 
 * 
 * 
 * TWEAK FADOUT SO THAT IT DOES THE SAME WHEN THERE IS A TIE
 * TWEAK COMPUTER FUNCTION SO IT DOESN'T DRAW HALFWAY, AND LATER IT WILL DRAW THE FULL WINLINE
 * ADD THEME
 * 
 * JUST TO HAVE THIS NOTED: 
 * SO, IF YOU DISABLED THE ANIMATIONS,
 * NOT INCLUDING THE WINLINE, FOR THE COMPUTER IT WILL GET DRAWN
 * HALFWAY BECAUSE THE FUNCTIONS IN THE TURN FINISH TOO QUICK BEFORE
 * THE VARIABLES ARE ALTERED CORRECTLY FOR THE WINLINE TO BE DRAWN IN
 * THE CORRECT WAY, TRY TO FIX THIS, I DON'T KNOW WHY, BUT STILL.
 * 
 * TO FIX THE ISSUE THAT THE X ISN'T BEING DRAWN ON MOBILE IS BECAUSE IN THE ANIMATOIN FUNCTION THERE IS NO CONDITION OF IF WIN==TRUE AND GAME.END==TRUE, THEN THE X SHOULD JUST BE DRAWN ON THE BOARD
 * /

/**
 * 01:40:28 10-08-19 the fadeout reset animation worked for the first time
 * (it was actually 1:39, but I didn't catch the actual seconds so I had to look again)
 * 
 * 1:21:46 the first time the winline animation worked with a computer player
 * 
 * 22:10:33 12-08-19 after alot of testing, the combination manipulation bug seems to be fixed
 */









/*#####################################################\
 *|                                                    #
 *| 1. Monkey Patches                                  #
 *|                                                    #
\#####################################################*/

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












/*#####################################################\
 *|                                                    #
 *| 2. Global Utility Functions                        #
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

function resetBrush(){
    c.lineWidth = 1;
    c.strokeStyle = "black";
    c.fillStyle = "black";
    c.lineCap = "butt";

    c.globalAlpha = 1;
}

function toFps(miliseconds){
    return (miliseconds*60)/1000;
}














/*#####################################################\
 *|                                                    #
 *| 3. Canvas properties                               #
 *|                                                    #
\#####################################################*/

var gridWidth = 350.5;
var sectionWidth = gridWidth / 3;

if(innerWidth<gridWidth){
    gridWidth = (innerWidth*0.9);
    sectionWidth = gridWidth / 3;
    console.log(gridWidth);
    
}

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
    // background : "#FCF4C9"
    background : "#EFCDBF"
    // background : "#FFF6E6"
    // background : "#FBC49A"
};

var padding = 25;
 












/*#####################################################\
 *|                                                    #
 *| 4. Init Values                                     #
 *|                                                    #
 *| These values are the standard var's of canvas.js   #
 *|                                                    #
\#####################################################*/

// setting up canvas
var canvas = document.getElementById("canvas");
canvas.style.backgroundColor = theme.background;
var c = canvas.getContext('2d');

var dpi = window.devicePixelRatio;

c.scale(dpi,dpi);

c.translate(0.5,0.5);

// var innerWidth = window.innerWidth;
// var innerHeight = window.innerHeight;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var center = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

var topLeft = {
    x: center.x - sectionWidth * 1.5,
    y: center.y - sectionWidth * 1.5
};

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];


// sets if player is able to put a piece down

var playerClick = true;





/*#####################################################\
 *|                                                    #
 *| 5. Game Variables                                  #
 *|                                                    #
\#####################################################*/

var grid = [];

for(var i=0;i<3;i++){
    grid.push([0,0,0]);
}

var computerMoved = false;

var game = {
    end: false,
    win: false
};











/*#################################\
 *|                                #
 *| 5.1 Win Combinations           #
 *|                                #
\#################################*/

var combinations=[];

function setCombinations(){
    

    for(var y = 0; y < 3; y++){
        var array = [];
        for(var x = 0; x < 3; x++){
            array.push([x,y]);
        }
        combinations.push(array);
    }
    
    for(var y = 0; y < 3; y++){
        array = [];
        for(var x = 0; x < 3; x++){
            array.push([y,x]);
        }
        combinations.push(array);
    }

    for(i=0;i<1;i++){
        var array = [];
        var array1 = [];
            for(var x=2, y=0; x >= 0; x--, y++){
    
                array1.push([y,y]); 
    
                array.push([y, x]);
    
            }
        
        combinations.push(array1,array);
    }

}




















/*#####################################################\
 *|                                                    #
 *| 6. Event Listeners                                 #
 *|                                                    #
\#####################################################*/

// document.addEventListener("click",function(event){

//     mouse.x = event.clientX;
//     mouse.y = event.clientY;

//     for(x=0; x<3;x++){
//         for(y=0;y<3;y++){

//             // var gridX = x * sectionWidth + topLeft.x;
//             // var gridY = y * sectionWidth + topLeft.y;

//             if(
//                 mouse.x >= gridX(x) && mouse.x <= gridX(x) + sectionWidth &&
//                 mouse.y >= gridY(y) && mouse.y <= gridY(y) + sectionWidth
//             ){

//                 // index = x + (y * 3);

//                 playerTurn(x, y);

//                 // console.log(x + " " + y);

//             }
//         }
//     }

// });


// event that gets execute on tap or click
function canvasEvent(clientX, clientY){
    mouse.x = clientX;
    mouse.y = clientY;

    for(x=0; x<3;x++){
        for(y=0;y<3;y++){

            // var gridX = x * sectionWidth + topLeft.x;
            // var gridY = y * sectionWidth + topLeft.y;

            if(
                mouse.x >= gridX(x) && mouse.x <= gridX(x) + sectionWidth &&
                mouse.y >= gridY(y) && mouse.y <= gridY(y) + sectionWidth
            ){

                // console.log(mouse.x);
                
                // index = x + (y * 3);

                playerTurn(x, y);

                // console.log(x + " " + y);

            }
        }
    }

};

// Checks if browser is mobile, and adds a touch event
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    document.addEventListener("touchstart",function(event){
        var clientX = event.touches[0].clientX;
        var clientY = event.touches[0].clientY;

        canvasEvent(clientX, clientY);
    });



}
else{
    document.addEventListener("click",function(event) {
        canvasEvent(event.clientX, event.clientY);
    })


}

window.addEventListener("resize",function(){

    // console.log("resize");
        
    // innerWidth = window.innerWidth;
    // innerHeight = window.innerHeight;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    center = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };

    topLeft = {
        x: center.x - sectionWidth * 1.5,
        y: center.y - sectionWidth * 1.5
    };

    // drawGrid();
    redraw(); 
});



























/*#####################################################\
 *|                                                    #
 *| 7. Animation Utility                               #
 *|                                                    #
\#####################################################*/


// easing functions

function easeInOutExpo(t, b, c, d) {
    if (t==0) return b;
    if (t==d) return b+c;
    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
}

function easeInExpo(t, b, c, d) {
    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
}

function easeOutQuad(t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
}


function easeOutQuart(t, b, c, d) {
    return -c * ((t=t/d-1)*t*t*t - 1) + b;
}

function easeOutCubic(t, b, c, d) {
    return c*((t=t/d-1)*t*t + 1) + b;
}

function easeOutQuint(t, b, c, d) {
    return c*((t=t/d-1)*t*t*t*t + 1) + b;
  }

function linear(t, b, c, d) {
    return c*t/d + b;
}

// animation variables

var xDuration = 300;
var oDuration = 300;

var winLineDuration = 500;

var fadeDuration = 1/6*1000;
// var animation = class {
//     constructor(duration, startX, startY, endX, endY, ){
        
//     }
// }

// var testVar = new animation();






/*#####################################################\
 *|                                                    #
 *| 8. X Animation Function                            #
 *|                                                    #
\#####################################################*/

function drawFirst(x, y){

    var iteration = 0;
    // var totalIterations = toFps(400);

    var easingValueX;
    var easingValueY;

    function draw(){

        c.lineCap = theme.cross.cap;
        c.strokeStyle = theme.cross.color;
        c.lineWidth = theme.cross.thickness;

        // c.fillRect(
        //     x + (padding / 2),
        //     y + (padding / 2),
        //     sectionWidth - padding,
        //     sectionWidth - padding
        // )

        c.clearRect(
            x + (padding / 2),
            y + (padding / 2), 
            sectionWidth - padding,
            sectionWidth - padding

        )

        // resetBrush();

        easingValueX = easeOutQuart(
            iteration,
            (x + padding),
            (sectionWidth - padding*2),
            toFps(xDuration)
        );

        easingValueY = easeOutQuart(
            iteration,
            (y + padding),
            (sectionWidth - padding*2),
            toFps(xDuration)
        );
        
        easingValueX1 = easeOutQuart(
            iteration,
            (x + sectionWidth - padding),
            -sectionWidth+(padding*2),
            toFps(xDuration)
        );

        easingValueY1 = easeOutQuart(
            iteration,
            (y + padding),
            sectionWidth-(padding*2),
            toFps(xDuration)
        );

        drawPath(
            x + padding,
            y + padding,
            easingValueX,
            easingValueY
        );

        drawPath(
            x + sectionWidth - padding,
            y + padding,
            easingValueX1,
            easingValueY1
        );

        if(iteration<toFps(xDuration) && game.end==false){
            iteration ++;
            requestAnimationFrame(draw);
        }
        else if(game.end==true && game.win==false){

            drawPath(x + padding, y + padding,
                x + sectionWidth - padding,
                y + sectionWidth - padding
    
            );
    
            drawPath(
                x + sectionWidth - padding,
                y + padding,
                x + padding,
                y + sectionWidth - padding
            );
        }
        else if(game.end==true && game.win==true){

            drawPath(x + padding, y + padding,
                x + sectionWidth - padding,
                y + sectionWidth - padding
    
            );
    
            drawPath(
                x + sectionWidth - padding,
                y + padding,
                x + padding,
                y + sectionWidth - padding
            );

        }
    }

    draw();
    resetBrush();
}






















/*#####################################################\
 *|                                                    #
 *| 9. O Animation Function                            #
 *|                                                    #
\#####################################################*/

function animateCircle(x, y, rawX, rawY){
    var iteration = 0;
    // var totalIterations = toFps(500);
    var easingValue;

    function animate(){

        // console.log("run");
        
            var gridPosX = gridX(rawX) + (padding  / 2);
            var gridPosY = gridY(rawY) + (padding / 2);

            c.clearRect(
                gridPosX,
                gridPosY, 
                sectionWidth - padding,
                sectionWidth - padding

            );
            
        c.lineCap = theme.knot.cap;
        c.strokeStyle = theme.knot.color;
        c.lineWidth = theme.knot.thickness;

        easingValue = easeOutQuart(iteration, 0, Math.PI*2, toFps(oDuration));

        c.beginPath();
        
        c.arc(
            gridX(rawX) + sectionWidth / 2,
            gridY(rawY) + sectionWidth / 2,
            sectionWidth / 2 - padding,
            0,
            easingValue,
            false
        );
        
        c.stroke();

        if(iteration<toFps(oDuration) && game.end==false){
            // console.log("true");
            
            iteration ++;
            requestAnimationFrame(animate);
        }
        else if(game.end==true && game.win==false){
            c.clearRect(
                gridPosX,
                gridPosY, 
                sectionWidth - padding,
                sectionWidth - padding

            );
        }
        else if(game.end==true && game.win==true){
            c.beginPath();
            c.arc(
                x + sectionWidth / 2,
                y + sectionWidth / 2,
                sectionWidth / 2 - padding,
                0,
                Math.PI*2,
                false
            );
            c.stroke();
        }
    }

    animate();
}




/*#####################################################\
 *|                                                    #
 *| 9. WinLine Animation Function                      #
 *|                                                    #
\#####################################################*/

function animateWinLine(x, y, x1, y1){
	
	// drawPath(x, y, x1, y1);
    var iteration = 0;
    var easingValueX;
    var easingValueY;

    function animate(){

        c.clearRect(0,0, innerWidth, innerHeight);

        redraw();

        c.lineCap = theme.winLine.cap;
        c.strokeStyle = theme.winLine.color;
        c.lineWidth = theme.winLine.thickness;

        easingValueX = easeOutQuart(
            iteration,
            (x),
            (x1-x),
            toFps(winLineDuration)
        );

        easingValueY = easeOutQuart(
            iteration,
            (y),
            (y1-y),
            toFps(winLineDuration)
        );

        drawPath(
            x,
            y,
            easingValueX,
            easingValueY
        );
        

        if(iteration<toFps(winLineDuration)){
            iteration++;
            window.requestAnimationFrame(animate);
        }
        

    }

    animate();

    resetBrush();

}















/*#####################################################\
 *|                                                    #
 *| 10. FadeOut reset animation                        #
 *|                                                    #
\#####################################################*/

function fadeOutReset(win, winArray){

        var iteration = 0;
        var easingVar;

        console.log(winArray);

        // var alphaIteration = 1;

        function animate(){

            c.clearRect(0,0,innerWidth,innerHeight);
            c.globalAlpha = 1;
            drawGrid();
            var easingVar = linear(iteration, 1, -1, toFps(fadeDuration));
            c.globalAlpha = easingVar;
            grid.forEach(function(item,y){
                item.forEach(function(piece,x){
                    if(piece==1){
                        c.globalAlpha = easingVar;
                        drawX(x,y);
                    }
                    else if(piece==2){
                        c.globalAlpha = easingVar;
                        drawO(x,y);
                    }
                });
            });

            if(win==true){
                c.globalAlpha = easingVar;
                drawWinLine(winArray);
            }

            if(iteration<toFps(fadeDuration)){
                iteration++;
                window.requestAnimationFrame(animate);
            }

            if(iteration==10){
                resetBrush();
            }

        }

        animate();
        
        c.globalAlpha = 1;
}
























/*#####################################################\
 *|                                                    #
 *| 10. Drawing                                        #
 *|                                                    #
\#####################################################*/

function drawGrid(){

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
    
    resetBrush();

}

function redraw(){
    c.clearRect(0,0,innerHeight,innerWidth);
    drawGrid();
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




function drawX(x, y, animate=false){
    
    x = gridX(x);
    y = gridY(y);

    c.lineCap = theme.cross.cap;
    c.strokeStyle = theme.cross.color;
    c.lineWidth = theme.cross.thickness;

    // console.log(y + sectionWidth - padding);

    if(animate==true){
        drawFirst(x, y);

        // drawSecond(x, y);

        // setTimeout(function(){drawSecond(x, y);},(xDuration));

    }
    else{
        drawPath(x + padding, y + padding,
            x + sectionWidth - padding,
            y + sectionWidth - padding

        );

        drawPath(
            x + sectionWidth - padding,
            y + padding,
            x + padding,
            y + sectionWidth - padding
        );
    }


    resetBrush();

}




function drawO(x, y, animate=false){

    var rawX = x;
    var rawY = y;
    x = gridX(x);
    y = gridY(y);
    

    c.lineCap = theme.knot.cap;
    c.strokeStyle = theme.knot.color;
    c.lineWidth = theme.knot.thickness;

    if(animate == true){
        animateCircle(x, y, rawX, rawY);   
    }
    else{
        c.beginPath();
        c.arc(
            x + sectionWidth / 2,
            y + sectionWidth / 2,
            sectionWidth / 2 - padding,
            0,
            Math.PI*2,
            false
        );
        c.stroke();
    }
    
    
    resetBrush();
}










/*#####################################################\
 *|                                                    #
 *| 11. Game                                           #
 *|                                                    #
\#####################################################*/


function playerTurn(x, y){
    // console.log(combinations);
    
    // console.log(x + " " + y);
    if(game.end==true){game.end=false};

    if(grid[y][x] == 0 && playerClick==true){

        grid[y][x] = 1;
        
        drawX(x,y, true);

        playerClick=false;
        setTimeout(function(){

            checkWin(1);

        if(game.end == false){
            computer();
            playerClick=true;
        }
        },xDuration);
        

        
    }
    
};

function computerTurn(x, y){

    // console.log(combinations);
    

    // combinations = [];
    // setCombinations();
    // console.log(combinations);
    
    // setCombinations();

    grid[y][x] = 2;

    drawO(x, y, true);

    



    // checkWin(2);

    setTimeout(function(){
        checkWin(2);
    },oDuration);
    

}

function computer(){
    var l = combinations.length;
    var item;
    var turnArray;
    // var computerMoved;

    function bindVal(array){
        turnArray = array;
    }

    function computerLoop(player){
        
        // var turnArray;

        combinations.forEach(function(array,index){
        // for(i=0;i<l;i++){
            // combinationParse(array, player);
            // parse = array;
            item = combinations[i];
            for(var o=0; o<3; o++){
                if(
                    grid[ array[0][1] ][ array[0][0] ] == player &&
                    grid[ array[1][1] ][ array[1][0] ] == player &&
                    grid[ array[2][1] ][ array[2][0] ] == 0 &&
                    computerMoved == false
                ){
                    // console.log("true");

                    bindVal(
                        [array[2][0] , array[2][1]]
                    );
                    
                    
                    // computerTurn( array[2][0] , array[2][1] );
                    computerMoved = true;
                    
                    array.unshift(array[2]);
                    array.pop();
                }
                else {
                    array.unshift(array[2]);
                    array.pop();
                    
                }

            };
            
            
            
            
            // array.unshift(array[2]);
            // array.pop();

            // array = baseArray;
            
        });
        // console.log(turnArray);
        

        // }
    }
    
    computerLoop(2);
    computerLoop(1);

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
                // computerTurn( x, y);

                turnArray = [x , y];
            }
            return;
        }
        randomBox();
    }

    // console.log(turnArray);
    
    computerTurn(turnArray[0], turnArray[1]);

    computerMoved = false;
    return;
}

function drawWinLine(winArray, animate){

    // console.log(winArray);
    
    // console.log(winArray[0][1]);
    
    
    var halfSection = sectionWidth/2;
    
    // c.strokeStyle="red";

    var x = gridX(winArray[0][0]) + halfSection;
    var y = gridY(winArray[0][1]) + halfSection;

    var x1 = gridX(winArray[2][0]) + halfSection;
	var y1 = gridY(winArray[2][1]) + halfSection;
    

    c.lineCap = theme.winLine.cap;
    c.strokeStyle = theme.winLine.color;
    c.lineWidth = theme.winLine.thickness;

    // console.log(winArray);
    
    // console.log(winArray[0][0] +" "+ winArray[0][1] + " " + winArray[2][0] + " " + winArray[2][1] );
    

    if(animate==true){
       animateWinLine(x, y, x1, y1);
    }
    else{
        drawPath(
            x,
            y,
            x1,
            y1
        );
    }
    
	// animateWinLine(x, y, x1, y1);

    // drawPath(
    //     x,
    //     y,
    //     x1,
    //     y1
    // );
    
    // c.strokeStyle="red";

    resetBrush();
}

function checkWin(player){
    var winArray;
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
                // console.log("win");


                
                // drawWinLine(combination, true);
                winArray = combination;
                // drawWinLine(winArray, true);
                
            }
            else{counter=0};
        });
    if(game.win==true && game.end==true){
        // reset();

        playerClick = false;

        drawWinLine(winArray, true);

        setTimeout(function(){
            fadeOutReset(true, winArray);
            setTimeout(function(){reset();playerClick=true;},fadeDuration);
        }, winLineDuration);
        

    };

    counter=0;

    grid.forEach(function(array){

        array.forEach(function(item){
            if(item!=0){
                counter++;
            };
        })
        

        
    });

    // console.log(counter);
       
    if(counter==9 && game.end==false){
        game.end=true;
        console.log("tie");
        
        playerClick = false;

        // fadeOutReset();
        // reset();
        fadeOutReset();
        // reset();
        setTimeout(function(){
            reset();
            playerClick = true;
        }, fadeDuration);

    };
    
    counter=0;
}

function reset(){
    
    game.win = false;

    grid.forEach(function(item,index){
        grid[index] = [0,0,0];
    })

    // for(var x=0; x<3; x++){
    //     for(var y=0; y<3; y++){

    //         var gridX = x * sectionWidth + topLeft.x + (padding  / 2);
    //         var gridY = y * sectionWidth + topLeft.y + (padding / 2);

    //         c.clearRect(
    //             gridX,
    //             gridY, 
    //             sectionWidth - padding,
    //             sectionWidth - padding

    //         )
            
    //         // c.fillRect(
    //         //     gridX,
    //         //     gridY, 
    //         //     sectionWidth - padding,
    //         //     sectionWidth - padding

    //         // )
    //     }
    // }

    playerClick=true;

};













/*#####################################################\
 *|                                                    #
 *| 12. Intialize                                       #
 *|                                                    #
\#####################################################*/

// Implementation
function init() {

    setCombinations();
    drawGrid();

    console.log(combinations);
    console.log(grid);

}

init();