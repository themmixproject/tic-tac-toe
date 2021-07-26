var animationRunner = {
    isRunning: false,
    runningAnimations: [],
    run: function(){
        animationRunner.isRunning = true;

        var lastFrameDuration = 0;
        var delta = 0;
        
        function updateFrame(frameDuration){            
            delta = (frameDuration - lastFrameDuration) / 1000;
            lastFrameDuration = frameDuration;
    
            delta = Math.min(delta, 0.1);
    
            animationRunner.runningAnimations.forEach(function(animation, index){                
                animation.timePassed += delta;
                animation.updatePosition();

                if(animation.timePassed > animation.duration){
                    animation.end()
                }
            })
            
            if(!animationRunner.animationsAreFinished()){
                animationRunner.runningAnimations.forEach(function(animation){
                    animation.drawOnCanvas(delta);
                })

                window.requestAnimationFrame(updateFrame);
            }
        }
        updateFrame(0);
        animationRunner.isRunning = false;
    },
    animationsAreFinished: function(){
        var animationsFinished = true;

        animationRunner.runningAnimations.forEach(function(animation, index){
            if(animation.isFinished)
                animationRunner.runningAnimations.splice(index, 1);
            else
                animationsFinished = false;
        })

        return animationsFinished;
    },
    runAnimation: function(animation){
        animationRunner.runningAnimations.push(animation);
        if(!animationRunner.isRunning)
            animationRunner.run();
    },
}

function BasicAnimation(startPoint, endPoint, duration){
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.duration = duration;
    this.currentPosition = 0;
    this.timePassed = 0;
    this.isFinished = false;
    this.easingType = "linear";


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

    crossAnimation.duration = 0.25;

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
    var circleAnimation = new BasicAnimation(0, 2 * Math.PI, 0.25);

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