import { useEffect } from "react"


const Logout = () => {
    useEffect(() => {
        const handleLogout = () => {
            localStorage.removeItem("token")
            window.location.reload()
        }
        handleLogout()
    }, [])
    return (
        <div>
            Logging out please wait...
        </div>
    )
}

export default Logout