import styles from './schedule.module.css';

export default function ScheduleCard (props) {
    const {
        title,
        link,
        name
    } = props;
    return (
        <div className={styles.card}>
            <div className={styles.top}>
                <img src='/svg/clock.svg' alt='SC'/>
                <div>{title}</div>
            </div>
            <div className={styles.bottom}><a href={link}>{name}</a></div>
        </div>
    )
}