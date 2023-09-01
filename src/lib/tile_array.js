import { Tree } from "./tree";

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

function randomTileValue (gridSize) {
    let probTable = [[100], [100],
        [93, 7], [91, 9], [90, 10],
        [85, 14, 1], [80, 18, 2], [75, 20, 5],
        [70, 27, 2, 1], [68, 26, 4, 2], [64, 22, 9, 5],
        [64, 23, 10, 2, 1], [62, 22, 10, 4, 2], [58, 19, 10, 8, 5],
        [58, 21, 16, 2, 2, 1], [55, 19, 15, 5, 4, 2], [50, 15, 12, 10, 8, 5]]
    let r = getRandomInt(1, 100)
    let v = 2
    for (let i = 1; i < probTable[gridSize].length; i++) {
        if (r <= probTable[gridSize][i]) v *= 2
        else break;
    }
    return v
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
        let val = randomTileValue(gridSize)
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
    let val = randomTileValue(gridSize)
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

/**
 * Get Field Position Value (AI1)
 * @param {{x: number, y: number, val: number}[]} tileArray 
 * @param {number} gridSize 
 * @param {number} x 
 * @param {number} y 
 * @returns {number} Field Value
 */
function AI_FieldValue (tileArray, gridSize, x, y) {
    let dist = Math.sqrt(Math.pow(x, 2.0) + Math.pow(y, 2.0))
    let b = gridSize * gridSize
    let a = (1.0 - b) / ((gridSize - 1.0) * Math.SQRT2)
    let v = 0
    if (tileArray[idx(gridSize, x, y)] === undefined || tileArray[idx(gridSize, x, y)].val < 2) v = 0.0
    else v = Math.log2(tileArray[idx(gridSize, x, y)].val)
    return ((a * dist + 2 * b - v) / (2 * b))
}

function AI_TileCountValue (tileArray, gridSize) {
    let cnt = 0
    for (let i = 0; i < tileArray.length; i++) {
        if (tileArray[i].val > 0) cnt++
    }
    let b = 1.0
    let a = (-b) / (gridSize * gridSize)
    return a * cnt + b
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
function AI_NeighborValue (tileArray, gridSize, x, y) {
    if (tileArray[idx(gridSize, x, y)].val === 0) return 1.0
    let m = 1.0
    let stepInterest = [[1.0, 1.0, 0.75],
                        [0.25, 0.0, -0.25],
                        [-0.25, -0.5, -0.75]]
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
    let worst = 0.0, best = 0.0
    for (let i = 0; i < stepInterest.length; i++) {
        for (let j = 0; j < stepInterest[i].length; j++) {
            if (stepInterest[i][j] > 0) {
                worst += stepInterest[i][j] * (-gridSize) * gridSize
                best += stepInterest[i][j] * gridSize * gridSize
            }
            if (stepInterest[i][j] < 0) {
                worst += stepInterest[i][j] * gridSize * gridSize
                best += stepInterest[i][j] * (-gridSize) * gridSize
            }
        }
    }
    return (m - worst) / (best - worst)
}

function AI_TotalTileValue (tileArray, gridSize, x, y) {
    let weights = [0.276, 0.801, 0.474]
    let values = [AI_FieldValue(tileArray, gridSize, x, y),
                AI_TileCountValue(tileArray, gridSize),
                AI_NeighborValue(tileArray, gridSize, x, y)]
    let total = 0.0
    for (let i = 0; i < values.length; i++) {
        total += values[i] * weights[i]
    }
    return total
}

function AI_OptimalStateValue (tileArray, gridSize) {
    let v = []
    let ov = 0
    for (let i = 0; i < tileArray.length; i++) {
        if (tileArray[i].val > 0) v.push(tileArray[i].val)
    }
    v.sort((a, b) => {return b - a})
    for (let i = 0; i < v.length; i++) {
        let c = coords(gridSize, i)
        ov += AI_TotalTileValue(tileArray, gridSize, c.x, c.y)
    }
    return ov
}

function AI_StateValue (tileArray, gridSize) {
    let value = 0;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            value += AI_TotalTileValue(tileArray, gridSize, i, j)
        }
    }
    return value - AI_OptimalStateValue(tileArray, gridSize);
}

