const hostname = process.env.REACT_APP_HOSTNAME;
const localname = process.env.REACT_APP_LOCALNAME;
const port = process.env.REACT_APP_API_PORT;
/**
 * Returns CORS URL to server
 * @param {string} path 
 * @returns http://header/path
 */
export function cors_url (path) {
    return 'https://' + (window.location.hostname === hostname ? hostname : localname) + ':' + port +'/' + path
}
