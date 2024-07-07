const Move = {
    up: {x: 1, y: 0},
    right: {x: 0, y: -1},
    down: {x: -1, y: 0},
    left: {x: 0, y: 1}
}

/**
 * Get move directions
 * @param {0 | 1 | 2 | 3} moveID 0 - Up, 1 - Right, 2 - Down, 3 - Left
 * @returns 
 */
const moveSelector = (moveID) => {
    switch (moveID) {
        case 0: return Move.up;
        case 1: return Move.right;
        case 2: return Move.down;
        case 3: return Move.left;
        default: return Move.up;
    }
} 

/**
 * 
 * @param {number[]} sequence 
 */
const sequenceNonExistentMoves = (sequence) => {
    const m = [0, 1, 2, 3];
    return m.filter((n) => !sequence.includes(n));
}

/**
 * Get true tile value
 * @param {number} val 
 */
export const trueScore = (val) => {
    return (val > 0 ? Math.pow(2, val) : 0);
}

/**
 * Get random integer in <`min`, `max`>
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Get random tile value
 * @param {number} gridSize 
 * @returns 
 */
const randomTileValue = (gridSize) => {
    let probTable = [[100], [100],
        [93, 7], [91, 9], [90, 10],
        [85, 14, 1], [80, 18, 2], [75, 20, 5],
        [70, 27, 2, 1], [68, 26, 4, 2], [64, 22, 9, 5],
        [64, 23, 10, 2, 1], [62, 22, 10, 4, 2], [58, 19, 10, 8, 5],
        [58, 21, 16, 2, 2, 1], [55, 19, 15, 5, 4, 2], [50, 15, 12, 10, 8, 5]];
    let r = getRandomInt(1, 100);
    let v = 1
    for (let i = 1; i < probTable[gridSize].length; i++) {
        if (r <= probTable[gridSize][i]) v++;
        else break;
    }
    return v;
}

class Tile {
    /**
     * Tile Constructor
     * @param {number} x 
     * @param {number} y 
     * @param {number} value Will be normalized in log-2 scale (2->1, 4->2 ...) and 0->0
     */
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = (value > 0 ? Math.log2(value) : 0);
    }

    get isOccupied() { return (this.value > 0); }
    get isEmpty() { return !(this.isOccupied); }

    /**
     * @param {number} v
     */
    set setValue(v) {
        this.value = v;
    }
}

export class TileArray {
    /**
     * Create empty tile array
     * @param {number} gridSize 
     */
    constructor(gridSize) {
        let tiles = [];
        let prevTiles = [];
        for (let i = 0; i < gridSize * gridSize; i++) {
            tiles.push(new Tile(Math.floor(i / gridSize), i % gridSize, 0));
            prevTiles.push(new Tile(Math.floor(i / gridSize), i % gridSize, 0));
        }
        this.tiles = [...tiles];
        this.prevTiles = [...prevTiles];
        this.gridSize = gridSize;
        this.score = 0;
        this.scoreOnLastFuse = 0;
        this.highscore = 0;
        this.gameOver = false;
    }

    /**
     * 
     * @param {TileArray} tileArray 
     */
    copyFrom(tileArray) {
        this.gridSize = tileArray.gridSize;
        this.tiles = [...tileArray.tiles];
        this.prevTiles = [...tileArray.prevTiles];
        this.score = tileArray.score;
        this.highscore = tileArray.highscore;
        this.gameOver = tileArray.gameOver;
        this.scoreOnLastFuse = tileArray.scoreOnLastFuse;
    }

    /**
     * @param {number} score 
     */
    set newScore(score) {
        this.score = score;
    }

    /**
     * @param {number} score 
     */
    set newHighscore(score) {
        this.highscore = score;
    }

    /*
     *   TILE-SPECIFIC METHODS
     */

    /**
     * Get tileArray zero-based index
     * @param {number} x 
     * @param {number} y 
     * @returns 
     */
    idx(x, y) {
        return (this.gridSize * x) + y;
    }

