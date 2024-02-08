/**
 * Format time to [hh:]mm:ss
 * @param {number} timeSec 
 * @returns 
 */
export function formatTime (timeSec) {
    let sec = timeSec;
    let hours = Math.floor(sec / 3600);
    sec %= 3600;
    let minutes = Math.floor(sec / 60);
    sec %= 60;
    let fstr = '';
    if (hours > 0) fstr += (hours < 10 ? '0' : '') + hours.toFixed(0) + ':';
    fstr += (minutes < 10 ? '0' : '') + minutes.toFixed(0) + ':';
    fstr += (sec < 10 ? '0' : '') + sec.toFixed(0);
    return fstr;
}