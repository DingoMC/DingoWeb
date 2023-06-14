import styles from './styles.module.css'

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.bottom_redux}></div>
            <footer>
                <span>dingomc.net 2.0-beta</span>
                <span>© DingoMC Systems 2023</span>
            </footer>
        </div>
    )
}

export default Footer