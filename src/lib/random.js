/**
 * Get random integer between min and max
 * @param {number} min Range minimum
 * @param {number} max Range maximum
 * @param {{includeMax: boolean, includeMin: boolean}} options If range ends should be included. Default to true
 * @returns Pseudorandom integer
 */
export function getRandomInt (min, max, { includeMax = true, includeMin = true } = {}) {
    let f_min = min > max ? max : min
    let f_max = max > min ? max : min
    f_min = Math.ceil(f_min) + (minIn ? 0 : 1)
    f_max = Math.floor(f_max) + (maxIn ? 0 : -1)
    if (f_min === f_max) return f_min
    return Math.floor(Math.random() * (f_max - f_min + 1) + f_min)
}

/**
 * Get random element from array
 * @param {Array<T>} array Array of elements 
 * @returns {T | null} Random element or null if there are no elements
 */
export function randomElement (array) {
    if (array.length === 0) return null
    if (array.length === 1) return array[0]
    return array[getRandomInt(0, array.length, {includeMax: false})]
}