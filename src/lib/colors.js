/**
 * 
 * @param {{r:number,g:number,b:number,v:number}[]} breakpoints Breakpoints sorted in ascending order
 * @param {number} value 
 */
export function breakpointColor (breakpoints, value) {
    let r = 0, g = 0, b = 0
    for (let i = 0; i < breakpoints.length - 1; i++) {
        if (value >= breakpoints[i].v && value <= breakpoints[i+1].v) {
            let ar = ((breakpoints[i].r - breakpoints[i+1].r) / (breakpoints[i].v - breakpoints[i+1].v))
            let ag = ((breakpoints[i].g - breakpoints[i+1].g) / (breakpoints[i].v - breakpoints[i+1].v))
            let ab = ((breakpoints[i].b - breakpoints[i+1].b) / (breakpoints[i].v - breakpoints[i+1].v))
            r = ar * value + breakpoints[i].r - breakpoints[i].v * ar
            g = ag * value + breakpoints[i].g - breakpoints[i].v * ag
            b = ab * value + breakpoints[i].b - breakpoints[i].v * ab
            return {r: r, g: g, b: b};
        }
    }
    return {r: r, g: g, b: b};
}

/**
 * 
 * @param {{r:number,g:number,b:number}} color 
 * @returns 
 */
export function colorToRGB (color) {
    return 'rgb(' + color.r.toFixed(0) + ',' + color.g.toFixed(0) + ',' + color.b.toFixed(0) + ')';
}