export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * 
 * @param {string[][]} grid 
 * @returns {string[][]}
 */
function initStateFrom (grid) {
    let a = new Array(6)
    for (let i = 0; i < 6; i++) {
        a[i] = new Array(7);
        for (let j = 0; j < 7; j++) {
            a[i][j] = grid[i][j]
        }
    }
    return a
}

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @returns 
 */
function checkCoords (x, y) {
    return (x >= 0 && x < 6 && y >= 0 && y < 7)
}

/**
 * 
 * @param {string[][]} grid 
 * @param {number} x 
 * @param {number} y 
 * @returns 
 */
function isEmpty (grid, x, y) {
    return (checkCoords(x, y) && grid[x][y] === 'empty')
}

/**
 * 
 * @param {string[][]} grid 
 * @param {number} x 
 * @param {number} y 
 * @returns 
 */
function isLocked (grid, x, y) {
    return (checkCoords(x, y) && grid[x][y] === 'locked')
}

/**
 * 
 * @param {string[][]} grid 
 * @param {number} x 
 * @param {number} y 
 * @param {string} type 
 * @returns 
 */
function isOccupiedBy (grid, x, y, type) {
    return (checkCoords(x, y) && grid[x][y] === type)
}

/**
 * 
 * @param {string[][]} grid 
 * @param {number} x 
 * @param {number} y 
 * @param {string} type 
 */
function checkWin (grid, type) {
    let cnt = 0
    // Check Rows
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            if (isOccupiedBy(grid, i, j, type)) cnt++
            else cnt = 0
            if (cnt >= 4) return true
        }
        cnt = 0
    }
    // Check columns
    for (let j = 0; j < 7; j++) {
        for (let i = 0; i < 6; i++) {
            if (isOccupiedBy(grid, i, j, type)) cnt++
            else cnt = 0
            if (cnt >= 4) return true
        }
        cnt = 0
    }
    // Check main diagonals
    for (let j = -2; j < 4; j++) {
        for (let i = 0; i < 6; i++) {
            if (isOccupiedBy(grid, i, j + i, type)) cnt++
            else cnt = 0
            if (cnt >= 4) return true
        }
        cnt = 0
    }
    // Check inverse diagonals
    for (let j = -2; j < 4; j++) {
        for (let i = 5; i >= 0; i--) {
            if (isOccupiedBy(grid, i, j - i + 5, type)) cnt++
            else cnt = 0
            if (cnt >= 4) return true
        }
        cnt = 0
    }
    return false
}

/**
 * If grid is Full
 * @param {string[][]} grid 
 */
function isFull (grid) {
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            if (isEmpty(grid, i, j) || isLocked(grid, i, j)) return false
        }
    }
    return true
}

/**
 * 
 * @param {string[][]} grid 
 * @returns -1 = not ended, 0 = draw, 1 = player 1 wins, 2 = player 2 wins
 */
export function gameState (grid) {
    if (checkWin(grid, 'p1')) return 1
    if (checkWin(grid, 'p2')) return 2
    if (isFull(grid)) return 0
    return -1
}

/**
 * Generate empty grid
 * @returns {string[][]}
 */
export function generateStartingState () {
    let grid = new Array(6)
    for (let i = 0; i < 6; i++) {
        grid[i] = new Array(7)
        for (let j = 0; j < 7; j++) {
            if (i === 5) grid[i][j] = 'empty'
            else grid[i][j] = 'locked'
        }
    }
    return grid
}

/**
 * 
 * @param {string[][]} grid 
 * @param {number} player_no 
 * @param {number} x 
 * @param {number} y 
 */
export function updateGridByMove (grid, player_no, x, y) {
    let ng = initStateFrom(grid)
    if (isEmpty(ng, x, y)) ng[x][y] = 'p' + player_no.toString()
    if (isLocked(ng, x - 1, y)) ng[x-1][y] = 'empty'
    return ng
}

function horizontalDangerWeight (grid, x, y, type) {
    let cnt = 0, max_cnt = 0
    for (let j = y - 3; j <= y + 3; j++) {
        if (isOccupiedBy(grid, x, j, type) || (isLocked(grid, x, j) && j !== y)) cnt = 0
        if (isOccupiedBy(grid, x, j, opponent(type))) cnt++
        if (cnt > max_cnt) max_cnt = cnt
    }
    if (max_cnt === 0) return 0.0
    if (max_cnt >= 3) return 127.0
    return Math.pow(2.0, (max_cnt - 1.0))
}

