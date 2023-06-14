import styles from "./styles.module.css"
import { Link } from "react-router-dom"
import { isGuest } from "../../lib/guest"

const NavBar = ({current}) => {
    return (
        <div className={styles.nav}>
            <div className={styles.nav_title}>DingoMC Website</div>
            <div className={styles.nav_links}>
                <Link className={`${styles.nav_link} ${current === "main" ? styles.active : ""}`} to="/">Home</Link>
                {isGuest() && <Link className={`${styles.nav_link} ${current === "login" ? styles.active : ""}`} to="/login">Login</Link>}
                {isGuest() && <Link className={`${styles.nav_link} ${current === "signup" ? styles.active : ""}`} to="/signup">Sign up</Link>}
                {!isGuest() && <Link className={`${styles.nav_link} ${current === "profile" ? styles.active : ""}`} to="/myprofile">Profile</Link>}
                <Link className={`${styles.nav_link} ${current === "contact" ? styles.active : ""}`} to="/contact">Contact</Link>
                <Link className={`${styles.nav_link}`} target="_blank" to="https://github.com/DingoMC">GitHub</Link>
                {!isGuest() && <Link className={`${styles.nav_link} ${styles.red}`} to="/logout">Logout</Link>}
            </div>
        </div>
    )
}

export default NavBar