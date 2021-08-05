var animationRunner = {
    isRunning: false,
    runningAnimations: [],
    animationQueue: [],
        

    executeFrameUpdater : function(){
        animationRunner.isRunning = true;
        var delta = 0;
        var lastFrameDuration = 0;

        function updateFrame(frameDuration){            
            delta = (frameDuration - lastFrameDuration) / 1000;
            lastFrameDuration = frameDuration;

            delta = Math.min(delta, 0.1);

            animationRunner.runningAnimations.forEach(function(animation, index){

                animation.timePassed += delta;
                animation.updatePosition();
                animation.drawOnCanvas(delta);

                if(animation.timePassed > animation.duration){
                    animation.end();
                }
            })

            if(animationRunner.animationsAreRunning()){
                animationRunner.filterCompletedAnimations();
            
                var noRunningAnimations = animationRunner.runningAnimations.length === 0;
                var queueIsNotEmpty = animationRunner.animationQueue.length > 0;
            
                if(noRunningAnimations && queueIsNotEmpty){
                    animationRunner.playNextAnimationFromQueue();
                }
                
                window.requestAnimationFrame(updateFrame);
            }
            else{
                animationRunner.isRunning = false;
            }
        }
        updateFrame(0);
    },

    filterCompletedAnimations: function(){
        animationRunner.runningAnimations.forEach(function(animation, index){
            if(animation.isFinished){
                animationRunner.runningAnimations.splice(index, 1);
            }
        });
    },
    playNextAnimationFromQueue: function(){
        var firstInQueue = animationRunner.animationQueue[0];
        animationRunner.runningAnimations.push(firstInQueue);
        animationRunner.animationQueue.splice(0, 1);
    },
    animationsAreRunning: function(){
        return animationRunner.runningAnimations.length > 0;
    },
    runAnimation: function(animation){
        var animationsAreRunning = animationRunner.runningAnimations.length > 0;
        if(animation.addToQueue && animationsAreRunning){
            animationRunner.addAnimationToQueue(animation);
        }
        else{
            animationRunner.runningAnimations.push(animation);
        }

        if(!animationRunner.isRunning)
            animationRunner.executeFrameUpdater();
    },
    addAnimationToQueue: function(animation){
        animationRunner.animationQueue.push(animation);
    }
};

function BasicAnimation(startPoint, endPoint, duration){
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.duration = duration;
    this.currentPosition = 0;
    this.timePassed = 0;
    this.isFinished = false;
    this.easingType = "linear";
    this.addToQueue = false;
    this.callback = null;


    this.updatePosition = function(){
        this.currentPosition = easing[this.easingType](this.timePassed, this.startPoint, this.endPoint, this.duration);
    }
    this.drawOnCanvas;

    this.play = function(){
        animationRunner.runAnimation(this);
    };

     this.end = function(){
        this.currentPosition = this.endPoint;
        this.drawOnCanvas();
        this.isFinished = true;
        this.callback();
    }
       
}



function playCrossAnimationAtBoardCoordinates(x, y, callback){
    var crossAnimation = createCrossAnimationObject(x, y, callback);
    crossAnimation.play();
}

function createCrossAnimationObject(x, y, callback){
    var drawCoordinates = convertBoardToCanvasCoordinates(x, y)
    var crossAnimation = new BasicAnimation();

    var boardCoordinates = {x: x, y: y};

    crossAnimation.duration = 0.7;
    crossAnimation.easingType = "easeOutQuint";

    crossAnimation.verticalStart = drawCoordinates.y + grid.celPadding;
    crossAnimation.verticalEnd =  grid.sectionLength - (grid.celPadding*2);

    crossAnimation.leftStart = drawCoordinates.x + grid.celPadding ;
    crossAnimation.leftEnd = grid.sectionLength - (grid.celPadding*2);

    crossAnimation.rightStart = drawCoordinates.x + grid.sectionLength - grid.celPadding;
    crossAnimation.rightEnd =  -grid.sectionLength + (grid.celPadding*2);

    crossAnimation.currentLeftLinePos = 0;
    crossAnimation.currentRightLinePos = 0;
    crossAnimation.currentVerticalPos = 0;

    crossAnimation.updatePosition = function(){
        crossAnimation.currentLeftLinePos = easing[crossAnimation.easingType](crossAnimation.timePassed, crossAnimation.leftStart, crossAnimation.leftEnd, crossAnimation.duration);
        crossAnimation.currentRightLinePos = easing[crossAnimation.easingType](crossAnimation.timePassed, crossAnimation.rightStart, crossAnimation.rightEnd, crossAnimation.duration);

        crossAnimation.currentVerticalPos = easing[crossAnimation.easingType](crossAnimation.timePassed, crossAnimation.verticalStart, crossAnimation.verticalEnd, crossAnimation.duration);
    };

    crossAnimation.drawOnCanvas = function(){
        loadStyle(styles.cross);

        clearCanvasGridCel(boardCoordinates.x, boardCoordinates.y);
        
        canvasContext.beginPath();
        
        canvasContext.moveTo(crossAnimation.leftStart, crossAnimation.verticalStart);
        canvasContext.lineTo(crossAnimation.currentLeftLinePos, crossAnimation.currentVerticalPos);

        canvasContext.moveTo(crossAnimation.rightStart, crossAnimation.verticalStart);
        canvasContext.lineTo(crossAnimation.currentRightLinePos, crossAnimation.currentVerticalPos);

        canvasContext.stroke();
    };

    crossAnimation.play = function(){
        animationRunner.runAnimation(crossAnimation);
    };

    crossAnimation.end = function(){
        crossAnimation.isFinished = true;
        crossAnimation.callback();
    };

    crossAnimation.callback = callback;

    return crossAnimation;
}

