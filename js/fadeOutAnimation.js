
var fadeDuration = 250;

// /*#####################################################\
//  *|                                                    #
//  *| 10. FadeOut reset animation                        #
//  *|                                                    #
// \#####################################################*/

// function fadeOutReset(win, winArray){

//     var iteration = 0;
//     var easingVar;


//     // var alphaIteration = 1;

//     function animate(){

//         console.log("fadeout iteration");

//         c.clearRect(0,0,innerWidth,innerHeight);
//         c.globalAlpha = 1;
//         drawGrid();
//         var easingVar = linear(iteration, 1, -1, toFps(fadeDuration));
//         c.globalAlpha = easingVar;
//         grid.forEach(function(item,y){
//             item.forEach(function(piece,x){
//                 if(piece==1){
//                     c.globalAlpha = easingVar;
//                     drawX(x,y);
//                 }
//                 else if(piece==2){
//                     c.globalAlpha = easingVar;
//                     drawO(x,y);
//                 }
//             });
//         });

//         if(win==true){
//             c.globalAlpha = easingVar;
//             drawWinLine(winArray);
//         }

//         if(iteration<toFps(fadeDuration)){
//             iteration++;
//             window.requestAnimationFrame(animate);
//         }

//         if(iteration==toFps(fadeDuration)){
//             resetBrush();
//         }

//     }

//     animate();
    
//     c.globalAlpha = 1;
// }

function fadeOutReset(win, winArray){
    
    var secondsPassed = 0;
    var oldTimeStamp  = 0;
    var timePassed  = 0;
    var animationFinish = false;

    var startOpacity = 1;
    var to = 0;

    var finalOpacity = 0;

    function update(secondsPassed){
        
        console.log("fade-iteration");

        timePassed += secondsPassed;
        
        to = easing.linear(timePassed, 1, -1, fadeDuration/1000)

        if(timePassed>fadeDuration/1000){
            animationFinish = true;
            to = finalOpacity;
            draw();
        }
        
    }

    function draw(){
        c.clearRect(0,0,innerWidth,innerHeight);
        drawGrid();
        c.globalAlpha = to;
        grid.forEach(function(item,y){
            item.forEach(function(piece,x){
                if(piece==1){
                    c.globalAlpha = to;
                    drawX(x,y);
                }
                else if(piece==2){
                    c.globalAlpha = to;
                    drawO(x,y);
                }
            });
        });
        if(win==true){
            c.globalAlpha = to;
            drawWinLine(winArray);
        }
            
    }

    function animate(timeStamp){
        // Calculate how much time has passed
        secondsPassed = (timeStamp - oldTimeStamp) / 1000;
        oldTimeStamp = timeStamp;

        // Move forward in time with a maximum amount
        secondsPassed = Math.min(secondsPassed, 0.1);

        // Pass the time to the update
        update(secondsPassed);
        if(!animationFinish){
            draw();
            window.requestAnimationFrame(animate);
        }
        else{
            resetBrush();
        }
    }

    animate(timePassed);
    resetBrush();

}
