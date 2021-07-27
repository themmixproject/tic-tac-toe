var animationRunner = {
    isRunning: false,
    runningAnimations: [],
    animationQueue: [],
    run: function(){
        animationRunner.isRunning = true;

        var lastFrameDuration = 0;
        var delta = 0;
        
        function updateFrame(frameDuration){            
            delta = (frameDuration - lastFrameDuration) / 1000;
            lastFrameDuration = frameDuration;

            delta = Math.min(delta, 0.01);

            animationRunner.runningAnimations.forEach(function(animation, index){

                animation.timePassed += delta;
                animation.updatePosition();

                if(animation.timePassed > animation.duration){
                    animation.end();
                }
            })
            animationRunner.filterCompletedAnimations();
            
            if(animationRunner.animationsAreRunning()){
                animationRunner.runningAnimations.forEach(function(animation){
                    animation.drawOnCanvas(delta);
                })

                var noRunningAnimations = animationRunner.runningAnimations.length === 0;
                var queueIsNotEmpty = animationRunner.animationQueue.length > 0;
                if(noRunningAnimations && queueIsNotEmpty){
                    animationRunner.playNextAnimationFromQueue();
                }

                window.requestAnimationFrame(updateFrame);
            }
        }
        updateFrame(0);
        animationRunner.isRunning = false;
    },
    filterCompletedAnimations: function(){
        animationRunner.runningAnimations.forEach(function(animation, index){
            if(animation.isFinished)
                animationRunner.runningAnimations.splice(index, 1);
        });
    },
    playNextAnimationFromQueue: function(){
        var queueAnimation = animationRunner.animationQueue[0];
        animationRunner.runningAnimations.push(queueAnimation);
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
            animationRunner.run();
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
    }
       
}


// animation_1 = new BasicAnimation(20, 200, 1);
// animation_1.drawOnCanvas = function(){
//     canvasContext.beginPath();
//     canvasContext.moveTo(50, 50);
//     canvasContext.lineTo(50, animation_1.currentPosition);
//     canvasContext.stroke();
// }
// animation_1.addToQueue = true;

// animation_2 = new BasicAnimation(40, 200, 1);
// animation_2.drawOnCanvas = function(){
//     canvasContext.beginPath();
//     canvasContext.moveTo(50, 80);
//     canvasContext.lineTo(animation_2.currentPosition, 80);
//     canvasContext.stroke();
// }
// animation_2.addToQueue = true;

// animation_1.play();
// animation_2.play();













function playCrossAnimationAtBoardCoordinates(x, y, callback){
    var crossAnimation = createCrossAnimationObject(x, y);
    crossAnimation.play();
    
    setTimeout(function(){
        callback();
    }, crossAnimation.duration*1000);
}

function createCrossAnimationObject(x, y){
    var drawCoordinates = convertBoardToCanvasCoordinates(x, y)
    var crossAnimation = new BasicAnimation();

    crossAnimation.duration = 1;

    crossAnimation.verticalStart = drawCoordinates.y + grid.celPadding;
    crossAnimation.verticalEnd =  grid.sectionLength - (grid.celPadding*2);

    crossAnimation.leftStart = drawCoordinates.x + grid.celPadding ;
    crossAnimation.leftEnd = grid.sectionLength -(grid.celPadding*2);

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
        var clearLength = grid.sectionLength - 2;
        canvasContext.clearRect(drawCoordinates.x + 2 , drawCoordinates.y + 2, clearLength - 2, clearLength - 2);

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
    };

    return crossAnimation;
}

function playCircleAnimationAtBoardCoordinates(x, y, callback){
    var circleAnimation = new BasicAnimation(0, 2 * Math.PI, 1);

    circleAnimation.drawOnCanvas = function(){
        var drawCoordinates = convertBoardToCanvasCoordinates(x, y);
        var celCenter = {
            x: drawCoordinates.x + (grid.sectionLength/2),
            y: drawCoordinates.y + (grid.sectionLength/2)
        };

        var circleRadius = (grid.sectionLength / 2) - grid.celPadding;

        var clearLength = grid.sectionLength - 2;
        canvasContext.clearRect(drawCoordinates.x + 2 , drawCoordinates.y + 2, clearLength - 2, clearLength - 2);
        
        canvasContext.beginPath();
        canvasContext.arc(celCenter.x, celCenter.y, circleRadius, 0, circleAnimation.currentPosition);
        canvasContext.stroke()
    };

    circleAnimation.play();
    
    setTimeout(function(){
        callback();
    }, circleAnimation.duration*1000);
}

function playFadeOutBoardPiecesAnimation(callback){
    var fadeOutAnimation = new BasicAnimation(1, -1, 0.25);
    fadeOutAnimation.addToQueue = true;
    
    fadeOutAnimation.drawOnCanvas = function(){
        canvasContext.globalAlpha = fadeOutAnimation.currentPosition;

        drawBoardPiecesOnCanvas();

        canvasContext.globalAlpha = 1;
    }
    
    fadeOutAnimation.end = function(){ 
        fadeOutAnimation.currentPosition = 0;
        fadeOutAnimation.drawOnCanvas();
        fadeOutAnimation.isFinished = true;
    }

    fadeOutAnimation.play();

    setTimeout(function(){
        callback();
    }, fadeOutAnimation.duration*1000);
};

function drawBoardPiecesOnCanvas(){
    clearPiecesFromGrid();

    for(x = 0; x < 3; x++){
        for(y = 0; y < 3; y++){
            var boardPiece = gameBoard[x][y];
            var isEmpty = boardPiece === "";
            
            if(!isEmpty)
                drawBoardPieceAt(x, y, boardPiece);
        }
    }
}

function drawBoardPieceAt(x, y, piece){
    if(piece === players.humanPlayer.piece )
        drawCrossOnCanvas(x, y);
    else
        drawCircleOnCanvas(x, y);
}
