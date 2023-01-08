var computerPlayer = {
    currentTarget: [],
    possibleTargets: [
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [6, 4, 2]
    ],
    winCombinationIndexes: [
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        
        [0, 4, 8],
        [6, 4, 2]
    ],
    currentTargetProgressMarker: 0,
    potentialBaseIndexes: [],

    init: function(){
        var initialTarget = computerPlayer.getInitialTarget();
        computerPlayer.setCurrentTarget(initialTarget);
    },

    getInitialTarget: function(){
        computerPlayer.updatePotentialTargetCombinations();

        var initialTarget = [];
        var targetIndex = Math.floor(Math.random() * computerPlayer.possibleTargets.length);
        initialTarget = computerPlayer.possibleTargets[targetIndex];

        return initialTarget;
    },
    setCurrentTarget: function(target){
        computerPlayer.currentTarget = target;
        computerPlayer.currentTarget = shuffleArray(computerPlayer.currentTarget);
    },

    updatePotentialTargetCombinations: function(){
        var newTargets = []
        
        for(var i = 0; i < computerPlayer.possibleTargets.length; i++){
            var target = computerPlayer.possibleTargets[i]
            
            if(computerPlayer.combinationHasPotential(target)){
                newTargets.push(target)
            }
        }
        computerPlayer.possibleTargets = newTargets;
    },

    combinationHasPotential: function(combination){
        var opponentPiece = players.humanPlayer.piece;
        var combinationState = gameBoard.getStates(combination)
        var isPossible = combinationState.indexOf(opponentPiece) < 0;
        
        return isPossible;
    },

    takeTurn: function(){
        currentPlayer = players.computerPlayer;

        var turnIndex = computerPlayer.getTurnCoordinates();        
        computerPlayer.potentialBaseIndexes.push(turnIndex);

        gameBoard.setState(turnIndex, currentPlayer.piece);

        var animationCoords = convertIndexToBoardCoordinate(turnIndex);
        playCircleAnimationAtBoardCoordinates(animationCoords[0], animationCoords[1], function(){
            checkGameEndConditions(currentPlayer);
            if(game.hasEnded && !game.endFunctionHasBeenCalled)
                endGame();
            else
                players.humanPlayer.canInteract = true;
        });
    },

    getTurnCoordinates: function(){
        var turnCoordinates = -1;

        var passesBlockThreshold = computerPlayer.checkBlockThreshold();
        var aboutTooWin = computerPlayer.currentTargetProgressMarker === (computerPlayer.currentTarget.length - 1);

        if(passesBlockThreshold && !aboutTooWin){
            turnCoordinates = computerPlayer.getBlockCoordinates();
        };

        var noBlockCoordinatesHaveBeenFound = turnCoordinates === -1;
        if(noBlockCoordinatesHaveBeenFound){
            turnCoordinates = computerPlayer.getCoordinatesFromTarget();
        }
        
        var noCoordinatesFoundFromTarget = turnCoordinates === -1;
        if(noCoordinatesFoundFromTarget){
            turnCoordinates = computerPlayer.generateRandomBoardSpace();
        }
        
        return turnCoordinates;
    },
    
    checkBlockThreshold: function(){
        var blockScale = 100;
        var blockThreshold = 30;
        var passNumber = Math.floor(Math.random() * blockScale + 1);
        var check = passNumber > blockThreshold;
        return check;
        // return true;
    },

    getBlockCoordinates: function(){
        var blockIndex = -1;

        for(var i = 0; i < computerPlayer.winCombinationIndexes.length; i++){
            var combination = computerPlayer.winCombinationIndexes[i];
            var isAboutToWin = computerPlayer.playerIsAboutToWinAtCombination(combination);

            var blockIndexIsSet = blockIndex > -1;
            if(!blockIndexIsSet && isAboutToWin){
                var combinationIndex = gameBoard.getStates(combination).indexOf("")
                blockIndex = combination[combinationIndex]
            }

        }

        return blockIndex;
    },

    getEmptySpotFromWinCombination: function(combination){
        return gameBoard.getStates(combination).indexOf("")
    },

    playerIsAboutToWinAtCombination: function(winCombination){
        var sameCounter = 0;
        var isAboutToWin = false;
        var hasEmptySpot = gameBoard.getStates(winCombination).indexOf("") > -1;

        for(var i = 0; i < winCombination.length; i++){
            var state = gameBoard.getState(winCombination[i]);
            if(state === players.humanPlayer.piece)
                sameCounter++;
        }

        if(sameCounter == 2 && hasEmptySpot)
            isAboutToWin = true;
        
        return isAboutToWin;
    },

    generateRandomBoardSpace: function(){
        var randomIndex = Math.floor(Math.random() * 9)

        var isEmpty = gameBoard.getState(randomIndex) === "";
        if(!isEmpty){
            return computerPlayer.generateRandomBoardSpace();
        }
        else{
            return randomIndex;
        }
    },

    getCoordinatesFromTarget(){
        if(computerPlayer.combinationHasPotential(computerPlayer.currentTarget)){
            return computerPlayer.getCoordinatesFromCurrentTarget();
        }
                
        computerPlayer.updatePotentialTargetCombinations();

        var potentialTargetsAvailable = computerPlayer.possibleTargets.length > 0;
        if(potentialTargetsAvailable){
            return computerPlayer.getCoordinatesFromNewTarget();
        }

        return -1;
    },

    getCoordinatesFromCurrentTarget: function(){
        return computerPlayer.currentTarget.splice(0, 1)[0];
    },

    getCoordinatesFromNewTarget: function(){
        var newTarget = [];

        var baseIndexesAvailable = computerPlayer.potentialBaseIndexes.length > 0;
        
        if(baseIndexesAvailable){
            newTarget = computerPlayer.getNewTargetFromBaseIndexes();
        }
        
        var noBaseTargetFound = newTarget.length === 0;
        if(noBaseTargetFound){
            newTarget = computerPlayer.getNewTargetFromPotentialTargets();
        }

        var newTargetIsFound = newTarget.length > 0;
        if(newTargetIsFound){
            newTarget = computerPlayer.filterPlacedPiecesFromTarget(newTarget);

            computerPlayer.setCurrentTarget(newTarget);
    
            return computerPlayer.getCoordinatesFromCurrentTarget();
        }

        return -1;
       
    },
    getNewTargetFromBaseIndexes: function(){
        var baseIndexTarget = [];
        var potentialCombinations = computerPlayer.getPotentialCombinationsFromBaseIndexes();
        var combinationsFound = potentialCombinations.length > 0;

            if(combinationsFound){
                var noBaseTargetIsSet = baseIndexTarget.length === 0;
                
                if(noBaseTargetIsSet){
                    var selectedIndex = Math.floor(Math.random() * potentialCombinations.length);
                    baseIndexTarget =  potentialCombinations[selectedIndex];
                }
            }

        return baseIndexTarget;
    },
    
    getPotentialCombinationsFromBaseIndexes: function(){
        var combinations = []

        computerPlayer.possibleTargets.forEach(function(combination){
            var hasBaseIndex = false

            for(var i = 0; i < computerPlayer.potentialBaseIndexes.length; i++){
                var baseIndex = computerPlayer.potentialBaseIndexes[i]

                if(combination.indexOf(baseIndex) > -1)
                    hasBaseIndex = true
            }

            if(hasBaseIndex)
                combinations.push(combination)
        })

        return combinations;
    },

    getNewTargetFromPotentialTargets: function(){
        var potentialTargetIndex = Math.floor(
            Math.random() * computerPlayer.possibleTargets.length
        );

        var newTarget =  computerPlayer.possibleTargets[potentialTargetIndex];
        
        computerPlayer.possibleTargets.splice(potentialTargetIndex,1)

        return newTarget;
    },


    filterPlacedPiecesFromTarget: function(target){
        var filteredTarget = [];
        for(var i = 0; i < target.length; i++){
            var targetIndex = target[i];
            if(gameBoard.getStates(target)[i] === "")
                filteredTarget.push(targetIndex)
        }

        return filteredTarget;
    },

    resetVariablesToDefault: function(){
        computerPlayer.currentTarget = [];
        computerPlayer.possibleTargets = [
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 4, 8],
            [6, 4, 2]
        ],
        computerPlayer.winCombinationIndexes = [
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],

            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            
            [0, 4, 8],
            [6, 4, 2]
        ];
        computerPlayer.potentialBaseIndexes = [];
    }
};
computerPlayer.init();
