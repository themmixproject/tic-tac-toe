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
        tc = easeOutQuart(timePassed, 0, Math.PI*2, 1.5);
        if(tc<oldTc){
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
