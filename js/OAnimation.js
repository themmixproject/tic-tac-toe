function drawO(x, y){

    x = gridX(x);
    y = gridY(y);
    
    c.lineCap = theme.knot.cap;
    c.strokeStyle = theme.knot.color;
    c.lineWidth = theme.knot.thickness;

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
    
    
    resetBrush();
}

/*#####################################################\
 *|                                                    #
 *| 9. O Animation Function                            #
 *|                                                    #
\#####################################################*/

var oDuration = 900;

function animateO(x, y){

    x = gridX(x);
    y = gridY(y);

    c.lineCap = theme.knot.cap;
    c.strokeStyle = theme.knot.color;
    c.lineWidth = theme.knot.thickness;

    var secondsPassed = 0;
    var oldTimeStamp = 0;
    var timePassed = 0;

    var tc = 0;
    var oldTc = 0;
    var finalC = Math.PI*2;

    var animationFinish = false;

    function update(secondsPassed){
        timePassed += secondsPassed;
        tc = easing.easeOutExpo(timePassed, 0, Math.PI*2, oDuration/1000);
        if(timePassed>oDuration/1000 || game.end==true){
            animationFinish=true;
            tc = finalC;
            draw();
        }
        oldTc = tc;
    }

    function draw(){
        c.lineCap = theme.knot.cap;
        c.strokeStyle = theme.knot.color;
        c.lineWidth = theme.knot.thickness;

        c.clearRect(x + (padding / 2), y+(padding/2), sectionWidth - padding, sectionWidth-padding);
        c.beginPath()
        c.arc(
            x + sectionWidth / 2,
            y + sectionWidth / 2,
            sectionWidth / 2 - padding,
            0,
            tc,
            false
        );
        c.stroke();
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
