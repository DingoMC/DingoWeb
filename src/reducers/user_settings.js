const user_settings = (state = {}, action) => {
    let user_settings
    switch (action.type) {
        case "SET_USER_SETTINGS":
            user_settings = {darkMode: action.darkMode}
            return user_settings
        default:
            return state
    }
}

export default user_settings