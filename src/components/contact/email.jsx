import styles from './email.module.css';

export default function Email (props) {
    const {
        title,
        email
    } = props;
    return (
        <div className={styles.card}>
            <div className={styles.top}>
                <img src='/contact_icons/gmail.webp' alt='Gmail'/>
                <div>{title}</div>
            </div>
            <div className={styles.bottom}>{email}</div>
        </div>
    )
}