function playCircleAnimationAtBoardCoordinates(x, y, callback){
    var circleAnimation = new BasicAnimation(0, 2 * Math.PI, 0.7);
    circleAnimation.easingType = "easeOutQuint";

    var boardCoordinates = {x: x, y: y};

    circleAnimation.drawOnCanvas = function(){
        loadStyle(styles.circle);

        var drawCoordinates = convertBoardToCanvasCoordinates(x, y);
        var celCenter = {
            x: drawCoordinates.x + (grid.sectionLength/2),
            y: drawCoordinates.y + (grid.sectionLength/2)
        };

        var circleRadius = (grid.sectionLength / 2) - grid.celPadding;

        clearCanvasGridCel(boardCoordinates.x, boardCoordinates.y);
        
        canvasContext.beginPath();
        canvasContext.arc(celCenter.x, celCenter.y, circleRadius, 0, circleAnimation.currentPosition);
        canvasContext.stroke()
    };

    circleAnimation.callback = callback;

    circleAnimation.play();
}

function playFadeOutBoardPiecesAnimation(callback){

    var fadeOutAnimation = new BasicAnimation(1, -1, 0.25);
    fadeOutAnimation.addToQueue = true;
    
    fadeOutAnimation.drawOnCanvas = function(){

        clearCanvas();
        drawGridOnCanvas();

        canvasContext.globalAlpha = fadeOutAnimation.currentPosition;
        drawBoardPiecesOnCanvas();

        if(game.hasBeenWon){
            drawWinLineOnCanvas();
        };

        canvasContext.globalAlpha = 1;
    }
    
    fadeOutAnimation.end = function(){ 
        fadeOutAnimation.currentPosition = 0;
        fadeOutAnimation.drawOnCanvas();
        fadeOutAnimation.isFinished = true;
        fadeOutAnimation.callback();
    }

    fadeOutAnimation.callback = callback;
    
    fadeOutAnimation.play();
};



function playWinLineAnimation(callback){
    var winCombination = game.winningCombination.sort();

    var startBoardCoordinates = winCombination[0];
    var endBoardCoordinates = winCombination[winCombination.length-1];

    var startCoordinates = convertBoardToCanvasCoordinates(startBoardCoordinates[0], startBoardCoordinates[1]);
    var endCoordinates = convertBoardToCanvasCoordinates(endBoardCoordinates[0], endBoardCoordinates[1]);

    var winLineAnimation = new BasicAnimation();
    winLineAnimation.duration = 0.5;
    winLineAnimation.easingType = "easeOutQuint";
    winLineAnimation.addToQueue = true;

    var halfSection = grid.sectionLength / 2;
    winLineAnimation.horizontalStart = startCoordinates.x + halfSection;
    winLineAnimation.verticalStart = startCoordinates.y + halfSection;

    winLineAnimation.horizontalEnd = (endCoordinates.x) - startCoordinates.x;
    winLineAnimation.verticalEnd = (endCoordinates.y) - startCoordinates.y;

    winLineAnimation.currentHorizontalPos = 0;
    winLineAnimation.currentVerticalPos = 0;

    winLineAnimation.updatePosition = function(){
        if(winLineAnimation.horizontalStart != winLineAnimation.horizontalEnd) {
            winLineAnimation.currentHorizontalPos = easing[winLineAnimation.easingType](winLineAnimation.timePassed, winLineAnimation.horizontalStart, winLineAnimation.horizontalEnd, winLineAnimation.duration);
        }
        else{
            winLineAnimation.currentHorizontalPos = winLineAnimation.horizontalStart;
        }
        
        if(winLineAnimation.verticalStart != winLineAnimation.verticalEnd) {
            winLineAnimation.currentVerticalPos = easing[winLineAnimation.easingType](winLineAnimation.timePassed, winLineAnimation.verticalStart, winLineAnimation.verticalEnd, winLineAnimation.duration);
        }
        else {
            winLineAnimation.currentVerticalPos = winLineAnimation.verticalStart;
        }        
    };

    winLineAnimation.drawOnCanvas = function(){
        clearCanvas();

        drawGridOnCanvas();
        drawBoardPiecesOnCanvas();

        loadStyle(styles.winLine);

        canvasContext.beginPath();
        canvasContext.moveTo(winLineAnimation.horizontalStart, winLineAnimation.verticalStart);
        canvasContext.lineTo(winLineAnimation.currentHorizontalPos, winLineAnimation.currentVerticalPos);
        canvasContext.stroke();
    };

    winLineAnimation.play = function(){
        animationRunner.runAnimation(winLineAnimation);
    };

    winLineAnimation.end = function(){
        winLineAnimation.isFinished = true;
        winLineAnimation.callback();
    };

    winLineAnimation.callback = callback;

    winLineAnimation.play();
}


