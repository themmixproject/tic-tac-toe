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

var xDuration = 600;

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

        ty = easing.easeOutExpo(timePassed, (y + padding), sectionWidth-(padding*2), xDuration/1000);
        txLeft = easing.easeOutExpo(timePassed, (x + padding), (sectionWidth - padding*2), xDuration/1000);
        txRight = easing.easeOutExpo(timePassed, (x + sectionWidth - padding), -sectionWidth+(padding*2), xDuration/1000);

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
