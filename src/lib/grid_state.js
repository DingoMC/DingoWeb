const DANG_R0 = 44
/**
 * @param {number} score
 * @param {{x: number, y: number, val: number}[]} tileArray 
 * @param {number} gridSize 
 */
function encodeGameState (score, tileArray, gridSize) {
    let new_vals = []
    new_vals.push(score)
    for (let i = 0; i < tileArray.length; i++) {
        new_vals.push(tileArray[i].val * (i + 1))
    }
    let s = ''
    for (let i = 0; i < new_vals.length; i++) {
        s += new_vals[i].toString()
        s += ','
    }
    let es = ''
    for (let i = 0; i < s.length; i++) {
        es += String.fromCharCode(s.charCodeAt(i) - DANG_R0 + gridSize);
    }
    return es
}
/**
 * 
 * @param {string} encodedState 
 * @param {number} gridSize 
 */
function decodeGameState (encodedState, gridSize) {
    let s = ''
    for (let i = 0; i < encodedState.length; i++) {
        s += String.fromCharCode(encodedState.charCodeAt(i) + DANG_R0 - gridSize)
    }
    let vals = s.split(',')
    let score = parseInt(vals[0])
    let tileArray = []
    for (let i = 1; i <= gridSize * gridSize; i++) {
        tileArray.push({x: Math.floor((i - 1) / 4), y: (i - 1) % 4, val: Math.floor(parseInt(vals[i]) / i)})
    }
    return {score: score, tileArray: tileArray}
}
/**
 * Save game state in local storage
 * @param {number} score
 * @param {{x: number, y: number, val: number}[]} tileArray 
 * @param {number} gridSize 
 */
export function saveGameState (score, tileArray, gridSize) {
    localStorage.setItem('grid' + gridSize.toString(), encodeGameState(score, tileArray, gridSize))
}
/**
 * Get game state from local storage
 * @param {number} gridSize 
 * @returns {{score: number, tileArray: {x: number, y: number, val: number}[]} | null}
 */
export function getGameState (gridSize) {
    if (localStorage.getItem('grid' + gridSize.toString()) === null) return null
    return decodeGameState(localStorage.getItem('grid' + gridSize.toString()), gridSize)
}
/**
 * Clears game state on restart
 * @param {number} gridSize 
 */
export function clearGameState (gridSize) {
    if (localStorage.getItem('grid' + gridSize.toString()) !== null) localStorage.removeItem('grid' + gridSize.toString())
}