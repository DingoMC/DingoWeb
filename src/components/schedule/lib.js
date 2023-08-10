/**
 * Convert day number to string
 * @param {number} day_num 
 * @returns Day name
 */
export function convertDayToString (day_num, width) {
    if (width > 480) {
        if (day_num === 0) return 'Monday'
        if (day_num === 1) return 'Tuesday'
        if (day_num === 2) return 'Wednesday'
        if (day_num === 3) return 'Thursday'
        if (day_num === 4) return 'Friday'
        if (day_num === 5) return 'Saturday'
        return 'Sunday'
    }
    if (day_num === 0) return 'Mo'
    if (day_num === 1) return 'Tu'
    if (day_num === 2) return 'Wd'
    if (day_num === 3) return 'Th'
    if (day_num === 4) return 'Fr'
    if (day_num === 5) return 'Sa'
    return 'Su'
}

/**
 * Convert double hour value to string
 * @param {number} hour 
 * @returns Time
 */
export function convertHourToString (hour) {
    let fh = Math.floor(hour)
    let ph = (hour - fh * 1.0) * 60.0
    if (fh >= 24) fh -= 24;
    return (fh < 10 ? "0" : "") + (fh.toFixed(0)) + ":" + (ph < 10 ? "0" : "") + (ph.toFixed(0))
}

/**
 * Convert Time string to double
 * @param {string} time 
 * @returns {number} time value
 */
export function convertTimeToDouble (time) {
    let h = parseFloat(time.substring(0, 2))
    let m = parseFloat(time.substring(3, 5))
    return h + m / 60.0
}

export function convertRowToTimeStr (row, width) {
    if (width > 480) return convertHourToString(row / 4.0) + " - " + convertHourToString((row / 4.0) + 1.0)
    return convertHourToString(row / 4.0).substring(0, 2) + "-" + convertHourToString((row / 4.0) + 1.0).substring(0, 2)
}

/**
 * Find earliest hour to display
 * @param {{_id: string, code: string, day: number, start: number, end: number, color: string}[]} data 
 * @returns {number} Row Number
 */
export function minHourRow (data) {
    let minh = 23
    for (let i = 0; i < data.length; i++) {
        if (Math.floor(data[i].start) < minh) minh = Math.floor(data[i].start)
    }
    return minh * 4
}

/**
 * Find latest hour to display
 * @param {{_id: string, code: string, day: number, start: number, end: number, color: string}[]} data 
 * @returns {number} Row Number
 */
export function maxHourRow (data) {
    let maxh = 0
    for (let i = 0; i < data.length; i++) {
        if (Math.ceil(data[i].end) > maxh) maxh = Math.ceil(data[i].end)
    }
    return maxh * 4
}

/**
 * Generate background
 * @param {{_id: string, code: string, day: number, start: number, end: number, color: string}[]} data 
 * @param {number} row 
 * @param {number} col 
 * @param {number} width 
 * @returns {string} background property
 */
export function background (data, row, col, width) {
    let found = []
    let h = row / 4.0
    for (let i = 0; i < data.length; i++) {
        if (col === data[i].day && h >= data[i].start && h < data[i].end) {
            found.push(data[i].color)
        }
    }
    if (found.length === 0) return 'rgba(0, 0, 0, 0.5)'
    if (found.length === 1) return found[0]
    //return 'transparent'
    let b_str = 'repeating-linear-gradient(-45deg,'
    let w = (width > 480 ? (20.0 / found.length) : (15.0 / found.length))
    for (let i = 0; i < found.length; i++) {
        let begin = (i * w).toFixed(0) + 'px'
        let end = ((i + 1) * w).toFixed(0) + 'px'
        b_str += found[i] + ' ' + begin + ' ' + end
        if (i < found.length - 1) b_str += ','
    }
    b_str += ')'
    return b_str
}

/**
 * 
 * @param {{_id: string, code: string, day: number, start: number, end: number, color: string}[]} data 
 * @param {number} row 
 * @param {number} col 
 */
export function tdTitle (data, row, col) {
    let found = []
    let h = row / 4.0
    for (let i = 0; i < data.length; i++) {
        if (col === data[i].day && h >= data[i].start && h < data[i].end) {
            found.push(data[i].code)
        }
    }
    let title = convertDayToString(col) + ', ' + convertHourToString(row / 4.0) + ' - ' + convertHourToString((row + 1) / 4.0) + ': '
    if (found.length === 0) title += '(Nothing scheduled)'
    else {
        title += '(Scheduled: '
        for (let i = 0; i < found.length; i++) {
            title += found[i]
            if (i < found.length - 1) title += ', '
        }
        title += ')'
    }
    return title
}