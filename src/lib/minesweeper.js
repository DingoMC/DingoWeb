function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * 
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

export function flagField (minefield, gridSize, x, y) {
    if (minefield === undefined || minefield[x] === undefined) return minefield
    let a = initStateFrom(minefield, gridSize)
    a[x][y].flagged = !a[x][y].flagged
    return a
}

/**
 * 
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
 * 
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