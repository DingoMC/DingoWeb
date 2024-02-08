import styles from "./styles.module.css"
import { Link } from "react-router-dom"
import { isGuest } from "../../lib/guest"
import { useState, useEffect } from "react"
import { cors_url } from "../../lib/cors_url"
import axios from "axios"
import { LuMenuSquare } from "react-icons/lu";

const NavBar = ({current}) => {
    const user = localStorage.getItem("token")
    const guest = (user === null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [windowSize, setWindowSize] = useState([
        window.innerWidth,
        window.innerHeight,
    ]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
            if (window.innerWidth > 770) setIsMenuOpen(false);
        };
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

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

    const generateNavLinks = () => {
        return (
            <div className={styles.nav_links}>
                <Link className={`${styles.nav_link} ${current === "main" ? styles.active : ""}`} to="/">Home</Link>
                {isGuest() && <Link className={`${styles.nav_link} ${current === "login" ? styles.active : ""}`} to="/login">Login</Link>}
                {isGuest() && <Link className={`${styles.nav_link} ${current === "signup" ? styles.active : ""}`} to="/signup">Sign up</Link>}
                {!isGuest() && <Link className={`${styles.nav_link} ${current === "myprofile" ? styles.active : ""}`} to="/myprofile">Profile</Link>}
                <Link className={`${styles.nav_link} ${current === "contact" ? styles.active : ""}`} to="/contact">Contact</Link>
                {isAdmin && <Link className={`${styles.nav_link} ${current === "schedule" ? styles.active : ""}`} to="/schedule">Schedule</Link>}
                {isAdmin && <Link className={`${styles.nav_link} ${current === "apps" ? styles.active : ""}`} to="/apps">Apps</Link>}
                <Link className={`${styles.nav_link}`} target="_blank" to="https://github.com/DingoMC">GitHub</Link>
                {!isGuest() && <Link className={`${styles.nav_link} ${styles.red}`} to="/logout">Logout</Link>}
            </div>
        );
    }

    if (windowSize[0] <= 770) {
        return (
            <div className={styles.nav}>
                <div className={styles.navMenu}>
                    <div className={styles.nav_title}>DingoMC Website</div>
                    <LuMenuSquare
                        className={styles.menuIcon}
                        style={{color: (isMenuOpen ? 'white' : '#aaaaaa')}}
                        onClick={() => {
                            setIsMenuOpen(!isMenuOpen);
                        }}
                    />
                </div>
                {isMenuOpen && generateNavLinks()}
            </div>
        )
    }

    return (
        <div className={styles.nav}>
            <div className={styles.nav_title}>DingoMC Website</div>
            {generateNavLinks()}
        </div>
    )
}

export default NavBar