/**
 * 
 * @param {string} version 
 */
export function splitVersion (version) {
    const sp = version.split(' ')
    if (sp.length === 0) return {type: '', version: ''}
    if (sp.length === 1) return {type: '', version: sp[0]}
    return {type: sp[0], version: sp[1]}
}