function verticalDangerWeight (grid, x, y, type) {
    let cnt = 0, max_cnt = 0
    for (let i = x - 3; i <= x + 3; i++) {
        if (isOccupiedBy(grid, i, y, type) || (isLocked(grid, i, y) && x !== i)) cnt = 0
        if (isOccupiedBy(grid, i, y, opponent(type))) cnt++
        if (cnt > max_cnt) max_cnt = cnt
    }
    if (max_cnt === 0) return 0.0
    if (max_cnt >= 3) return 127.0
    return Math.pow(2.0, (max_cnt - 1.0))
}

function diagonal1DangerWeight (grid, x, y, type) {
    let cnt = 0, max_cnt = 0
    for (let i = -3; i <= 3; i++) {
        if (isOccupiedBy(grid, x + i, y + i, type) || (isLocked(grid, x + i, y + i) && x !== x + i && y !== y + i)) cnt = 0
        if (isOccupiedBy(grid, x + i, y + i, opponent(type))) cnt++
        if (cnt > max_cnt) max_cnt = cnt
    }
    if (max_cnt === 0) return 0.0
    if (max_cnt >= 3) return 127.0
    return Math.pow(2.0, (max_cnt - 1.0))
}

function diagonal2DangerWeight (grid, x, y, type) {
    let cnt = 0, max_cnt = 0
    for (let i = -3; i <= 3; i++) {
        if (isOccupiedBy(grid, x + i, y - i, type) || (isLocked(grid, x + i, y - i) && x !== x + i && y !== y - i)) cnt = 0
        if (isOccupiedBy(grid, x + i, y - i, opponent(type))) cnt++
        if (cnt > max_cnt) max_cnt = cnt
    }
    if (max_cnt === 0) return 0.0
    if (max_cnt >= 3) return 127.0
    return Math.pow(2.0, (max_cnt - 1.0))
}

function averageDangerWeight (grid, x, y, type) {
    return (horizontalDangerWeight(grid, x, y, type) + verticalDangerWeight(grid, x, y, type) + diagonal1DangerWeight(grid, x, y, type) + diagonal2DangerWeight(grid, x, y, type)) * 0.25
}

function opponent (type) {
    if (type === 'p1') return 'p2'
    return 'p1'
}

/**
 * 
 * @param {string[][]} grid 
 * @param {number} level 
 * @returns {{x: number, y: number}}
 */
export function AIMoveSelector (grid, level) {
    let weight = new Array(6)
    // Initialize values
    for (let i = 0; i < 6; i++) {
        weight[i] = new Array(7)
        for (let j = 0; j < 7; j++) {
            if (isEmpty(grid, i, j)) weight[i][j] = 0.0
            else weight[i][j] = -Infinity
        }
    }
    // Level 1 (Easy) - Add weights depending on number of possible wins crossing the tile
    if (level === 1) {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                let pos_weight = 0
                if (i === 0 || i === 5) {
                    if (j === 0 || j === 6) pos_weight = 3;
                    else if (j === 1 || j === 5) pos_weight = 4;
                    else if (j === 2 || j === 4) pos_weight = 5;
                    else pos_weight = 7;
                }
                else if (i === 1 || i === 4) {
                    if (j === 0 || j === 6) pos_weight = 4;
                    else if (j === 1 || j === 5) pos_weight = 6;
                    else if (j === 2 || j === 4) pos_weight = 8;
                    else pos_weight = 10;
                }
                else {
                    if (j === 0 || j === 6) pos_weight = 5;
                    else if (j === 1 || j === 5) pos_weight = 8;
                    else if (j === 2 || j === 4) pos_weight = 11;
                    else pos_weight = 13;
                }
                weight[i][j] += pos_weight / 13.0
            }
        }
    }
    // Level 2 (Normal) - Add weights to fields by danger lines count
    if (level >= 2) {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                weight[i][j] += averageDangerWeight(grid, i, j, 'p2') * 1.0
            }
        }
    }
    // Level 3 (Hard) - Remove weight from fields based on danger of field above
    // and add winning weights
    if (level >= 3) {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                weight[i][j] -= averageDangerWeight(grid, i - 1, j, 'p2') * 0.95
                weight[i][j] += averageDangerWeight(grid, i, j, 'p1') * 0.3
            }
        }
    }
    // Select move with the highest weight
    let max_w = -Infinity
    let best_moves = []
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            if (weight[i][j] > max_w) {
                best_moves = [{x: i, y: j}]
                max_w = weight[i][j]
            }
            else if (weight[i][j] === max_w) best_moves.push({x: i, y: j})
        }
    }
    if (best_moves.length === 0) return {x: -1, y: -1}
    return best_moves[getRandomInt(0, best_moves.length - 1)]
}