import Footer from '../footer'
import NavBar from '../nav'
import styles from './styles.module.css'

const Contact = () => {
    return (
        <div className={styles.main}>
            <NavBar current='contact' />
            <div className={styles.container}>
                <div className={styles.title}>Contact Info</div>
                <div className={styles.contact_grid}>
                    <img src='/contact_icons/gmail.webp' alt='Gmail' className={styles.icon}/>
                    <div className={styles.key}>E-mail</div>
                    <div className={styles.value}>trianglecomtriangle@gmail.com</div>
                    <img src='/contact_icons/gmail.webp' alt='Gmail' className={styles.icon}/>
                    <div className={styles.key}>E-mail (PL)</div>
                    <div className={styles.value}>martin701-2001@wp.pl</div>
                    <img src='/contact_icons/instagram.png' alt='Gmail' className={styles.icon}/>
                    <div className={styles.key}>Instagram</div>
                    <div className={styles.value}>martin.dingomc</div>
                    <img src='/contact_icons/discord.png' alt='Gmail' className={styles.icon}/>
                    <div className={styles.key}>Discord</div>
                    <div className={styles.value}>DingoMC#2776</div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Contact