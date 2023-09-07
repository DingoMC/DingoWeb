import { getRandomInt, randomElement } from "./random";

/**
 * Initialize minefield state
 * @param {[[{value: string, open: boolean, flagged: boolean}]]} minefield 
 * @param {{x: number, y: number}} gridSize 
 * @returns {[[{value: string, open: boolean, flagged: boolean}]]}
 */
function initStateFrom (minefield, gridSize) {
    let a = new Array(gridSize.x)
    for (let i = 0; i < a.length; i++) {
        a[i] = new Array(gridSize.y);
        for (let j = 0; j < gridSize.y; j++) {
            a[i][j] = minefield[i][j]
        }
    }
    return a
}

/**
 * Check if coords are ok
 * @param {{x: number, y: number}} gridSize 
 * @param {number} x 
 * @param {number} y 
 * @returns 
 */
function checkCoords (gridSize, x, y) {
    return (x >= 0 && y >= 0 && x < gridSize.x && y < gridSize.y)
}

/**
 * Check if field is open
 * @param {[[{value: string, open: boolean, flagged: boolean}]]} minefield 
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean}
 */
export function isOpen (minefield, x, y) {
    if (minefield[x] === undefined) return false
    return minefield[x][y] === undefined ? false : (minefield[x][y].open)
}

/**
 * Check if field is flagged
 * @param {[[{value: string, open: boolean, flagged: boolean}]]} minefield 
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean}
 */
export function isFlagged (minefield, x, y) {
    if (minefield[x] === undefined) return false
    return minefield[x][y] === undefined ? false : (minefield[x][y].flagged)
}

/**
 * Check if field is a bomb
 * @param {[[{value: string, open: boolean, flagged: boolean}]]} minefield 
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean}
 */
export function isBomb (minefield, x, y) {
    if (minefield[x] === undefined) return false
    return minefield[x][y] === undefined ? false : (minefield[x][y].value === 'B')
}

/**
 * Returns neighbor bomb count
 * @param {[[{value: string, open: boolean, flagged: boolean}]]} minefield 
 * @param {{x: number, y: number}} gridSize
 * @param {number} x 
 * @param {number} y 
 * @returns {string}
 */
function bombCount (minefield, gridSize, x, y) {
    if (isBomb(minefield, x, y)) return 'B'
    let v = 0
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (checkCoords(gridSize, i, j)) {
                if (isBomb(minefield, i, j)) v++
            }
        }
    }
    if (v === 0) return ''
    return v.toString()
}

export function valAt (minefield, x, y) {
    if (minefield[x] === undefined) return ''
    return (minefield[x][y] === undefined ? '' : minefield[x][y].value)
}

/**
 * 
 * @param {{x: number, y: number}} gridSize 
 * @param {number} bombs 
 * @returns {[[{value: string, open: boolean, flagged: boolean}]]}
 */
export function generateStartingState (gridSize, bombs) {
    // Create empty array
    let a = new Array(gridSize.x);
    for (let i = 0; i < a.length; i++) {
        a[i] = new Array(gridSize.y);
        for (let j = 0; j < a[i].length; j++) {
            a[i][j] = {value: '', open: false, flagged: false}
        }
    }
    // Insert bombs
    for (let i = 0; i < bombs; i++) {
        let x = 0
        let y = 0
        do {
            x = getRandomInt(0, gridSize.x - 1)
            y = getRandomInt(0, gridSize.y - 1)
        } while (isBomb(a, x, y))
        a[x][y].value = 'B'
    }
    // Insert field values
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a[i].length; j++) {
            if (!isBomb(a, i, j)) {
                a[i][j].value = bombCount(a, gridSize, i, j)
            }
        }
    }
    return a
}

/**
 * Check if a field can be recursively opened
 * @param {[[{value: string, open: boolean, flagged: boolean}]]} minefield 
 * @param {{x: number, y: number}} gridSize 
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean} 
 */
function isRecursable (minefield, gridSize, x, y) {
    return checkCoords(gridSize, x, y) && !isOpen(minefield, x, y) && !isFlagged(minefield, x, y) && !isBomb(minefield, x, y)
}

