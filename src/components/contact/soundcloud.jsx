import styles from './soundcloud.module.css';

export default function Soundcloud (props) {
    const {
        title,
        link,
        name
    } = props;
    return (
        <div className={styles.card}>
            <div className={styles.top}>
                <img src='/contact_icons/soundcloud.png' alt='SC'/>
                <div>{title}</div>
            </div>
            <div className={styles.bottom}><a href={link}>{name}</a></div>
        </div>
    )
}