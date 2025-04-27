const hostname = process.env.REACT_APP_HOSTNAME;
/**
 * Returns CORS URL to server
 * @param {string} path 
 * @returns http://header/path
 */
export function cors_url (path) {
    return 'https://' + hostname + '/' + path;
}
