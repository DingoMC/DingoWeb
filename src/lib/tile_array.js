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
