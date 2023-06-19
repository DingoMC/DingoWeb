function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Return index of Tile Array
 * @param {number} gridSize 
 * @param {number} x 
 * @param {number} y 
 * @returns Index
 */
function idx (gridSize, x, y) {
    return (gridSize * x) + y
}

function indexCorrect (gridSize, x, y) {
    return (x >= 0 && x < gridSize && y >= 0 && y < gridSize)
}

/**
 * 
 * @param {number} gridSize 
 * @param {number} i 
 * @returns {{x: number, y: number}}
 */
function coords (gridSize, i) {
    return {x: Math.floor(i / gridSize), y: (i % gridSize)}
}

/**
 * Check if grid is full
 * @param {{x: number, y: number, val: number}[]} tileArray 
 * @returns true | false
 */
function isFull(tileArray) {
    for (let i = 0; i < tileArray.length; i++) {
        if (tileArray[i].val === 0) return false
    }
    return true
}

/**
 * Check if field at x, y is full
 * @param {{x: number, y: number, val: number}[]} tileArray 
 * @param {number} gridSize 
 * @param {number} x 
 * @param {number} y 
 * @returns true | false
 */
function isOccupied(tileArray, gridSize, x, y) {
    return (valAt(tileArray, gridSize, x, y) !== 0)
}

/**
 * @param {{x: number, y: number, val: number}[]} prevState 
 * @param {{x: number, y: number, val: number}[]} currState 
 */
export function hasChanged(prevState, currState) {
    for (let i = 0; i < currState.length; i++) {
        if (currState[i].val !== prevState[i].val) return true
    }
    return false
}

function initStateFrom (tileArray, gridSize) {
    let e = []
    for (let i = 0; i < gridSize * gridSize; i++) {
        e.push({x: Math.floor(i / gridSize), y: (i % gridSize), val: tileArray[idx(gridSize, Math.floor(i / gridSize), (i % gridSize))].val})
    }
    return e
}

/**
 * Initialize Empty tile list
 * @param {number} gridSize 
 * @returns Empty tile list
 */
export function emptyTileGrid(gridSize) {
    let e = []
    for (let i = 0; i < gridSize * gridSize; i++) {
        e.push({x: Math.floor(i / gridSize), y: (i % gridSize), val: 0})
    }
    return e
}

/**
 * Get tile value at position
 * @param {{x: number, y: number, val: number}[]} tileArray 
 * @param {number} gridSize
 * @param {number} x 
 * @param {number} y 
 * @returns Tile Value at x, y
 */
export function valAt (tileArray, gridSize, x, y) {
    return (tileArray[idx(gridSize, x, y)] === undefined ? 0 : tileArray[idx(gridSize, x, y)].val)
}


/**
 * Generate starting state of a game
 * @param {number} gridSize 
 * @returns Starting Tile Grid
 */
export function generateStartingState (gridSize) {
    let e = emptyTileGrid(gridSize)
    let x = 0
    let y = 0
    for (let i = 0; i < 2; i++) {
        do {
            x = getRandomInt(0, gridSize - 1)
            y = getRandomInt(0, gridSize - 1)
        } while (isOccupied(e, gridSize, x, y))
        let val = (getRandomInt(1, 100) % 10 === 0 ? 4 : 2)
        e[(x * gridSize) + y].val = val
    }
    return e
}

function verticalMovement (tileArray, gridSize, dir) {
    let e = initStateFrom(tileArray, gridSize)
    for (let x = (dir === 1 ? 1 : (gridSize - 2)); x !== (dir === 1 ? gridSize : -1); x += dir) {
        for (let y = 0; y < gridSize; y++) {
            let i = 0
            while ((x - (1 + i) * dir) !== (dir === 1 ? -1 : gridSize) && valAt(e, gridSize, x - (i * dir), y) > 0 && valAt(e, gridSize, (x - (1 + i) * dir), y) === 0) {
                e[idx(gridSize, (x - (1 + i) * dir), y)].val = valAt(e, gridSize, x - (i * dir), y)
                e[idx(gridSize, x - (i * dir), y)].val = 0
                i++
            }
        }
    }
    return e
}

function horizontalMovement (tileArray, gridSize, dir) {
    let e = initStateFrom(tileArray, gridSize)
    for (let y = (dir === 1 ? 1 : (gridSize - 2)); y !== (dir === 1 ? gridSize : -1); y += dir) {
        for (let x = 0; x < gridSize; x++) {
            let i = 0
            while ((y - (1 + i) * dir) !== (dir === 1 ? -1 : gridSize) && valAt(e, gridSize, x, y - (i * dir)) > 0 && valAt(e, gridSize, x, (y - (1 + i) * dir)) === 0) {
                e[idx(gridSize, x, (y - (1 + i) * dir))].val = valAt(e, gridSize, x, y - (i * dir))
                e[idx(gridSize, x, y - (i * dir))].val = 0
                i++
            }
        }
    }
    return e
}

