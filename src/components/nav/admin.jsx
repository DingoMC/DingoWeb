import styles from "./admin.module.css"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { cors_url } from "../../lib/cors_url"
import axios from "axios"
import { LuMenuSquare } from "react-icons/lu";

const NavBarAdmin = (props) => {
    const {
        activeTab = '',
        setActiveTab = () => {},
    } = props;
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
                {isAdmin && <a className={`${styles.nav_link} ${activeTab === 'apps' ? styles.active : ""}`} href="#apps" onClick={() => setActiveTab('apps')}>Apps</a>}
                {isAdmin && <a className={`${styles.nav_link} ${activeTab === 'cards' ? styles.active : ""}`} href="#cards" onClick={() => setActiveTab('cards')}>Cards</a>}
                {isAdmin && <a className={`${styles.nav_link} ${activeTab === 'events' ? styles.active : ""}`} href="#events" onClick={() => setActiveTab('events')}>Events</a>}
                {isAdmin && <a className={`${styles.nav_link} ${activeTab === 'users' ? styles.active : ""}`} href="#users" onClick={() => setActiveTab('users')}>Users</a>}
                <Link className={`${styles.nav_link} ${styles.red}`} to="/">Home</Link>
            </div>
        );
    }

    if (windowSize[0] <= 770) {
        return (
            <div className={styles.nav}>
                <div className={styles.navMenu}>
                    <div className={styles.nav_title}>DingoMC Admin</div>
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
            <div className={styles.nav_title}>DingoMC Admin</div>
            {generateNavLinks()}
        </div>
    )
}

export default NavBarAdmin