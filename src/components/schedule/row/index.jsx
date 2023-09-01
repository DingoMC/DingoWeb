import { useState, useRef } from 'react'
import styles from './styles.module.css'
import { cors_url } from '../../../lib/cors_url'
import axios from 'axios'
import { convertDayToString, convertHourToString, convertTimeToDouble } from '../lib'

const Row = ({data, isAdmin, handleIsAdmin}) => {
    const handleScheduleDelete = async (id) => {
        handleIsAdmin().then(async (v) => {
            if (v === 2) {
                try {
                    const url = cors_url("api/schedule/") + id
                    await axios.delete(url)
                    window.location.reload()
                }
                catch (error) {
                    console.log(error)
                }
            }
        })
    }
    const handleEdit = async (id, newData) => {
        handleIsAdmin().then(async (v) => {
            if (v === 2) {
                try {
                    const url = cors_url("api/schedule/") + id
                    await axios.put(url, newData)
                    window.location.reload()
                }
                catch (error) {
                    console.log(error)
                }
            }
        })
    }
    const [editMode, setEditMode] = useState(false)
    const [newData, setNewData] = useState({code: data.code, day: data.day, start: data.start, end: data.end, color: data.color})
    const windowSize = useRef([window.innerWidth, window.innerHeight])
    if (editMode) {
        return (
            <tr className={styles.row}>
                <td><input type="text" value={newData.code} onChange={(e) => {
                    setNewData({...newData, code: e.target.value})
                }} /></td>
                <td>
                    <select name="day" id="day" value={newData.day} onChange={(e) => {
                        setNewData({...newData, day: parseInt(e.target.value)})
                    }}>
                        <option value="0">Monday</option>
                        <option value="1">Tuesday</option>
                        <option value="2">Wednesday</option>
                        <option value="3">Thursday</option>
                        <option value="4">Friday</option>
                        <option value="5">Saturday</option>
                        <option value="6">Sunday</option>
                    </select>
                </td>
                <td>
                    <input type="time" value={convertHourToString(newData.start)} onChange={(e) => {
                        setNewData({...newData, start: convertTimeToDouble(e.target.value)})
                    }} />
                </td>
                <td>
                    <input type="time" value={convertHourToString(newData.end)} onChange={(e) => {
                        setNewData({...newData, end: convertTimeToDouble(e.target.value)})
                    }} />
                </td>
                <td>
                    <input type="color" value={newData.color} onChange={(e) => {
                        setNewData({...newData, color: e.target.value})
                    }} />
                </td>
                <td>
                    <div className={styles.actions}>
                        <button className={styles.btn_green} onClick={() => {
                            handleEdit(data._id, newData)
                        }}>Apply</button>
                        <button className={styles.btn_red} onClick={() => {
                            setEditMode(false)
                        }}>Cancel</button>
                    </div>
                </td>
            </tr>
        )
    }
    return (
        <tr className={styles.row}>
            <td>{data.code}</td>
            <td>{convertDayToString(data.day, windowSize.current[0])}</td>
            <td>{convertHourToString(data.start)}</td>
            <td>{convertHourToString(data.end)}</td>
            <td><div className={styles.color_box} style={{backgroundColor: data.color}}></div></td>
            {isAdmin === 2 && <td>
                <div className={styles.actions}>
                    <button className={styles.btn_yellow} onClick={() => {
                        setEditMode(true)
                    }}>Edit</button>
                    <button className={styles.btn_red} onClick={() => {
                        if (window.confirm('Are You sure You want to delete this schedule?')) handleScheduleDelete(data._id)
                    }}>Delete</button>
                </div>
            </td>}
        </tr>
    )
}

export default Row