function verticalFusion (tileArray, gridSize, dir) {
    let e = initStateFrom(tileArray, gridSize)
    let score = 0
    for (let x = (dir === 1 ? 0 : gridSize - 1); x !== (dir === 1 ? gridSize - 1 : 0); x += dir) {
        for (let y = 0; y < gridSize; y++) {
            if (valAt(e, gridSize, x, y) > 0 && valAt(e, gridSize, x, y) === valAt(e, gridSize, x + dir, y)) {
                e[idx(gridSize, x, y)].val *= 2
                e[idx(gridSize, x + dir, y)].val = 0
                score += e[idx(gridSize, x, y)].val
            }
        }
    }
    return {tileArray: e, score: score}
}

function horizontalFusion (tileArray, gridSize, dir) {
    let e = initStateFrom(tileArray, gridSize)
    let score = 0
    for (let y = (dir === 1 ? 0 : gridSize - 1); y !== (dir === 1 ? gridSize - 1 : 0); y += dir) {
        for (let x = 0; x < gridSize; x++) {
            if (valAt(e, gridSize, x, y) > 0 && valAt(e, gridSize, x, y) === valAt(e, gridSize, x, y + dir)) {
                e[idx(gridSize, x, y)].val *= 2
                score += e[idx(gridSize, x, y)].val
                e[idx(gridSize, x, y + dir)].val = 0
            }
        }
    }
    return {tileArray: e, score: score}
}

function generateNewTile (tileArray, gridSize) {
    let e = initStateFrom(tileArray, gridSize)
    let x = 0
    let y = 0
    do {
        x = getRandomInt(0, gridSize - 1)
        y = getRandomInt(0, gridSize - 1)
    } while (isOccupied(e, gridSize, x, y))
    let val = (getRandomInt(1, 100) % 10 === 0 ? 4 : 2)
    e[(x * gridSize) + y].val = val
    return e
}

/**
 * Execute Move Up
 * @param {{x: number, y: number, val: number}[]} tileArray 
 * @param {number} gridSize 
 * @returns tileArray | score
 */
export function moveUp (tileArray, gridSize) {
    let e = {tileArray: verticalMovement(tileArray, gridSize, 1), score: 0}
    e = verticalFusion(e.tileArray, gridSize, 1)
    e.tileArray = verticalMovement(e.tileArray, gridSize, 1)
    if (!isFull(e.tileArray) && hasChanged(tileArray, e.tileArray)) e.tileArray = generateNewTile(e.tileArray, gridSize)
    return e
}

/**
 * Execute Move Down
 * @param {{x: number, y: number, val: number}[]} tileArray 
 * @param {number} gridSize 
 * @returns tileArray | score
 */
export function moveDown (tileArray, gridSize) {
    let e = {tileArray: verticalMovement(tileArray, gridSize, -1), score: 0}
    e = verticalFusion(e.tileArray, gridSize, -1)
    e.tileArray = verticalMovement(e.tileArray, gridSize, -1)
    if (!isFull(e.tileArray) && hasChanged(tileArray, e.tileArray)) e.tileArray = generateNewTile(e.tileArray, gridSize)
    return e
}

/**
 * Execute Move Left
 * @param {{x: number, y: number, val: number}[]} tileArray 
* @param {number} gridSize 
* @returns tileArray | score
*/
export function moveLeft (tileArray, gridSize) {
    let e = {tileArray: horizontalMovement(tileArray, gridSize, 1), score: 0}
    e = horizontalFusion(e.tileArray, gridSize, 1)
    e.tileArray = horizontalMovement(e.tileArray, gridSize, 1)
    if (!isFull(e.tileArray) && hasChanged(tileArray, e.tileArray)) e.tileArray = generateNewTile(e.tileArray, gridSize)
    return e
}

/**
 * Execute Move Right
 * @param {{x: number, y: number, val: number}[]} tileArray 
 * @param {number} gridSize 
 * @returns tileArray | score
*/
export function moveRight (tileArray, gridSize) {
    let e = {tileArray: horizontalMovement(tileArray, gridSize, -1), score: 0}
    e = horizontalFusion(e.tileArray, gridSize, -1)
    e.tileArray = horizontalMovement(e.tileArray, gridSize, -1)
    if (!isFull(e.tileArray) && hasChanged(tileArray, e.tileArray)) e.tileArray = generateNewTile(e.tileArray, gridSize)
    return e
}

