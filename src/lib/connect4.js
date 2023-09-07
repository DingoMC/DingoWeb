import { randomElement } from "./random";

/**
 * Initialize state from grid
 * @param {string[][]} grid Grid to initialize from
 * @returns {string[][]} Initialized grid
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
 * Check if coords are valid
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean}
 */
function checkCoords (x, y) {
    return (x >= 0 && x < 6 && y >= 0 && y < 7)
}

/**
 * Check if field is empty
 * @param {string[][]} grid
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean}
 */
function isEmpty (grid, x, y) {
    return (checkCoords(x, y) && grid[x][y] === 'empty')
}

/**
 * Check if field is locked
 * @param {string[][]} grid 
 * @param {number} x 
 * @param {number} y 
 * @returns {boolean}
 */
function isLocked (grid, x, y) {
    return (checkCoords(x, y) && grid[x][y] === 'locked')
}

/**
 * Check if field is occupied by type
 * @param {string[][]} grid 
 * @param {number} x 
 * @param {number} y 
 * @param {string} type Type of field to check for
 * @returns {boolean}
 */
function isOccupiedBy (grid, x, y, type) {
    return (checkCoords(x, y) && grid[x][y] === type)
}

/**
 * Check if specific player wins
 * @param {string[][]} grid 
 * @param {number} x 
 * @param {number} y 
 * @param {string} type Player type p1 | p2
 * @returns {boolean}
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
 * Check if grid is Full
 * @param {string[][]} grid 
 * @returns {boolean}
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
 * Get game state
 * @param {string[][]} grid 
 * @returns {-1|0|1|2} -1 = not ended, 0 = draw, 1 = player 1 wins, 2 = player 2 wins
 */
export function gameState (grid) {
    if (checkWin(grid, 'p1')) return 1
    if (checkWin(grid, 'p2')) return 2
    if (isFull(grid)) return 0
    return -1
}

/**
 * Generate empty grid
 * @returns {string[][]} empty grid
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
 * Update grid after move
 * @param {string[][]} grid 
 * @param {number} player_no Player number 
 * @param {number} x 
 * @param {number} y 
 * @returns {string[][]} New grid
 */
export function updateGridByMove (grid, player_no, x, y) {
    let ng = initStateFrom(grid)
    if (isEmpty(ng, x, y)) ng[x][y] = 'p' + player_no.toString()
    if (isLocked(ng, x - 1, y)) ng[x-1][y] = 'empty'
    return ng
}

/**
 * Get weight of horizontal danger at field
 * @param {string[][]} grid 
 * @param {number} x 
 * @param {number} y 
 * @param {string} type p1 | p2
 * @returns {number}
 */
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

/**
 * Get weight of vertical danger at field
 * @param {string[][]} grid 
 * @param {number} x 
 * @param {number} y 
 * @param {string} type p1 | p2
 * @returns {number}
 */
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

/**
 * Get weight of diagonal danger at field
 * @param {string[][]} grid 
 * @param {number} x 
 * @param {number} y 
 * @param {string} type p1 | p2
 * @returns {number}
 */
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

/**
 * Get weight of inverse diagonal danger at field
 * @param {string[][]} grid 
 * @param {number} x 
 * @param {number} y 
 * @param {string} type p1 | p2
 * @returns {number}
 */
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

/**
 * Get average danger weight at field
 * @param {string[][]} grid 
 * @param {number} x 
 * @param {number} y 
 * @param {string} type p1 | p2
 * @returns {number}
 */
function averageDangerWeight (grid, x, y, type) {
    return (horizontalDangerWeight(grid, x, y, type) + verticalDangerWeight(grid, x, y, type) + diagonal1DangerWeight(grid, x, y, type) + diagonal2DangerWeight(grid, x, y, type)) * 0.25
}

/**
 * Return opponent type
 * @param {string} type p1 | p2
 * @returns {string}
 */
function opponent (type) {
    return (type === 'p1' ? 'p2' : 'p1')
}

/**
 * Get AI Move
 * @param {string[][]} grid 
 * @param {number} level AI Level
 * @returns {{x: number, y: number}} Move coords
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
    return randomElement(best_moves)
}