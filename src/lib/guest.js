/**
 * Check if user is a guest
 * @returns true | false
 */
export function isGuest () {
    return (localStorage.getItem("token") === null);
}