/**
 * Check if there is Fusion
 * @param {{x: number, y: number, val: number}[]} tileArray 
 * @param {number} gridSize 
 * @returns true | false 
 */
function isFusionPossible (tileArray, gridSize) {
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            if (x < gridSize - 1) {
                if (tileArray[idx(gridSize, x, y)].val === tileArray[idx(gridSize, x + 1, y)].val) return true
            }
            if (y < gridSize - 1) {
                if (tileArray[idx(gridSize, x, y)].val === tileArray[idx(gridSize, x, y + 1)].val) return true
            }
        }
    }
    return false
}

export function isGameOver (tileArray, gridSize) {
    return (isFull(tileArray) && !isFusionPossible(tileArray, gridSize))
}

/**
 * Check if move is possible
 * @param {{x: number, y: number, val: number}[]} tileArray 
 * @param {number} gridSize 
 * @param {1 | 0 | -1} dirX 
 * @param {1 | 0 | -1} dirY 
 * @returns boolean
 */
export function isMovePossible (tileArray, gridSize, dirX, dirY) {
    if (dirX !== 0 && dirY !== 0) {
        console.error('Invalid direction')
        return false
    }
    for (let i = (dirX <= 0 ? 0 : 1); i < (dirX >= 0 ? gridSize : gridSize - 1) ; i++) {
        for (let j = (dirY <= 0 ? 0 : 1); j < (dirY >= 0 ? gridSize : gridSize - 1); j++) {
            if (valAt(tileArray, gridSize, i, j) > 0) {
                if (!isOccupied(tileArray, gridSize, i - dirX, j - dirY)) return true
                if (valAt(tileArray, gridSize, i, j) === valAt(tileArray, gridSize, i - dirX, j - dirY)) return true
            }
        }
    }
    return false
}

/**
 * Get dirs from move ID
 * @param {number} moveID 
 * @returns {{dirX: number, dirY: number}} directions
 */
function moveIdToDirs (moveID) {
    switch (moveID) {
        case 0: return {dirX: 1, dirY: 0};
        case 1: return {dirX: 0, dirY: -1};
        case 2: return {dirX: -1, dirY: 0};
        case 3: return {dirX: 0, dirY: 1};
        default: { console.error("Unknown moveID"); break; }
    }
}

/**
 * Return random Move ID
 * @param {{x: number, y: number, val: number}[]} tileArray 
 * @param {number} gridSize 
 * @returns Move ID
 */
export function autoRandomMovePicker (tileArray, gridSize) {
    let moveID = getRandomInt(0, 3)
    let dirs = moveIdToDirs(moveID)
    let cnt = 1
    while (!isMovePossible(tileArray, gridSize, dirs.dirX, dirs.dirY)) {
        moveID = getRandomInt(0, 3)
        dirs = moveIdToDirs(moveID)
        if (cnt >= 4) return -1
        cnt++
    }
    return moveID
}

/**
 * Get cycle move ID
 * @param {{x: number, y: number, val: number}[]} tileArray 
 * @param {number} gridSize 
 * @param {number[]} sequencer 
 * @param {number} seqNo 
 * @returns {{moveID: number, seq: number}}
 */
export function autoCycleMoverPicker (tileArray, gridSize, sequencer, seqNo) {
    let cursor = seqNo
    let moveID = sequencer[cursor]
    let dirs = moveIdToDirs(moveID)
    let cnt = 1
    while (!isMovePossible(tileArray, gridSize, dirs.dirX, dirs.dirY)) {
        cursor++
        if (cursor >= sequencer.length) cursor = 0
        moveID = sequencer[cursor]
        dirs = moveIdToDirs(moveID)
        if (cnt >= 4) return {moveID: -1, seq: 0}
        cnt++
    }
    // Returning next cursor
    cursor++
    if (cursor >= sequencer.length) cursor = 0
    return {moveID: moveID, seq: cursor}
}

export function autoLURUMoverPicker (tileArray, gridSize, sequencer, seqNo) {
    let cursor = seqNo
    let moveID = sequencer[cursor]
    let dirs = moveIdToDirs(moveID)
    let cnt = 1
    while (!isMovePossible(tileArray, gridSize, dirs.dirX, dirs.dirY)) {
        cursor++
        if (cursor >= sequencer.length) cursor = 0
        moveID = sequencer[cursor]
        dirs = moveIdToDirs(moveID)
        if (cnt >= 4) {
            moveID = 2
            dirs = moveIdToDirs(moveID)
            if (isMovePossible(tileArray, gridSize, dirs.dirX, dirs.dirY)) break;
            else return {moveID: -1, seq: 0}
        }
        cnt++
    }
    // Returning next cursor
    cursor++
    if (cursor >= sequencer.length - 1) cursor = 0
    return {moveID: moveID, seq: cursor}
}

