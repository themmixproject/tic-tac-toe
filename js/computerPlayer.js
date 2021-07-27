var computerPlayer = {
    placedPieces: [],
    isFirstTurn: true,
    currentTarget: [],
    potentialTargets: [],
    checkedPotentialTargets: [],
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
    targetCombinationIndexes: [
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
        var targetIndex = Math.floor(Math.random() * computerPlayer.potentialTargets.length);
        initialTarget = computerPlayer.potentialTargets[targetIndex];

        return initialTarget;
    },
    setTargetCombination: function(target){
        computerPlayer.currentTarget = target;
        computerPlayer.checkedPotentialTargets.push(target);

        shuffleArray(computerPlayer.currentTarget);

        console.log("Current target: " + computerPlayer.currentTarget);
    },

    updatePotentialTargetCombinations: function(){
        computerPlayer.potentialTargets = [];

        computerPlayer.winCombinationIndexes.forEach(function(combination){
            if(computerPlayer.combinationHasPotential(combination)){
                computerPlayer.potentialTargets.push(combination);
            };
        });
        
        computerPlayer.filterPotentialTargets();
    },

    combinationHasPotential: function(combination){
        var hasPotential = true;

        for(i=0; i<combination.length; i++){
            var item = combination[i];

            coordinate = convertIndexToBoardCoordinate(item);
            
            var isPossible = gameBoard[ coordinate[0] ][ coordinate[1] ] !== players.humanPlayer.piece;
            if(!isPossible)
                hasPotential = false;
        };

        return hasPotential;
    },
    filterPotentialTargets: function(){
        computerPlayer.potentialTargets.forEach(function(potentialTarget){
            var hasBeenChecked = multiDimensionalArrayHasArray(computerPlayer.checkedPotentialTargets, potentialTarget);
            if(hasBeenChecked){
                var indexOfPotentialTarget = computerPlayer.potentialTargets.indexOf(potentialTarget);
                computerPlayer.potentialTargets.splice(indexOfPotentialTarget, 1);
            };
        });
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
            if(!game.hasEnded)
                players.humanPlayer.canInteract = true;
            else
                restartGame();
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

        var potentialTargetsAvailable = computerPlayer.potentialTargets.length > 0;
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
        var selectedPotentialTargetIndex = Math.floor(Math.random() * computerPlayer.potentialTargets.length);
        return computerPlayer.potentialTargets[selectedPotentialTargetIndex];
    },

    getPotentialCombinationsFromBaseIndex: function(baseIndex){
        var baseIndexCombinations = [];

        computerPlayer.potentialTargets.forEach(function(combination){
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
        computerPlayer.potentialTargets = [];
        computerPlayer.checkedPotentialTargets = [];
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
        computerPlayer.targetCombinationIndexes = [
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
