function drawX(x, y){
    
    x = gridX(x);
    y = gridY(y);

    c.lineCap = theme.cross.cap;
    c.strokeStyle = theme.cross.color;
    c.lineWidth = theme.cross.thickness;

    drawPath(
        x + padding,
        y + padding,
        x + sectionWidth - padding,
        y + sectionWidth - padding
    );

    drawPath(
        x + sectionWidth - padding,
        y + padding,
        x + padding,
        y + sectionWidth - padding
    );

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


var xDuration = 500;

function animateX(x, y){

    x = gridX(x);
    y = gridY(y);

    c.lineCap = theme.cross.cap;
    c.strokeStyle = theme.cross.color;
    c.lineWidth = theme.cross.thickness;

    var secondsPassed = 0;
    var oldTimeStamp = 0;
    var timePassed = 0;

    var ty = 0;
    var txLeft = 0;
    var txRight = 0;
    var oldTy = 0;
    var animationFinish = false;

    var finalY = y+sectionWidth-padding;
    var finalXLeft = x+sectionWidth-padding;
    var finalXRight = x+padding;

    function update(secondsPassed){
        timePassed += secondsPassed;

        ty = easeOutExpo(timePassed, (y + padding), sectionWidth-(padding*2), xDuration/1000);
        txLeft = easeOutExpo(timePassed, (x + padding), (sectionWidth - padding*2), xDuration/1000);
        txRight = easeOutExpo(timePassed, (x + sectionWidth - padding), -sectionWidth+(padding*2), xDuration/1000);

        if(timePassed>xDuration/1000){
            animationFinish = true;
            ty = finalY;
            txLeft = finalXLeft;
            txRight = finalXRight;
            draw();
        }
        oldTy = ty;
    }

    function draw(){
        c.lineCap = theme.cross.cap;
        c.strokeStyle = theme.cross.color;
        c.lineWidth = theme.cross.thickness;

        c.clearRect(x + (padding / 2), y+(padding/2), sectionWidth - padding, sectionWidth-padding);
        drawPath(x + padding, y + padding, txLeft, ty);
        drawPath(x + sectionWidth - padding, y + padding, txRight, ty);
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
