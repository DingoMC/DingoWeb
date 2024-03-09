import styles from './instagram.module.css';

export default function Instagram (props) {
    const {
        title,
        instalink,
        name
    } = props;
    return (
        <div className={styles.card}>
            <div className={styles.top}>
                <img src='/contact_icons/instagram.png' alt='Insta'/>
                <div>{title}</div>
            </div>
            <div className={styles.bottom}><a href={instalink}>{name}</a></div>
        </div>
    )
}