function isRowFull (tileArray, gridSize, row) {
    for(let y = 0; y < gridSize; y++) {
        if (!isOccupied(tileArray, gridSize, row, y)) return false
    }
    return true
}

/**
 * Get Field Position Value (AI1)
 * @param {{x: number, y: number, val: number}[]} tileArray 
 * @param {number} gridSize 
 * @param {number} x 
 * @param {number} y 
 * @returns {number} Field Value
 */
function AI1_FieldValue (gridSize, x, y) {
    let dist = Math.sqrt(Math.pow(x, 2.0) + Math.pow(y, 2.0))
    let b = gridSize * gridSize
    let a = (1.0 - b) / ((gridSize - 1.0) * Math.SQRT2)
    return a * dist + b
}

/**
 * Get Tile Logarithmic Value (AI1)
 * @param {{x: number, y: number, val: number}[]} tileArray 
 * @param {number} gridSize 
 * @param {number} x 
 * @param {number} y 
 * @returns {number} Tile Logarithmic Value
 */
function AI1_valAt (tileArray, gridSize, x, y) {
    if (tileArray[idx(gridSize, x, y)] === undefined || tileArray[idx(gridSize, x, y)].val < 2) return 0
    return tileArray[idx(gridSize, x, y)].val
}

function steps (val1, val2) {
    let iv1 = (val1 === 0 ? 0 : Math.log2(val1))
    let iv2 = (val2 === 0 ? 0 : Math.log2(val2))
    return iv1 - iv2
}

/**
 * 
 * @param {{x: number, y: number, val: number}[]} tileArray 
 * @param {number} gridSize 
 * @param {number} x 
 * @param {number} y 
 * @returns 
 */
function AI1_NeighborValue (tileArray, gridSize, x, y) {
    if (tileArray[idx(gridSize, x, y)].val === 0) return 1.0
    let m = 1.0
    let stepInterest = [[2.0, 1.8, 1.6],
                        [0.01, 0.0, -0.01],
                        [-0.01, -0.02, -0.01]]
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (indexCorrect(gridSize, i, j)) {
                let ix = i - (x - 1)
                let iy = j - (y - 1)
                let s = steps(tileArray[idx(gridSize, i, j)].val, tileArray[idx(gridSize, x, y)].val)
                m += (stepInterest[ix][iy] * s)
            }
        }
    }
    return m
}

/**
 * 
 * @param {{x: number, y: number, val: number}[]} tileArray 
 * @param {number} gridSize 
 */
function AI1_OptimalStateValue (tileArray, gridSize) {
    let v = []
    let ov = 0
    for (let i = 0; i < tileArray.length; i++) {
        if (tileArray[i].val > 0) v.push(tileArray[i].val)
    }
    v.sort((a, b) => {return b - a})
    for (let i = 0; i < v.length; i++) {
        let c = coords(gridSize, i)
        ov += v[i] * AI1_FieldValue(gridSize, c.x, c.y) * AI1_NeighborValue(tileArray, gridSize, c.x, c.y)
    }
    return ov
}

function AI1_StateValue (tileArray, gridSize) {
    let value = 0;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            value += (AI1_valAt(tileArray, gridSize, i, j) * AI1_FieldValue(gridSize, i, j)) * AI1_NeighborValue(tileArray, gridSize, i, j)
        }
    }
    return value - AI1_OptimalStateValue(tileArray, gridSize);
}

export function autoAI1MovePicker (tileArray, gridSize) {
    let futureStates = []
    for (let i = 0; i < 4; i++) {
        let dirs = moveIdToDirs(i)
        if (isMovePossible(tileArray, gridSize, dirs.dirX, dirs.dirY)) {
            let e = {}
            switch (i) {
                case 0: { e = moveUp(tileArray, gridSize); break; }
                case 1: { e = moveRight(tileArray, gridSize); break; }
                case 2: { e = moveDown(tileArray, gridSize); break; }
                case 3: { e = moveLeft(tileArray, gridSize); break; }
                default: break;
            }
            futureStates.push({a: e.tileArray, m: i, v: AI1_StateValue(e.tileArray, gridSize)})
        }
    }
    if (futureStates.length === 0) return -1
    futureStates.sort((a, b) => {
        return b.v - a.v
    })
    return futureStates[0].m
}