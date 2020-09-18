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

        c.clearRect(
            x + (padding / 2),
            y + (padding / 2), 
            sectionWidth - padding,
            sectionWidth - padding

        )

        easingValueX = easeOutQuart(iteration, (x + padding), (sectionWidth - padding*2), toFps(xDuration));
        easingValueY = easeOutQuart(iteration, (y + padding), (sectionWidth - padding*2), toFps(xDuration));
        
        easingValueX1 = easeOutQuart(iteration, (x + sectionWidth - padding), -sectionWidth+(padding*2), toFps(xDuration));
        easingValueY1 = easeOutQuart(iteration, (y + padding), sectionWidth-(padding*2), toFps(xDuration));

        drawPath(x + padding, y + padding, easingValueX, easingValueY);
        drawPath(x + sectionWidth - padding, y + padding, easingValueX1, easingValueY1);

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