/**
 * 
 * @param {[[{value: string, open: boolean, flagged: boolean}]]} minefield 
 * @param {{x: number, y: number}} gridSize 
 * @param {number} x 
 * @param {number} y 
 * @param {boolean} fromRecursion 
 * @returns 
 */
export function openField (minefield, gridSize, x, y, fromRecursion = false) {
    if (minefield === undefined || minefield[x] === undefined) return minefield
    let a = initStateFrom(minefield, gridSize)
    a[x][y].open = true
    if (!fromRecursion && isBomb(a, x, y)) {
        return a
    }
    if (a[x][y].value === '') {
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (isRecursable(a, gridSize, i, j)) a = openField(a, gridSize, i, j, true)
            }
        }
    }
    return a
}

/**
 * Handle flagging / unflagging
 * @param {[[{value: string, open: boolean, flagged: boolean}]]} minefield 
 * @param {{x: number, y: number}} gridSize 
 * @param {number} x 
 * @param {number} y 
 * @returns {[[{value: string, open: boolean, flagged: boolean}]]}
 */
export function flagField (minefield, gridSize, x, y) {
    if (minefield === undefined || minefield[x] === undefined) return minefield
    let a = initStateFrom(minefield, gridSize)
    a[x][y].flagged = !a[x][y].flagged
    return a
}

/**
 * Check if player lost
 * @param {[[{value: string, open: boolean, flagged: boolean}]]} minefield 
 */
export function isGameOver (minefield) {
    for (let i = 0; i < minefield.length; i++) {
        for (let j = 0; j < minefield[i].length; j++) {
            if (minefield[i][j].value === 'B' && minefield[i][j].open) return true
        }
    }
    return false
}

/**
 * Check if player won
 * @param {[[{value: string, open: boolean, flagged: boolean}]]} minefield 
 * @param {number} bombCount 
 */
export function isGameWin (minefield, bombCount) {
    let cnt = 0;
    for (let i = 0; i < minefield.length; i++) {
        for (let j = 0; j < minefield[i].length; j++) {
            if (minefield[i][j].value === 'B') {
                if (!minefield[i][j].flagged) return false
                else cnt++
                if (cnt === bombCount) return true
            }
        }
    }
    return true
}

/**
 * 
 * @param {[[{value: string, open: boolean, flagged: boolean}]]} minefield 
 */
export function countFlags (minefield) {
    let cnt = 0
    for (let i = 0; i < minefield.length; i++) {
        for (let j = 0; j < minefield[i].length; j++) {
            if (minefield[i][j].flagged) cnt++
        }
    }
    return cnt
}

/**
 * Check if a field is open number field
 * @param {[[{value: string, open: boolean, flagged: boolean}]]} minefield 
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean}
 */
function isOpenNumber (minefield, x, y) {
    if (!isOpen(minefield, x, y) || isBomb(minefield, x, y) || isFlagged(minefield, x, y) || valAt(minefield, x, y) === '') return false
    return true
}

/**
 * Check if field is closed and not flagged
 * @param {[[{value: string, open: boolean, flagged: boolean}]]} minefield 
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean}
 */
function isClosed (minefield, x, y) {
    return (!isOpen(minefield, x, y) && !isFlagged(minefield, x, y))
}

/**
 * Count fields that are already opened or flagged
 * @param {[[{value: string, open: boolean, flagged: boolean}]]} minefield 
 * @returns 
 */
function countKnown (minefield) {
    let cnt = 0
    for (let i = 0; i < minefield.length; i++) {
        for (let j = 0; j < minefield[i].length; j++) {
            if (isOpen(minefield, i, j) || isFlagged(minefield, i, j)) cnt++
        }
    }
    return cnt
}

/**
 * Count default probability for unknown fields
 * @param {[[{value: string, open: boolean, flagged: boolean}]]} minefield 
 * @param {{x: number, y: number}} gridSize 
 * @param {number} bombs 
 */
function defaultProb (minefield, gridSize, bombs) {
    return 1.0 - ((bombs - countFlags(minefield) * 1.0) / (gridSize.x * gridSize.y - countKnown(minefield) * 1.0))
}

/**
 * Check if field is unkown
 * @param {[[{value: string, open: boolean, flagged: boolean}]]} minefield 
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean}
 */