    /**
     * Check if x, y values are correct
     * @param {number} x 
     * @param {number} y 
     * @returns 
     */
    indexCorrect(x, y) {
        return (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize);
    }

    /**
     * Get Tile by x, y
     * @param {number} x 
     * @param {number} y 
     * @returns `Tile` object or null
     */
    getTile(x, y) {
        for (const t of this.tiles) {
            if (t.x === x && t.y === y) return t;
        }
        return null;
    }

    /**
     * Check if field is occupied
     * @param {number} x 
     * @param {number} y 
     * @returns true if occupied, false if empty or not exist
     */
    isTileOccupied(x, y) {
        const t = this.getTile(x, y);
        return (t !== null ? t.isOccupied : false);
    }

    /**
     * Check if field is empty
     * @param {number} x 
     * @param {number} y 
     * @returns true if empty or not exist, false otherwise
     */
    isTileEmpty(x, y) {
        return !this.isTileOccupied(x, y);
    }

    /**
     * Get tile value at `x`, `y`
     * @param {number} x 
     * @param {number} y 
     * @returns 
     */
    getTileValue(x, y) {
        const i = this.idx(x, y);
        return this.tiles[i].value;
    }

    /**
     * Get tile value at `idx`
     * @param {number} idx 
     * @returns 
     */
    getTileValueByIdx(idx) {
        return this.tiles[idx].value;
    }

    /**
     * Set tile value at `x`, `y` to `val`
     * @param {number} x 
     * @param {number} y 
     * @param {number} val 
     */
    setTileValue(x, y, val) {
        const i = this.idx(x, y);
        this.tiles[i].setValue = val;
    }

    /*
     *   GRID STATE CHECK METHODS
     */

    isEmpty() {
        for (const t of this.tiles) {
            if (t.isOccupied) return false;
        }
        return true;
    }

    isFull() {
        for (const t of this.tiles) {
            if (t.isEmpty) return false;
        }
        return true;
    }

    getRandomFreeLocation() {
        if (this.isFull()) return null;
        let x = getRandomInt(0, this.gridSize - 1);
        let y = getRandomInt(0, this.gridSize - 1);
        while (this.isTileOccupied(x, y)) {
            x = getRandomInt(0, this.gridSize - 1);
            y = getRandomInt(0, this.gridSize - 1);
        }
        return {x: x, y: y};
    }

    /**
     * Check if specified move is possible
     * @param {{x: -1 | 0 | 1, y: -1 | 0 | 1}} move 
     */
    isMovePossible(move) {
        if (move.x !== 0 && move.y !== 0) return false;
        for (let x = (move.x <= 0 ? 0 : 1); x < (move.x >= 0 ? this.gridSize : this.gridSize - 1); x++) {
            for (let y = (move.y <= 0 ? 0 : 1); y < (move.y >= 0 ? this.gridSize : this.gridSize - 1); y++) {
                if (this.isTileOccupied(x, y)) {
                    if (this.isTileEmpty(x - move.x, y - move.y)) return true;
                    if (this.getTileValue(x, y) === this.getTileValue(x - move.x, y - move.y)) return true;
                }
            }
        }
        return false;
    }

