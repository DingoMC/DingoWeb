import { useState, useRef } from 'react'
import styles from './styles.module.css'
import { cors_url } from '../../../lib/cors_url'
import axios from 'axios'
import { convertHourToString, convertTimeToDouble } from '../lib'

const Add = ({setAddMode}) => {
    const windowSize = useRef([window.innerWidth, window.innerHeight])
    const handleAddNew = async () => {
        try {
            const url = cors_url("api/schedule")
            await axios.post(url, data)
            window.location.reload()
        }
        catch (error) {
            console.log(error)
        }
    }

    const [data, setData] = useState({code: '', day: 0, start: 0.00, end: 1.00, color: '#000000'})
    return (
        <tr className={styles.row}>
            <td><input type="text" value={data.code} onChange={(e) => {
                setData({...data, code: e.target.value})
            }} /></td>
            <td>
                { windowSize.current[0] > 480 &&
                    <select name="day" id="day" value={data.day} onChange={(e) => {
                        setData({...data, day: parseInt(e.target.value)})
                    }}>
                        <option value="0">Monday</option>
                        <option value="1">Tuesday</option>
                        <option value="2">Wednesday</option>
                        <option value="3">Thursday</option>
                        <option value="4">Friday</option>
                        <option value="5">Saturday</option>
                        <option value="6">Sunday</option>
                    </select>
                }
                { windowSize.current[0] <= 480 &&
                    <select name="day" id="day" value={data.day} onChange={(e) => {
                        setData({...data, day: parseInt(e.target.value)})
                    }}>
                        <option value="0">Mo</option>
                        <option value="1">Tu</option>
                        <option value="2">Wd</option>
                        <option value="3">Th</option>
                        <option value="4">Fr</option>
                        <option value="5">Sa</option>
                        <option value="6">Su</option>
                    </select>
                }
            </td>
            <td>
                <input type="time" value={convertHourToString(data.start)} onChange={(e) => {
                    setData({...data, start: convertTimeToDouble(e.target.value)})
                }} />
            </td>
            <td>
                <input type="time" value={convertHourToString(data.end)} onChange={(e) => {
                    setData({...data, end: convertTimeToDouble(e.target.value)})
                }} />
            </td>
            <td>
                <input className={styles.color_select} type="color" value={data.color} onChange={(e) => {
                    setData({...data, color: e.target.value})
                }} />
            </td>
            <td>
                <div className={styles.actions}>
                    <button className={styles.btn_green} onClick={() => {
                        handleAddNew()
                    }}>Add</button>
                    <button className={styles.btn_red} onClick={() => {
                        setAddMode(false)
                    }}>Cancel</button>
                </div>
            </td>
        </tr>
    )
}

export default Add