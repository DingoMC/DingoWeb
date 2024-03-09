/**
 * 
 * @param {string} version 
 * @returns 
 */
export function splitVersion (version) {
    const sp = version.split(' ')
    if (sp.length === 0) return {type: '', version: ''}
    if (sp.length === 1) return {type: '', version: sp[0]}
    return {type: sp[0], version: sp[1]}
}

/**
 * 
 * @param {string} bid 
 * @returns 
 */
export function createBugId (bid) {
    return 'bug-' + bid.toLowerCase();
}

/**
 * 
 * @param {string} bid 
 * @returns 
 */
export function getBugNameFromId (bid) {
    if (bid.startsWith('bug-')) return 'Bug #' + bid.slice(4).toUpperCase();
    if (bid.startsWith('#bug-')) return 'Bug #' + bid.slice(5).toUpperCase();
    return 'Bug #' + bid.toUpperCase();
}

/**
 * 
 * @param {string} content 
 * @returns
 */
export function getBugFromChangelog (content) {
    let words = content.split(' ');
    let id = '';
    for (let i = 0; i < words.length; i++) {
        if (words[i].startsWith('#')) id = words[i].slice(1);
    }
    if (id.length === 0) return null;
    return id;
}