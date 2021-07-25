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
        // this.currentPosition = this.endPoint;
        // this.drawOnCanvas();
        this.isFinished = true;
    }
       
}

animation_1 = new BasicAnimation(20, 200, 1);
animation_1.drawOnCanvas = function(){
    canvasContext.beginPath();
    canvasContext.moveTo(50, 50);
    canvasContext.lineTo(50, animation_1.currentPosition);
    canvasContext.stroke();
}

animation_2 = new BasicAnimation(40, 200, 1);
animation_2.drawOnCanvas = function(){
    canvasContext.beginPath();
    canvasContext.moveTo(50, 80);
    canvasContext.lineTo(animation_2.currentPosition, 80);
    canvasContext.stroke();
}

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
                canvasContext.stroke();

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

function playCrossAnimationOnBoardCoordinates(x, y, callback){
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
    };

    crossAnimation.play = function(){
        animationRunner.runAnimation(crossAnimation);
    };

    crossAnimation.end = function(){
        // this.currentPosition = this.endPoint;
        // this.drawOnCanvas();
        crossAnimation.isFinished = true;
    };

    return crossAnimation;
}
