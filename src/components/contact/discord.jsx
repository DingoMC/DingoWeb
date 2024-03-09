import styles from './discord.module.css';

export default function Discord (props) {
    const {
        title,
        name,
    } = props;
    return (
        <div className={styles.card}>
            <div className={styles.top}>
                <img src='/contact_icons/discord.png' alt='DC'/>
                <div>{title}</div>
            </div>
            <div className={styles.bottom}>{name}</div>
        </div>
    )
}