/**
 * 
 * @param {string} key 
 * @returns {string}
 */
function nextKey (key) {
    if (key === 'x') return 'x0'
    if (key.charCodeAt(key.length - 1) < 51) return key.slice(0, key.length - 1) + String.fromCharCode(key.charCodeAt(key.length - 1) + 1);
    let vArray = []
    let nextGen = ''
    for (let i = 1; i < key.length; i++) {
        vArray.push(parseInt(key[i]))
    }
    for (let i = vArray.length - 1; i >= 0; i--) {
        vArray[i]++
        if (vArray[i] > 3) {
            vArray[i] = 0
            if (i === 0) nextGen = '0'
        }
        else break;
    }
    let nk = 'x'
    for (let i = 0; i < vArray.length; i++) {
        nk += vArray[i].toString()
    }
    return nk + nextGen
}

function checkTransposition (trtable, tileArray) {
    for (let i = 0; i < trtable.length; i++) {
        if (!hasChanged(trtable[i], tileArray)) return false;
    }
    return true;
}

/**
 * 
 * @param {number} moves 
 * @param {{x: number, y: number, val: number}[]} tileArray 
 * @param {number} gridSize 
 */
export function autoAIMovePicker (moves, tileArray, gridSize) {
    let futureStates = new Tree('x', {currGrid: initStateFrom(tileArray, gridSize), value: 0})
    let parentCursor = 'x'
    let cursor = 'x0'
    let depth = 0, cnt = 0, maxcnt = 0
    let transposition = [initStateFrom(tileArray, gridSize)]
    for (let i = 0; i < moves; i++) maxcnt += Math.pow(4, i);
    while (depth <= moves && cnt < maxcnt) {
        let curr = futureStates.find(parentCursor).value.currGrid
        let currScore = futureStates.find(parentCursor).value.value
        for (let d = 0; d < 4; d++) {
            let dirs = moveIdToDirs(d)
            cursor = parentCursor + d.toString()
            if (isMovePossible(futureStates.find(parentCursor).value.currGrid, gridSize, dirs.dirX, dirs.dirY)) {
                let e = {}
                switch (d) {
                    case 0: { e = moveUp(curr, gridSize); break; }
                    case 1: { e = moveRight(curr, gridSize); break; }
                    case 2: { e = moveDown(curr, gridSize); break; }
                    case 3: { e = moveLeft(curr, gridSize); break; }
                    default: break;
                }
                if (checkTransposition(transposition, e.tileArray)) {
                    futureStates.insert(parentCursor, cursor, {currGrid: e.tileArray, value: currScore + AI_StateValue(e.tileArray, gridSize)})
                    transposition.push(e.tileArray)
                }
            }
            cnt++
        }
        let err_cnt = 0
        do {
            parentCursor = nextKey(parentCursor);
            err_cnt++
        } while (futureStates.find(parentCursor) === undefined && err_cnt < maxcnt);
        depth = parentCursor.length
    }
    let maxv = -Infinity;
    let maxkey = 'x';
    [...futureStates.preOrderTraversal()].map((x) => {
        if (x.value.value > maxv && x.key !== 'x') {
            maxkey = x.key
            maxv = x.value.value
        }
        return x
    })
    if (maxkey === 'x') return -1
    return parseInt(maxkey[1])
}

/**
 * 
 * @param {number[]} array 
 */
export function countAON (array) {
    if (array.length === 0) return 0.0
    let max = array[0]
    let min = array[0]
    let s = 0.0
    for (let i = 0; i < array.length; i++) {
        s += array[i]
        if (array[i] > max) max = array[i]
        if (array[i] < min) min = array[i]
    }
    if (array.length < 3) return s / array.length
    return (s - max - min) / (array.length - 2.0)
}