function drawWinLine(winArray, animate){
    
    var halfSection = sectionWidth/2;

    var x = gridX(winArray[0][0]) + halfSection;
    var y = gridY(winArray[0][1]) + halfSection;

    var x1 = gridX(winArray[2][0]) + halfSection;
	var y1 = gridY(winArray[2][1]) + halfSection;

    c.lineCap = theme.winLine.cap;
    c.strokeStyle = theme.winLine.color;
    c.lineWidth = theme.winLine.thickness;

    if(animate==true){
       animateWinLine(x, y, x1, y1);
    }
    else{
        drawPath(x, y, x1, y1);
    }

    resetBrush();

    return;
}

/*#####################################################\
 *|                                                    #
 *| 9. WinLine Animation Function                      #
 *|                                                    #
\#####################################################*/

var winLineDuration = 500;

function animateWinLine(winArray){

    var halfSection = sectionWidth/2;

    var startX = gridX(winArray[0][0]) + halfSection;
    var startY = gridY(winArray[0][1]) + halfSection;

    var endX = gridX(winArray[2][0]) + halfSection;
    var endY = gridY(winArray[2][1]) + halfSection;

    var secondsPassed = 0;
    var oldTimeStamp = 0;
    var timePassed = 0;
    var animationFinish = false;
    var positivedx = false;
    var positivedy = false;

    var tx = null;
    var ty = null;
    var oldTx = 0;
    var oldTy = 0;

    if(endX>startX){
        positivedx=true;
    }
    else if(endY>startY){
        positivedy=true;
    }

    function endAnimation(){
        console.log("winline ended");
        animationFinish = true;
        ty = endY;
        tx = endX;
        draw();
    }
    
    function update(secondsPassed){
        
        timePassed+=secondsPassed;

        if(startX!=endX){
            tx = easeOutQuart(timePassed, startX, endX-startX, winLineDuration/1000);
        }
        else{
            tx = startX
        }
        if(startY!=endY){
            ty = easeOutQuart(timePassed, startY, endY-startY, winLineDuration/1000);
        }
        else{
            ty = startY
        }

        if(timePassed>winLineDuration/1000){
            endAnimation();
        }

        oldTx = tx;
        oldTy = ty;
        
    }

    function draw(){
        
        redraw();

        c.lineCap = theme.winLine.cap;
        c.strokeStyle = theme.winLine.color;
        c.lineWidth = theme.winLine.thickness;

        // c.clearRect(x + (padding / 2), y+(padding/2), sectionWidth - padding, sectionWidth-padding);
        drawPath(startX, startY, tx, ty);
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
}
