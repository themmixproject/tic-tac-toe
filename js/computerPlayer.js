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
    possibleBaseIndexes: [],

    init: function(){
        var initialTarget = computerPlayer.getInitialTarget();
        computerPlayer.setCurrentTarget(initialTarget);
    },

    getInitialTarget: function(){
        computerPlayer.updatePossibleTargets();

        var initialTarget = [];
        var targetIndex = Math.floor(Math.random() * computerPlayer.possibleTargets.length);
        initialTarget = computerPlayer.possibleTargets[targetIndex];

        return initialTarget;
    },
    setCurrentTarget: function(target){
        computerPlayer.currentTarget = target;
        computerPlayer.currentTarget = shuffleArray(computerPlayer.currentTarget);
    },

    updatePossibleTargets: function(){
        var newTargets = []
        
        for(var i = 0; i < computerPlayer.possibleTargets.length; i++){
            var target = computerPlayer.possibleTargets[i]
            
            if(computerPlayer.combinationIsPossible(target)){
                newTargets.push(target)
            }
        }
        computerPlayer.possibleTargets = newTargets;
    },

    combinationIsPossible: function(combination){
        var opponentPiece = players.humanPlayer.piece;
        var combinationState = gameBoard.getStates(combination)
        var isPossible = combinationState.indexOf(opponentPiece) < 0;
        
        return isPossible;
    },

    takeTurn: function(){
        currentPlayer = players.computerPlayer;

        var turnIndex = computerPlayer.getTurnIndex();        
        computerPlayer.possibleBaseIndexes.push(turnIndex);

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

    getTurnIndex: function(){
        var turnIndex = -1;

        var passesBlockThreshold = computerPlayer.checkBlockThreshold();
        var aboutTooWin = computerPlayer.currentTargetProgressMarker === (computerPlayer.currentTarget.length - 1);
        if(passesBlockThreshold && !aboutTooWin){
            turnIndex = computerPlayer.getBlockIndex();
        };
        if(computerPlayer.noIndexFound(turnIndex)){
            turnIndex = computerPlayer.getCoordinatesFromTarget();
        }
        if(computerPlayer.noIndexFound(turnIndex)){
            turnIndex = computerPlayer.generateRandomBoardSpace();
        }
        
        return turnIndex;
    },
    noIndexFound: function(index){
        return index === -1;
    },
    
    checkBlockThreshold: function(){
        var blockScale = 100;
        var blockThreshold = 30;
        var passNumber = Math.floor(Math.random() * blockScale + 1);
        var check = passNumber > blockThreshold;
        return check;
    },

    getBlockIndex: function(){
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
        if(computerPlayer.combinationIsPossible(computerPlayer.currentTarget)){
            return computerPlayer.getIndexFromCurrentTarget();
        }
                
        computerPlayer.updatePossibleTargets();
        var targetsAvailable = computerPlayer.possibleTargets.length > 0;
        if(targetsAvailable){
            return computerPlayer.getIndexFromNewTarget();
        }

        return -1;
    },
    getIndexFromCurrentTarget: function(){
        return computerPlayer.currentTarget.splice(0, 1)[0];
    },
    getIndexFromNewTarget: function(){
        var newTarget = [];

        var baseIndexesAvailable = computerPlayer.possibleBaseIndexes.length > 0;
        
        if(baseIndexesAvailable){
            newTarget = computerPlayer.getNewTargetFromBaseIndexes();
        }
        if(!computerPlayer.newTargetIsFound(newTarget)){
            newTarget = computerPlayer.getNewTargetFromPossibleTargets();
        }
        if(computerPlayer.newTargetIsFound(newTarget)){
            newTarget = computerPlayer.filterPlacedPiecesFromTarget(newTarget);
            computerPlayer.setCurrentTarget(newTarget);
    
            return computerPlayer.getIndexFromCurrentTarget();
        }

        return -1;
       
    },
    newTargetIsFound(newTarget){
        return newTarget.length > 0;
    },
    getNewTargetFromBaseIndexes: function(){
        var baseIndexTarget = [];
        var possibleCombinations = computerPlayer.getPossibleTargetsFromBaseIndexes();
        var combinationsFound = possibleCombinations.length > 0;

            if(combinationsFound){
                var noBaseTargetIsSet = baseIndexTarget.length === 0;
                
                if(noBaseTargetIsSet){
                    var selectedIndex = Math.floor(Math.random() * possibleCombinations.length);
                    baseIndexTarget =  possibleCombinations[selectedIndex];
                }
            }

        return baseIndexTarget;
    },
    
    getPossibleTargetsFromBaseIndexes: function(){
        var combinations = []

        for(var i = 0; i < computerPlayer.possibleTargets.length; i++){
            var combination = computerPlayer.possibleTargets.length;
            if(computerPlayer.combinationHasBaseIndex(combination))
                combinations.push(combination)
        }
        
        return combinations;
    },
    combinationHasBaseIndex: function(combination){
        var hasBaseIndex = false;

        for (var i = 0; i < combination.length; i++) {
            var baseIndex = computerPlayer.possibleBaseIndexes[i];
            
            if(combination.indexOf(baseIndex) > -1)
                hasBaseIndex = true;
        }

        return hasBaseIndex;
    },

    getNewTargetFromPossibleTargets: function(){
        var targetIndex = Math.floor(
            Math.random() * computerPlayer.possibleTargets.length
        );
        var newTarget =  computerPlayer.possibleTargets[targetIndex];
        
        computerPlayer.possibleTargets.splice(targetIndex,1)

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
        computerPlayer.possibleBaseIndexes = [];
    }
};
computerPlayer.init();
