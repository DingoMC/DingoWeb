import styles from "./styles.module.css"
import { Link } from "react-router-dom"

const NavBarC4 = ({current, settings}) => {
    return (
        <nav className={`${styles.navbar} ${settings.darkMode && styles.dark}`}>
            <h1>DingoMC's Connect 4</h1>
            <div className={styles.button_grid}>
                {current !== 'main' &&
                <Link to="/connect-4">
                    <button title="Home Page" type="button" className={`${styles.white_btn} ${settings.darkMode && styles.dark}`}><img alt="Home" src="/svg/home.svg" /></button>
                </Link>}
                <Link to="/">
                    <button title="Go back to main website" className={`${styles.white_btn} ${settings.darkMode && styles.dark}`}><img alt="Back" src="/svg/logout.svg" /></button>
                </Link>
            </div>
        </nav>
    )
}

export default NavBarC4