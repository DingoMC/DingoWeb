import { convertHourToString, getEventHeight } from '../../lib/schedule';
import styles from './event.module.css'

export default function ScheduleEvent (props) {
    const { edata } = props;

    return (
        <div className={styles.wrapper}>
            <div className={styles.event} style={{
                backgroundColor: edata.color + '59',
                borderLeft: '3px solid ' + edata.color,
                fontSize: '0.9rem',
                height: getEventHeight(edata.start, edata.end),
                maxHeight: getEventHeight(edata.start, edata.end),
            }}>
                <span>{edata.code}</span>
                {(edata.end - edata.start) > 2.0 &&
                    <span>{convertHourToString(edata.start) + ' - ' + convertHourToString(edata.end)}</span>
                }
            </div>
        </div>
    );
}