    isFusionPossible() {
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                if (this.isTileOccupied(x, y)) {
                    if (x < this.gridSize - 1 && this.getTileValue(x, y) === this.getTileValue(x + 1, y)) return true;
                    if (y < this.gridSize - 1 && this.getTileValue(x, y) === this.getTileValue(x, y + 1)) return true;
                }
            }
        }
        return false
    }

    isGameOver() {
        return (this.isFull() && !this.isFusionPossible());
    }

    /*
     *  GRID MOVEMENT
     */

    /**
     * Move Up/Down
     * @param {-1 | 1} dir 
     */
    verticalMovement(dir) {
        for (let x = (dir === 1 ? 1 : (this.gridSize - 2)); x !== (dir === 1 ? this.gridSize : -1); x += dir) {
            for (let y = 0; y < this.gridSize; y++) {
                let i = 0;
                while ((x - (1 + i) * dir) !== (dir === 1 ? -1 : this.gridSize) && this.isTileOccupied(x - (i * dir), y) && this.isTileEmpty(x - (1 + i) * dir, y)) {
                    this.setTileValue(x - (1 + i) * dir, y, this.getTileValue(x - (i * dir), y));
                    this.setTileValue(x - (i * dir), y, 0);
                    i++;
                }
            }
        }
    }

    /**
     * Move Right/Left
     * @param {-1 | 1} dir 
     */
    horizontalMovement(dir) {
        for (let y = (dir === 1 ? 1 : (this.gridSize - 2)); y !== (dir === 1 ? this.gridSize : -1); y += dir) {
            for (let x = 0; x < this.gridSize; x++) {
                let i = 0;
                while ((y - (1 + i) * dir) !== (dir === 1 ? -1 : this.gridSize) && this.isTileOccupied(x, y - (i * dir)) && this.isTileEmpty(x, y - (1 + i) * dir)) {
                    this.setTileValue(x, y - (1 + i) * dir, this.getTileValue(x, y - (i * dir)));
                    this.setTileValue(x, y - (i * dir), 0);
                    i++;
                }
            }
        }
    }

    /**
     * Fuse Up/Down
     * @param {-1 | 1} dir 
     * @returns score on fusion
     */
    verticalFusion(dir) {
        let score = 0
        for (let x = (dir === 1 ? 0 : this.gridSize - 1); x !== (dir === 1 ? this.gridSize - 1 : 0); x += dir) {
            for (let y = 0; y < this.gridSize; y++) {
                if (this.isTileOccupied(x, y) && this.getTileValue(x, y) === this.getTileValue(x + dir, y)) {
                    this.setTileValue(x, y, this.getTileValue(x, y) + 1);
                    this.setTileValue(x + dir, y, 0);
                    score += trueScore(this.getTileValue(x, y));
                }
            }
        }
        return score;
    }

    /**
     * Fuse Left/Right
     * @param {-1 | 1} dir 
     * @returns score on fusion
     */
    horizontalFusion(dir) {
        let score = 0;
        for (let y = (dir === 1 ? 0 : this.gridSize - 1); y !== (dir === 1 ? this.gridSize - 1 : 0); y += dir) {
            for (let x = 0; x < this.gridSize; x++) {
                if (this.isTileOccupied(x, y) && this.getTileValue(x, y) === this.getTileValue(x, y + dir)) {
                    this.setTileValue(x, y, this.getTileValue(x, y) + 1);
                    this.setTileValue(x, y + dir, 0);
                    score += trueScore(this.getTileValue(x, y));
                }
            }
        }
        return score;
    }

    /**
     * 
     * @param {number} fusionScore 
     */
    scoreUpdate(fusionScore) {
        this.score += fusionScore;
        this.scoreOnLastFuse = fusionScore;
        if (this.score > this.highscore) this.highscore = this.score;
    }

    copyTilesToPrev() {
        let pTiles = [];
        for (const t of this.tiles) {
            pTiles.push(new Tile(t.x, t.y, trueScore(t.value)));
        }
        this.prevTiles = [...pTiles];
    }

    copyTilesFromPrev() {
        let pTiles = [];
        for (const t of this.prevTiles) {
            pTiles.push(new Tile(t.x, t.y, trueScore(t.value)));
        }
        this.tiles = [...pTiles];
    }

    moveUp() {
        this.copyTilesToPrev();
        this.verticalMovement(1);
        const f = this.verticalFusion(1);
        this.scoreUpdate(f);
        this.verticalMovement(1);
        this.generateRandomTile();
    }

    moveDown() {
        this.copyTilesToPrev();
        this.verticalMovement(-1);
        const f = this.verticalFusion(-1);
        this.scoreUpdate(f);
        this.verticalMovement(-1);
        this.generateRandomTile();
    }

    moveLeft() {
        this.copyTilesToPrev();
        this.horizontalMovement(1);
        const f = this.horizontalFusion(1);
        this.scoreUpdate(f);
        this.horizontalMovement(1);
        this.generateRandomTile();
    }

    moveRight() {
        this.copyTilesToPrev();
        this.horizontalMovement(-1);
        const f = this.horizontalFusion(-1);
        this.scoreUpdate(f);
        this.horizontalMovement(-1);
        this.generateRandomTile();
    }

    /**
     * Move main function
     * @param {0 | 1 | 2 | 3} moveID 
     * @returns score on fusion or null if not possible
     */
    move(moveID) {
        this.gameOver = this.isGameOver();
        const m = moveSelector(moveID);
        if (!this.isMovePossible(m)) return;
        if (moveID == 0) this.moveUp();
        if (moveID == 1) this.moveRight();
        if (moveID == 2) this.moveDown();
        if (moveID == 3) this.moveLeft();
        this.gameOver = this.isGameOver();
    }

    canUndo() {
        return (this.prevTiles.filter((t) => t.value > 0).length > 0);
    }

    undo() {
        if (this.canUndo()) {
            this.copyTilesFromPrev();
            for (let i = 0; i < this.prevTiles.length; i++) {
                this.prevTiles[i].setValue = 0;
            }
            this.score -= this.scoreOnLastFuse;
            this.scoreOnLastFuse = 0;
        }
    }

    /*
     *  GRID UPDATE METHODS
     */

    emptyGrid() {
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].setValue = 0;
            this.prevTiles[i].setValue = 0;
        }
    }

    /**
     * 
     * @param {number} newSize 
     */
    changeGridSize(newSize) {
        this.gridSize = newSize;
        let tiles = [], pTiles = [];
        for (let i = 0; i < newSize * newSize; i++) {
            tiles.push(new Tile(Math.floor(i / newSize), i % newSize, 0));
            pTiles.push(new Tile(Math.floor(i / newSize), i % newSize, 0));
        }
        this.tiles = [...tiles];
        this.prevTiles = [...pTiles];
    }

    generateRandomTile() {
        const t = this.getRandomFreeLocation();
        if (t === null) return;
        const v = randomTileValue(this.gridSize);
        this.setTileValue(t.x, t.y, v);
    }

    generateStartingState() {
        this.emptyGrid();
        this.generateRandomTile();
        this.generateRandomTile();
    }

    /*
     *  AI Move picker
     */

    /**
     * Get random possible move
     * @returns moveID or null
     */
    aiGetRandomMove() {
        if (this.gameOver) return null;
        let moveID = getRandomInt(0, 3);
        let move = moveSelector(moveID);
        while (!this.isMovePossible(move)) {
            moveID = getRandomInt(0, 3);
            move = moveSelector(moveID);
        }
        return moveID;
    }

    /**
     * Get first possible sequence move
     * @param {number[]} sequence 
     * @param {number} current 
     */
    aiGetSequenceMove(sequence, current) {
        let cursor = current;
        let loopCount = 0;
        let moveID = sequence[cursor];
        const neMoves = sequenceNonExistentMoves(sequence);
        while (!this.isMovePossible(moveSelector(moveID))) {
            cursor++;
            loopCount++;
            if (loopCount >= sequence.length) {
                if (neMoves.length > 0 && this.isMovePossible(moveSelector(neMoves[0]))) return {moveID: neMoves[0], current: current};
                return null;
            }
            if (cursor >= sequence.length) cursor = 0;
            moveID = sequence[cursor];
        }
        cursor++;
        if (cursor >= sequence.length) cursor = 0;
        return {moveID: moveID, current: cursor};
    }
    
}