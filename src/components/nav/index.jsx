import styles from "./styles.module.css"
import { Link } from "react-router-dom"
import { isGuest } from "../../lib/guest"
import { useState, useEffect } from "react"
import { cors_url } from "../../lib/cors_url"
import axios from "axios"

const NavBar = ({current}) => {
    const user = localStorage.getItem("token")
    const guest = (user === null)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const handleIsAdmin = async () => {
            try {
                const url = cors_url("api/usersettings/isadmin")
                const token = localStorage.getItem("token")
                const response = await axios.get(url, {params: {token: token}})
                if (response.data.is_admin) setIsAdmin(true)
                else setIsAdmin(false)
            }
            catch (error) {
                console.log(error)
            }
        }
        if (!guest) handleIsAdmin().catch(console.error)
        else setIsAdmin(false)
    }, [])

    return (
        <div className={styles.nav}>
            <div className={styles.nav_title}>DingoMC Website</div>
            <div className={styles.nav_links}>
                <Link className={`${styles.nav_link} ${current === "main" ? styles.active : ""}`} to="/">Home</Link>
                {isGuest() && <Link className={`${styles.nav_link} ${current === "login" ? styles.active : ""}`} to="/login">Login</Link>}
                {isGuest() && <Link className={`${styles.nav_link} ${current === "signup" ? styles.active : ""}`} to="/signup">Sign up</Link>}
                {!isGuest() && <Link className={`${styles.nav_link} ${current === "profile" ? styles.active : ""}`} to="/myprofile">Profile</Link>}
                <Link className={`${styles.nav_link} ${current === "contact" ? styles.active : ""}`} to="/contact">Contact</Link>
                {isAdmin && <Link className={`${styles.nav_link} ${current === "schedule" ? styles.active : ""}`} to="/schedule">Schedule</Link>}
                <Link className={`${styles.nav_link}`} target="_blank" to="https://github.com/DingoMC">GitHub</Link>
                {!isGuest() && <Link className={`${styles.nav_link} ${styles.red}`} to="/logout">Logout</Link>}
            </div>
        </div>
    )
}

export default NavBar