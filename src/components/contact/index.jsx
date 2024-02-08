import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import MainLayout from '../../layouts/main'

const Contact = () => {
    return (
        <MainLayout current="contact">
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
            <Link className={styles.link} to='/schedule'>DingoMC's schedule</Link>
        </MainLayout>
    )
}

export default Contact