import { convertRowToTimeStr, getEventData, maxHourRow, minHourRow } from '../../lib/schedule';
import ScheduleEvent from './event';
import styles from './table.module.css';

export default function ScheduleTable (props) {
    const {
        data = [],
    } = props;

    const generateCols = (row) => {
        let elems = []
        if (row % 4 === 0) elems.push(
            <td className={`${styles.col} ${styles.hour}`}
                key={'h'}
                rowSpan={4}>
                    {convertRowToTimeStr(row)}
                </td>
            )
        for (let col = 0; col < 7; col++) {
            let edata = getEventData(data, row, col);
            if (edata !== null) {
                elems.push(<td className={`${styles.col} ${row % 4 === 3 ? styles.hourBorder : ''}`} key={col}>
                    <ScheduleEvent edata={edata} />
                </td>);
            }
            else {
                elems.push(
                    <td className={`${styles.col} ${row % 4 === 3 ? styles.hourBorder : ''}`}
                    key={col}></td>
                )
            }
        }
        return elems
    }

    const generateRows = () => {
        let elems = []
        for (let row = minHourRow(data); row < maxHourRow(data); row++) {
            elems.push(<tr key={row}>{generateCols(row)}</tr>)
        }
        return elems
    }

    return (
        <div className={styles.wrapper}>
            <table className={styles.main}>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                        <th>Saturday</th>
                        <th>Sunday</th>
                    </tr>
                </thead>
                <tbody>
                    {generateRows()}
                </tbody>
            </table>
        </div>
    );
}