import { convertRowToTimeStr, maxHourRow, minHourRow, background, tdTitle } from "../lib"
import styles from './styles.module.css'
import { useRef } from "react"

const Display = ({data}) => {

    const windowSize = useRef([window.innerWidth, window.innerHeight])

    const generateCols = (row) => {
        let elems = []
        if (row % 4 === 0) elems.push(
            <td className={`${styles.col} ${styles.hour}`}
                key={'h'}
                rowSpan={4}>
                    {convertRowToTimeStr(row, windowSize.current[0])}
                </td>
            )
        for (let col = 0; col < 7; col++) {
            elems.push(
                <td title={tdTitle(data, row, col)}
                className={`${styles.col} ${row % 4 === 3 ? styles.hour : ''}`}
                style={{background: background(data, row, col, windowSize.current[0]), opacity: 0.7}}
                key={col}></td>
            )
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
        <table className={styles.main}>
            <thead>
                {
                    windowSize.current[0] > 480 &&
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
                }
                {
                    windowSize.current[0] <= 480 &&
                    <tr>
                        <th>Time</th>
                        <th>Mo</th>
                        <th>Tu</th>
                        <th>Wd</th>
                        <th>Th</th>
                        <th>Fr</th>
                        <th>Sa</th>
                        <th>Su</th>
                    </tr>
                }
            </thead>
            <tbody>
                {generateRows()}
            </tbody>
        </table>
    )
}

export default Display