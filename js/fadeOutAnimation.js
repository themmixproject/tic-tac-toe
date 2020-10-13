
var fadeDuration = 1/6*1000;

/*#####################################################\
 *|                                                    #
 *| 10. FadeOut reset animation                        #
 *|                                                    #
\#####################################################*/

function fadeOutReset(win, winArray){

    var iteration = 0;
    var easingVar;


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
