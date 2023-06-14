import styles from "./styles.module.css"
import { Link } from "react-router-dom"

const NavBar2048 = ({current, settings}) => {
    return (
        <nav className={`${styles.navbar} ${settings.darkMode && styles.dark}`}>
            <h1>DingoMC's 2048</h1>
            <div className={styles.button_grid}>
                {current !== 'main' &&
                <Link to="/2048">
                    <button title="Home Page" type="button" className={`${styles.white_btn} ${settings.darkMode && styles.dark}`}><img alt="Home" src="/svg/home.svg" /></button>
                </Link>}
                {current !== 'myscores' &&
                <Link to="/2048/userscores">
                    <button title="Your Scores" type="button" className={`${styles.white_btn} ${settings.darkMode && styles.dark}`}><img alt="My Scores" src="/svg/points.svg" /></button>
                </Link>}
                {current !== 'leaderboard' &&
                <Link to="/2048/leaderboard">
                    <button title="Leaderboard" type="button" className={`${styles.white_btn} ${settings.darkMode && styles.dark}`}><img alt="Leaderboard" src="/svg/leaderboard.svg" /></button>
                </Link>}
                <Link to="/">
                    <button title="Go back to main website" className={`${styles.white_btn} ${settings.darkMode && styles.dark}`}><img alt="Back" src="/svg/logout.svg" /></button>
                </Link>
            </div>
        </nav>
    )
}

export default NavBar2048