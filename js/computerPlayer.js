var computerPlayer = {
    placedPieces: [],
    isFirstTurn: true,
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
        computerPlayer.setTargetCombination(initialTarget);
    },

    getInitialTarget: function(){
        computerPlayer.updatePotentialTargetCombinations();
        
        var initialTarget = [];
        var targetIndex = Math.floor(Math.random() * computerPlayer.possibleTargets.length);
        initialTarget = computerPlayer.possibleTargets[targetIndex];

        return initialTarget;
    },
    setTargetCombination: function(target){
        computerPlayer.currentTarget = target;
        computerPlayer.currentTarget = shuffleArray(computerPlayer.currentTarget);
    },

    updatePotentialTargetCombinations: function(){
        var newTargets = []
        
        for(i = 0; i < computerPlayer.possibleTargets.length; i++){
            var target = computerPlayer.possibleTargets[i]
            
            if(computerPlayer.combinationHasPotential(target)){
                newTargets.push(target)
            }
        }
        computerPlayer.possibleTargets = newTargets;
    },

    combinationHasPotential: function(combination){
        var hasPotential = true;
        for(o = 0; o < combination.length; o++){
           var coordinate = convertIndexToBoardCoordinate(combination[o]);

            var isPossible = gameBoard[ coordinate[0] ][ coordinate[1] ] !== players.humanPlayer.piece;
            if(!isPossible)
                hasPotential = false;
            };
            
        return hasPotential;
    },

    takeTurn: function(){
        currentPlayer = players.computerPlayer;

        var turnCoordinates = computerPlayer.getTurnCoordinates();
        var turnIndex = convertBoardCoordinateToIndex(turnCoordinates[0], turnCoordinates[1]);
        
        computerPlayer.placedPieces.push(turnIndex);
        computerPlayer.potentialBaseIndexes.push(turnIndex);

        // // update game state
        gameBoard[ turnCoordinates[0] ][ turnCoordinates[1] ] = currentPlayer.piece;

        playCircleAnimationAtBoardCoordinates(turnCoordinates[0], turnCoordinates[1], function(){
            checkGameEndConditions(currentPlayer);
            if(game.hasEnded && !game.endFunctionHasBeenCalled)
                endGame();
            else
                players.humanPlayer.canInteract = true;
        });
    },

    getTurnCoordinates: function(){
        var turnCoordinates = [];

        var passesBlockThreshold = computerPlayer.checkBlockThreshold();
        var aboutTooWin = computerPlayer.currentTargetProgressMarker === (computerPlayer.currentTarget.length - 1);

        if(passesBlockThreshold && !aboutTooWin){
            turnCoordinates = computerPlayer.getBlockCoordinates();
        };

        var noBlockCoordinatesHaveBeenFound = turnCoordinates.length === 0;
        if(noBlockCoordinatesHaveBeenFound){
            turnCoordinates = computerPlayer.getCoordinatesFromTarget();
        }
        
        var noCoordinatesFoundFromTarget = turnCoordinates.length === 0;
        if(noCoordinatesFoundFromTarget){
            turnCoordinates = computerPlayer.generateRandomBoardSpace();
        }
        
        return turnCoordinates;
    },
    
    checkBlockThreshold: function(){
        var blockScale = 100;
        var blockThreshold = 40;
        var passNumber = Math.floor(Math.random() * blockScale + 1);
        return (passNumber > blockThreshold);
    },

    getBlockCoordinates: function(){
        var blockCoordinates = [];

        computerPlayer.winCombinationIndexes.forEach(function(winCombinationIndex){
            var winCombinationCoordinates = computerPlayer.getWinCombinationCoordinates(winCombinationIndex);
            var winCombinationCopy = winCombinationCoordinates.slice();

            for(i = 0; i < 3; i++){
                var isAboutToWin = computerPlayer.playerIsAboutToWinAtCombination(winCombinationCopy);
                var blockCoordinatesIsSet = (blockCoordinates.length > 0);

                if(!blockCoordinatesIsSet && isAboutToWin){
                    blockCoordinates = computerPlayer.getEmptySpotFromWinCombination(winCombinationCopy);
                }
            }
        });

        return blockCoordinates;
    },

    getEmptySpotFromWinCombination: function(combination){
        var emptySpot = [];

        combination.forEach(function(coordinate){
            var isEmpty = gameBoard[coordinate[0]][coordinate[1]] === "";
            if(isEmpty)
                emptySpot = coordinate;
        });

        return emptySpot;
    },

    playerIsAboutToWinAtCombination: function(winCombination){
        var sameCounter = 0;
        var isAboutToWin = false;
        
        winCombination.forEach(function(coordinate){
            if(gameBoard[coordinate[0]][coordinate[1]] === players.humanPlayer.piece)
                sameCounter ++;
        });

        if(sameCounter == 2)
            isAboutToWin = true;

        return isAboutToWin;
    },

    getWinCombinationCoordinates: function(winCombination){
        var winCoordinates = [];
        winCombination.forEach(function(index){
            var coordinates = convertIndexToBoardCoordinate(index);
            winCoordinates.push(coordinates);
        });

        return winCoordinates;
    },
    generateRandomBoardSpace: function(){
        var randomX = Math.floor( Math.random() * 3 );
        var randomY = Math.floor( Math.random() * 3 );

        var isEmpty = gameBoard[ randomX ][ randomY ] === "";
        if(!isEmpty){
            return computerPlayer.generateRandomBoardSpace();
        }
        else{
            return [randomX, randomY];
        }
    },

    getCoordinatesFromTarget(){
        if(computerPlayer.currentTargetIsPossible()){
            return computerPlayer.getCoordinatesFromCurrentTarget();
        }
                
        computerPlayer.updatePotentialTargetCombinations();

        var potentialTargetsAvailable = computerPlayer.possibleTargets.length > 0;
        if(potentialTargetsAvailable){
            return computerPlayer.getCoordinatesFromNewTarget();
        }

        return [];
    },

    currentTargetIsPossible: function(){
        var isPossible = true;
        computerPlayer.currentTarget.forEach(function(item){
            var coordinates = convertIndexToBoardCoordinate(item);
            var isBlocked = gameBoard[ coordinates[0] ][ coordinates[1] ] === players.humanPlayer.piece;

            if(isBlocked){
                isPossible = false;
            }
        });
        return isPossible;
    },

    getCoordinatesFromCurrentTarget: function(){
        var targetIndex = computerPlayer.currentTarget[computerPlayer.currentTargetProgressMarker];
        turnCoordinates =  convertIndexToBoardCoordinate(targetIndex);

        // WATCH OUT FOR THIS LINE OF CODE
        computerPlayer.updateTargetIndex();

        return turnCoordinates
    },

    getCoordinatesFromNewTarget: function(){
        computerPlayer.currentTargetProgressMarker = 0;

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

            computerPlayer.setTargetCombination(newTarget);
    
            return computerPlayer.getCoordinatesFromCurrentTarget();
        }

        return newTarget;
       
    },
    getNewTargetFromBaseIndexes: function(){
        var baseIndexTarget = [];

        computerPlayer.potentialBaseIndexes.forEach(function(baseIndex, index){
            var potentialCombinations = computerPlayer.getPotentialCombinationsFromBaseIndex(baseIndex);
            var combinationsFound = potentialCombinations.length > 0;

            if(combinationsFound){
                var noBaseTargetIsSet = baseIndexTarget.length === 0;
                
                if(combinationsFound && noBaseTargetIsSet){
                    var selectedIndex = Math.floor(Math.random() * potentialCombinations.length);
                    baseIndexTarget =  potentialCombinations[selectedIndex];
                }
            }
            else{
                computerPlayer.potentialBaseIndexes.slice(index, 1);
            }

        });

        return baseIndexTarget;
    },

    getNewTargetFromPotentialTargets: function(){
        var potentialTargetIndex = Math.floor(
            Math.random() * computerPlayer.possibleTargets.length
        );

        var newTarget =  computerPlayer.possibleTargets[potentialTargetIndex];
        
        computerPlayer.possibleTargets.splice(potentialTargetIndex,1)

        return newTarget;
    },

    getPotentialCombinationsFromBaseIndex: function(baseIndex){
        var baseIndexCombinations = [];

        computerPlayer.possibleTargets.forEach(function(combination){
            var hasBaseIndex = combination.indexOf(baseIndex) > -1;
            if(hasBaseIndex)
                baseIndexCombinations.push(combination);
        });

        return baseIndexCombinations;
    },

    filterPlacedPiecesFromTarget: function(target){
        var filteredTarget = [];
        target.forEach(function(boardIndex){
            if(computerPlayer.placedPieces.indexOf(boardIndex) < 0)
                filteredTarget.push(boardIndex)
        });
        return filteredTarget;
    },

    updateTargetIndex: function(){
        if(computerPlayer.currentTargetProgressMarker < computerPlayer.currentTarget.length-1)
        computerPlayer.currentTargetProgressMarker++;
        else
            computerPlayer.currentTargetProgressMarker = computerPlayer.currentTarget.length-1;
    },

    resetVariablesToDefault: function(){
        computerPlayer.placedPieces = [];
        computerPlayer.isFirstTurn = true;
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
        computerPlayer.currentTargetIndex = 0;
        computerPlayer.currentTargetProgressMarker = 0;
        computerPlayer.potentialBaseIndexes = [];
    }
};
computerPlayer.init();
