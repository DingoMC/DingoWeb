/**
 * 
 * @param {{day: number, start: number, end: number}[]} time 
 * @param {number} tzOffset 
 */
export default function offsetTime (time, tzOffset) {
    let newTime = [];
    for (let i = 0; i < time.length; i++) {
        let newStart = time[i].start + tzOffset;
        if (newStart < 0.0) newStart = 0.0;
        let newEnd = time[i].end + tzOffset;
        if (newEnd > 24.0) newEnd = 24.0;
        newTime.push({day: time[i].day, start: newStart, end: newEnd});
    }
    return newTime;
}   

/**
 * Find earliest hour to display
 * @param {{_id: string, code: string, color: string, time: {day: number, start: number, end: number}[]}[]} data 
 * @returns {number} Row Number
 */
export function minHourRow (data) {
    let minh = 23
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].time.length; j++) {
            if (Math.floor(data[i].time[j].start) < minh) minh = Math.floor(data[i].time[j].start);
        }
    }
    return minh * 4
}

/**
 * Find latest hour to display
 * @param {{_id: string, code: string, color: string, time: {day: number, start: number, end: number}[]}[]} data 
 * @returns {number} Row Number
 */
export function maxHourRow (data) {
    let maxh = 0
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].time.length; j++) {
            if (Math.ceil(data[i].time[j].end) > maxh) maxh = Math.ceil(data[i].time[j].end);
        }
    }
    return maxh * 4
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
 * 
 * @param {number} row 
 * @returns 
 */
export function convertRowToTimeStr (row) {
    return convertHourToString(row / 4.0) + " - " + convertHourToString((row / 4.0) + 1.0);
}

/**
 * 
 * @param {number} hour 
 * @returns 
 */
export function hourToRow (hour) {
    return Math.floor(hour * 4);
}

/**
 * 
 * @param {{_id: string, code: string, color: string, time: {day: number, start: number, end: number}[]}[]} data 
 * @param {number} row 
 * @param {number} col 
 */
export function getEventData (data, row, col) {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].time.length; j++) {
            if (data[i].time[j].day === col && hourToRow(data[i].time[j].start) === row) {
                return {code: data[i].code, color: data[i].color, start: data[i].time[j].start, end: data[i].time[j].end};
            }
        }
    }
    return null;
}

/**
 * 
 * @param {number} start 
 * @param {number} end 
 */
export function getEventHeight (start, end) {
    let duration = end - start;
    if (duration < 1.0) return Math.floor(duration * 28.0).toString() + 'px';
    return Math.floor(28.0 + (duration - 1.0) * 31.75).toString() + 'px';
}
