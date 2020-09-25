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

        drawPath(x, y, easingValueX, easingValueY);

        if(iteration<toFps(winLineDuration)){
            iteration++;
            window.requestAnimationFrame(animate);
        }
        

    }

    animate();

    resetBrush();

}
