/**
 * Returns CORS URL to server
 * @param {string} path 
 * @returns http://header/path
 */
export function cors_url (path) {
    return 'https://' + (window.location.hostname === 'dingomc.net' ? 'dingomc.net' : '192.168.1.200') + ':8001/' + path
}
