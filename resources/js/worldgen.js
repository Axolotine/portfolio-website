const TILE = { //This is an enum that is not an enum. It is but it isn't <3
    TREE : 0,
    MOUNTAIN : 1,
    PLAINS : 2,
    SAND : 3,
    WATER : 4
}
// ♣▲,~≈

//returns an integer between 0 and N (non-inclusive)
function randInt(n) { return Math.floor(Math.random()*n); }

//returns a shuffled array
function shuffle(anArray){
    const l = anArray.length;
    let returnArray = anArray;
    let temp;

    for (let i = 0; i < l; i++){
        for (let j = 0; j < l; j++){
        const deeby = randInt(2);
        if (deeby){ 
            temp = returnArray[j];
            returnArray[j] = returnArray[i];
            returnArray[i] = temp;
        }
    }}

    return returnArray;
}

//returns an object containing information pertinent for generation of a map
function mapSquare(typeOf){
    let _glyph;
    let _col;
    switch (typeOf){
        case TILE.TREE :
            _glyph = "#";
            _col = "green";
        break;
        case TILE.MOUNTAIN :
            _glyph = "^";
            _col = "grey";
        break;
        case TILE.PLAINS :
            _glyph = ",";
            _col = "lime";
        break;
        case TILE.SAND :
            _glyph = "~";
            _col = "gold";
        break;
        case TILE.WATER :
            _glyph = "~";
            _col = "blue";
        break;
    }
    return {
        type : typeOf,
        glyph : _glyph,
        color : _col
    }
}

//returns an array of possibilities for adjacent tiles
function getPossibilities(typeOf){
    let _possibilities;
    switch (typeOf){
        case TILE.TREE :
            _possibilities = [
                possibility(TILE.TREE, 3),
                possibility(TILE.MOUNTAIN, 1),
                possibility(TILE.PLAINS, 1)
            ];
        break;
        case TILE.MOUNTAIN :
            _possibilities = [
                possibility(TILE.MOUNTAIN, 2),
                possibility(TILE.TREE, 1)
            ];
        break;
        case TILE.PLAINS :
            _possibilities = [
                possibility(TILE.PLAINS, 3),
                possibility(TILE.SAND, 1),
                possibility(TILE.TREE, 3)
            ];
        break;
        case TILE.SAND :
            _possibilities = [
                possibility(TILE.SAND, 4),
                possibility(TILE.PLAINS, 1),
                possibility(TILE.WATER, 1)
            ];
        break;
        case TILE.WATER :
            _possibilities = [
                possibility(TILE.WATER, 2),
                possibility(TILE.SAND, 1)
            ];
        break;
    }
    return _possibilities;
}

//returns an object used for storing information of the probability of a certain outcome
function possibility(typeOf, weight) {
    return {
        type : typeOf,
        weight : weight
    }
}

//returns a random type from the possibilities
function weightedRandom(possibilitiesArray){
    let cumulative = 0;
    let breakpoints = [];
    
    possibilitiesArray.forEach(obj => {
        cumulative += obj.weight;
        breakpoints.push(cumulative);
    });

    let result = randInt(cumulative + 1);

    for (let i = 0; i < breakpoints.length; i++){
        if (breakpoints[i] >= result) { result = i; break; }
    }

    return possibilitiesArray[result].type;
}

//returns a simple object that stores coordinates
function coords(x, y){
    return {
        x : x,
        y : y
    }
}

//returns coordinates of adjacent tiles in an array
//takes two coordinate objects
function adjTiles(myCoords, limit){
    const coordArray = [];

    if (myCoords.x > 0) { coordArray.push(coords(myCoords.x - 1, myCoords.y)); }
    if (myCoords.x < limit.x) { coordArray.push(coords(myCoords.x + 1, myCoords.y)); }
    if (myCoords.y > 0) { coordArray.push(coords(myCoords.x, myCoords.y - 1)); }
    if (myCoords.y < limit.y) { coordArray.push(coords(myCoords.x, myCoords.y + 1));}

    return coordArray;
}

//returns an array of map tiles
function generateWorld(xSize, ySize){
    const limit = coords(xSize - 1, ySize - 1);

    //initialize the world array
    let worldArray = new Array(xSize);
    for (let i = 0; i < xSize; i++){
        worldArray[i] = new Array(ySize);
    }

    let genQueue = [];

    //random starting point
    genQueue.push( coords( randInt(xSize), randInt(ySize) ) );
    //initial tile possibilities
    worldArray[genQueue[0].x][genQueue[0].y] = [possibility(TILE.PLAINS, 1), possibility(TILE.SAND, 1), possibility(TILE.TREE, 1)];


    while (genQueue.length > 0){
        let next = genQueue.shift();
        let typeOfNext = weightedRandom( worldArray[next.x][next.y] );
        worldArray[next.x][next.y] = mapSquare( typeOfNext );
        //find the neighbors
        let neighbors = shuffle(adjTiles(next, limit));
        //find the empty neighbors
        neighbors.forEach( n => {
            if (worldArray[n.x][n.y] === undefined) {
                worldArray[n.x][n.y] = getPossibilities( typeOfNext );
                genQueue.push(n);
             }
        });
        //algorithm is imperfect, maybe address biases later
    }

    return worldArray;   
}