function isUnknown (minefield, gridSize, x, y) {
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (checkCoords(gridSize, i, j) && isOpen(minefield, i, j)) return false
        }
    }
    return true
}

/**
 * 
 * @param {[[{value: string, open: boolean, flagged: boolean}]]} minefield 
 * @param {{x: number, y: number}} gridSize 
 * @param {number} bombs 
 */
export function AIMove (minefield, gridSize, bombs) {
    let probs = new Array(minefield.length)
    let d = defaultProb(minefield, gridSize, bombs)
    for (let i = 0; i < minefield.length; i++) {
        probs[i] = new Array(minefield[i].length)
        for (let j = 0; j < minefield[i].length; j++) {
            probs[i][j] = isUnknown(minefield, gridSize, i, j) ? d : 0.0
        }
    }
    for (let i = 0; i < minefield.length; i++) {
        for (let j = 0; j < minefield[i].length; j++) {
            if (isOpen(minefield, i, j) || isFlagged(minefield, i, j)) probs[i][j] = -255.0
            if (isOpenNumber(minefield, i, j)) {
                let num = parseInt(valAt(minefield, i, j))
                let open = 0, total = 0, flagged = 0
                let prob_to_add = 0.0
                for (let k = i - 1; k <= i + 1; k++) {
                    for (let l = j - 1; l <= j + 1; l++) {
                        if (checkCoords(gridSize, k, l) && !(k === i && l === j)) {
                            total++
                            if (isOpen(minefield, k, l)) open++
                            else if (isFlagged(minefield, k, l)) flagged++
                        }
                    }
                }
                if (total - open === num) prob_to_add = 255.0
                else prob_to_add = 1.0 - ((num - flagged) / (total - flagged - open))
                for (let k = i - 1; k <= i + 1; k++) {
                    for (let l = j - 1; l <= j + 1; l++) {
                        if (checkCoords(gridSize, k, l) && !(k === i && l === j) && isClosed(minefield, k, l)) {
                            if (probs[k][l] < 255.0 && prob_to_add < 255.0) {
                                if (probs[k][l] > 0.0 && probs[k][l] < 1.0 && prob_to_add < 1.0) probs[k][l] = (probs[k][l] + prob_to_add) / 2.0
                                else if (probs[k][l] === 1.0 || prob_to_add === 1.0) probs[k][l] = 1.0
                                else probs[k][l] = prob_to_add
                            }
                            else probs[k][l] = 255.0
                        }
                    }
                }
            }
        }
    }
    let maxes = [], max = 0.0
    for (let i = 0; i < probs.length; i++) {
        for (let j = 0; j < probs[i].length; j++) {
            if (probs[i][j] > max) {
                maxes = []
                max = probs[i][j]
                maxes.push({x: i, y: j, flag: (max >= 255 ? true : false)})
            }
            else if (probs[i][j] === max) maxes.push({x: i, y: j, flag: (max >= 255 ? true : false)})
        }
    }
    return randomElement(maxes)
}

/**
 * Calculate level difficulty
 * @param {{x: number, y: number}} gridSize 
 * @param {number} bombs 
 * @returns {number}
 */
export function calculateDifficulty (gridSize, bombs) {
    /*let a = 1.0 * gridSize.x * gridSize.y
    return (81.0 * bombs) / (10.0 * a)*/
    let a = 1.0 * gridSize.x * gridSize.y
    let d_a = 3e-05 * Math.pow(a, 2.0) + 0.0198 * a - 1.0668
    let d_b = -0.0002 * Math.pow(bombs, 2.0) + 0.32 * bombs + -2.2052
    return (d_a + d_b) / 2.0
}

/**
 * Return minimum level bomb count
 * @param {{x: number, y: number}} gridSize 
 * @returns {number}
 */
export function minBombCount (gridSize) {
    let f = gridSize.x * gridSize.y
    return Math.floor(0.000230487 * f * f + 0.0937545 * f + 0.893663)
}

/**
 * Return maximum level bomb count
 * @param {{x: number, y: number}} gridSize 
 * @returns {number}
 */
export function maxBombCount (gridSize) {
    return ((gridSize.x * gridSize.y) - Math.max(gridSize.x, gridSize.y))
}