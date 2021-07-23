function BasicAnimation(startPoint, endPoint, duration){
    this.startPoint = 40;
    this.endPoint = 150;
    this.duration = 1;
    this.currentPosition = 0;
    this.timePassed = 0;
    this.isFinished = false;
    this.easing = "linear";


    this.updatePosition = function(){
        this.currentPosition = easing[this.easing](this.timePassed, this.startPoint, this.endPoint, this.duration);

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
            console.log("hello");

            delta = (frameDuration - lastFrameDuration) / 1000;
            lastFrameDuration = frameDuration;
    
            delta = Math.min(delta, 0.1);
    
            animationRunner.runningAnimations.forEach(function(animation, index){
                animation.timePassed += delta;
                animation.updatePosition();

                if(animation.timePassed > animation.duration){
                    animation.end()
                    return;
                }
            })
            
            if(!animationRunner.animationsAreFinished()){
                canvasContext.clearRect(0, 0, innerWidth, innerHeight);
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
