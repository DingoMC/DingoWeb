import styles from "./events.module.css"
import axios from "axios"
import { cors_url } from "../../lib/cors_url"
import { useEffect, useState } from "react"
import Disabled from "../vcs/disabled";
import Enabled from "../vcs/enabled";
import { convertHourStrToFloat, convertHourToString, dayToString } from "../../lib/schedule";

export default function EventsTable () {
    const cleanGlobalRow = {code: '', color: "#000000", time: []};
    const cleanTimeRow = {day: 0, start: 0, end: 0, enabled: false}
    const nullTimeIndex = [-1, -1];
    const [scheduleArray, setScheduleArray] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalAddData, setGlobalAddData] = useState(cleanGlobalRow);
    const [globalEditIndex, setGlobalEditIndex] = useState(-1);
    const [globalEditData, setGlobalEditData] = useState(cleanGlobalRow);
    const [timeAddData, setTimeAddData] = useState(cleanTimeRow);
    const [timeEditIndex, setTimeEditIndex] = useState(nullTimeIndex);
    const [timeEditData, setTimeEditData] = useState(cleanTimeRow);

    useEffect(() => {
        const handleScheduleGet = async () => {
            try {
                const url = cors_url("api/schedule")
                const response = await axios.get(url)
                setScheduleArray(response.data);
            }
            catch (error) {
                console.log(error);
            }
            setLoading(false);
        }
        handleScheduleGet();
    }, [])

    useEffect(() => {
        if (globalEditIndex === -1) setGlobalEditData(cleanGlobalRow);
        else setGlobalEditData(scheduleArray[globalEditIndex]);
    }, [globalEditIndex])

    useEffect(() => {
        if (timeEditIndex[0] === -1 && timeEditIndex[1] === -1) setTimeEditData(cleanTimeRow);
        else setTimeEditData(scheduleArray[timeEditIndex[0]].time[timeEditIndex[1]]);
    }, [timeEditIndex])

    const handleGlboalAdd = async () => {
        setLoading(true);
        try {
            const url = cors_url("api/schedule");
            const response = await axios.post(url, globalAddData);
            setScheduleArray([...scheduleArray, response.data.data]);
            setGlobalAddData(cleanGlobalRow);
        }
        catch (error) {
            console.log(error)
        }
        setLoading(false);
    }

    const handleGlobalDelete = async (idx) => {
        setLoading(true);
        try {
            const url = cors_url("api/schedule/" + scheduleArray[idx]["_id"]);
            const response = await axios.delete(url);
            if (response.data.status) setScheduleArray((prevState) => prevState.filter((el, i) => i !== idx));
        }
        catch (error) {
            console.log(error)
        }
        setLoading(false);
    }

    const handleGlobalEdit = async () => {
        setLoading(true);
        try {
            const url = cors_url("api/schedule/" + scheduleArray[globalEditIndex]["_id"]);
            const response = await axios.put(url, globalEditData);
            if (response.data.status) setScheduleArray((prevState) => prevState.map((el, i) => {
                if (i !== globalEditIndex) return el;
                return response.data.data;
            }));
            setGlobalEditIndex(-1);
        }
        catch (error) {
            console.log(error)
        }
        setLoading(false);
    }

    const handleTimeAdd = async (idx) => {
        setLoading(true);
        try {
            const url = cors_url("api/schedule/" + scheduleArray[idx]["_id"]);
            const updatedData = {...scheduleArray[idx], time: [...scheduleArray[idx].time, timeAddData]};
            const response = await axios.put(url, updatedData);
            if (response.data.status) setScheduleArray((prevState) => prevState.map((el, i) => {
                if (i !== idx) return el;
                return response.data.data;
            }));
            setTimeAddData(cleanTimeRow);
        }
        catch (error) {
            console.log(error)
        }
        setLoading(false);
    }

    const handleTimeEdit = async () => {
        setLoading(true);
        try {
            const url = cors_url("api/schedule/" + scheduleArray[timeEditIndex[0]]["_id"]);
            const updatedData = {...scheduleArray[timeEditIndex[0]], time: scheduleArray[timeEditIndex[0]].time.map((el, i) => {
                if (i !== timeEditIndex[1]) return el;
                return timeEditData;
            })};
            const response = await axios.put(url, updatedData);
            if (response.data.status) setScheduleArray((prevState) => prevState.map((el, i) => {
                if (i !== timeEditIndex[0]) return el;
                return response.data.data;
            }));
            setTimeEditData(cleanTimeRow);
            setTimeEditIndex(nullTimeIndex);
        }
        catch (error) {
            console.log(error)
        }
        setLoading(false);
    }

    const handleTimeDelete = async (idx, jdx) => {
        setLoading(true);
        try {
            const url = cors_url("api/schedule/" + scheduleArray[idx]["_id"]);
            const updatedData = {...scheduleArray[idx], time: scheduleArray[idx].time.filter((el, j) => j !== jdx)};
            const response = await axios.put(url, updatedData);
            if (response.data.status) setScheduleArray((prevState) => prevState.map((el, i) => {
                if (i !== idx) return el;
                return response.data.data;
            }));
        }
        catch (error) {
            console.log(error)
        }
        setLoading(false);
    }

    const generateRows = () => {
        let elems = [];
        elems.push(
            <tr className={styles.addRow}>
                <td className={styles.col120}>
                    <input type="text" value={globalAddData.code} 
                        disabled={loading}
                        onInput={(e) => setGlobalAddData({...globalAddData, code: e.target.value})} />
                </td>
                <td className={styles.col80}>
                    <input type="color" value={globalAddData.color} 
                        disabled={loading}
                        onInput={(e) => setGlobalAddData({...globalAddData, color: e.target.value})} />
                </td>
                <td colSpan={5}><div className={styles.center}>Times are disabled in global mode</div></td>     
                <td className={styles.col80}>
                    <div className={styles.center}>
                        <button className={styles.iconButton} disabled={loading} onClick={handleGlboalAdd} >
                            <img src="/svg/add.svg" />
                        </button>
                        <button className={styles.iconButton} disabled={loading} onClick={() => setGlobalAddData(cleanGlobalRow)}>
                            <img src="/svg/clear.svg" />
                        </button>
                    </div>
                </td>
            </tr>
        );
        for (let i = 0; i < scheduleArray.length; i++) {
            const e = scheduleArray[i];
            if (i === globalEditIndex) {
                elems.push(
                    <tr className={styles.editRow}>
                        <td className={styles.col120}>
                            <input type="text" value={globalEditData.code} 
                                disabled={loading}
                                onInput={(e) => setGlobalEditData({...globalEditData, code: e.target.value})} />
                        </td>
                        <td className={styles.col80}>
                            <input type="color" value={globalEditData.color} 
                                disabled={loading}
                                onInput={(e) => setGlobalEditData({...globalEditData, color: e.target.value})} />
                        </td>
                        <td colSpan={5}><div className={styles.center}>Times are disabled in global mode</div></td>     
                        <td className={styles.col80}>
                            <div className={styles.center}>
                                <button className={styles.iconButton} disabled={loading} onClick={handleGlobalEdit} >
                                    <img src="/svg/check.svg" />
                                </button>
                                <button className={styles.iconButton} disabled={loading} onClick={() => setGlobalEditIndex(-1)}>
                                    <img src="/svg/cross.svg" />
                                </button>
                            </div>
                        </td>
                    </tr>
                );
            } else {
                elems.push(
                    <tr>
                        <td rowSpan={e.time.length + 1} className={styles.col120}>{e.code}</td>
                        <td rowSpan={e.time.length + 1} className={styles.col80}>
                            <div className={styles.center}>
                                <div style={{border: '1px solid black', height: '20px', width: '48px', backgroundColor: e.color}}>
                                </div>
                            </div>
                        </td>
                        <td className={`${styles.col100} ${styles.addRow}`}>
                            <select
                                value={timeAddData.day.toString()}
                                onChange={(e) => setTimeAddData({...timeAddData, day: parseInt(e.target.value)})}
                                disabled={loading}
                            >
                                <option value={"0"}>Monday</option>
                                <option value={"1"}>Tuesday</option>
                                <option value={"2"}>Wednesday</option>
                                <option value={"3"}>Thursday</option>
                                <option value={"4"}>Friday</option>
                                <option value={"5"}>Saturday</option>
                                <option value={"6"}>Sunday</option>
                            </select>
                        </td>
                        <td className={`${styles.col80} ${styles.addRow}`}>
                            <input type="time" disabled={loading} value={convertHourToString(timeAddData.start)} 
                            onChange={(e) => setTimeAddData({...timeAddData, start: convertHourStrToFloat(e.target.value)})} />
                        </td>
                        <td className={`${styles.col80} ${styles.addRow}`}>
                            <input type="time" disabled={loading} value={convertHourToString(timeAddData.end)} 
                            onChange={(e) => setTimeAddData({...timeAddData, end: convertHourStrToFloat(e.target.value)})} />
                        </td>
                        <td className={`${styles.col80} ${styles.addRow}`}>
                            <div className={styles.center}>
                                <input type="checkbox" checked={timeAddData.enabled}
                                    disabled={loading}
                                    onChange={() => setTimeAddData({...timeAddData, enabled: !timeAddData.enabled})} />
                            </div>
                        </td>
                        <td className={`${styles.col80} ${styles.addRow}`}>
                            <div className={styles.center}>
                                <button className={styles.iconButton} disabled={loading} onClick={() => handleTimeAdd(i)} >
                                    <img src="/svg/add.svg" />
                                </button>
                                <button className={styles.iconButton} disabled={loading} onClick={() => setTimeAddData(cleanTimeRow)}>
                                    <img src="/svg/clear.svg" />
                                </button>
                            </div>
                        </td>
                        <td rowSpan={e.time.length + 1} className={styles.col80}>
                            <div className={styles.center}>
                                <button className={styles.iconButton} disabled={loading}
                                    onClick={() => setGlobalEditIndex(i)}
                                >
                                    <img src="/svg/edit.svg" />
                                </button>
                                <button className={styles.iconButton} disabled={loading}
                                    onClick={() => handleGlobalDelete(i)}
                                >
                                    <img src="/svg/delete.svg" />
                                </button>
                            </div>
                        </td>
                    </tr>
                );
                if (e.time.length > 0) {
                    for (let j = 0; j < e.time.length; j++) {
                        if (i === timeEditIndex[0] && j === timeEditIndex[1]) {
                            elems.push(
                                <tr className={styles.editRow}>
                                    <td className={`${styles.col100} ${styles.addRow}`}>
                                        <select
                                            value={timeEditData.day.toString()}
                                            onChange={(e) => setTimeEditData({...timeEditData, day: parseInt(e.target.value)})}
                                            disabled={loading}
                                        >
                                            <option value={"0"}>Monday</option>
                                            <option value={"1"}>Tuesday</option>
                                            <option value={"2"}>Wednesday</option>
                                            <option value={"3"}>Thursday</option>
                                            <option value={"4"}>Friday</option>
                                            <option value={"5"}>Saturday</option>
                                            <option value={"6"}>Sunday</option>
                                        </select>
                                    </td>
                                    <td className={`${styles.col80} ${styles.addRow}`}>
                                        <input type="time" disabled={loading} value={convertHourToString(timeEditData.start)} 
                                        onChange={(e) => setTimeEditData({...timeEditData, start: convertHourStrToFloat(e.target.value)})} />
                                    </td>
                                    <td className={`${styles.col80} ${styles.addRow}`}>
                                        <input type="time" disabled={loading} value={convertHourToString(timeEditData.end)} 
                                        onChange={(e) => setTimeEditData({...timeEditData, end: convertHourStrToFloat(e.target.value)})} />
                                    </td>
                                    <td className={`${styles.col80} ${styles.addRow}`}>
                                        <div className={styles.center}>
                                            <input type="checkbox" checked={timeEditData.enabled}
                                                disabled={loading}
                                                onChange={() => setTimeEditData({...timeEditData, enabled: !timeEditData.enabled})} />
                                        </div>
                                    </td>
                                    <td className={`${styles.col80} ${styles.addRow}`}>
                                        <div className={styles.center}>
                                            <button className={styles.iconButton} disabled={loading} onClick={handleTimeEdit} >
                                                <img src="/svg/check.svg" />
                                            </button>
                                            <button className={styles.iconButton} disabled={loading} onClick={() => setTimeEditIndex(nullTimeIndex)}>
                                                <img src="/svg/cross.svg" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        } else {
                            elems.push(
                                <tr>
                                    <td className={styles.col100}>{dayToString(e.time[j].day)}</td>
                                    <td className={styles.col80}>{convertHourToString(e.time[j].start)}</td>
                                    <td className={styles.col80}>{convertHourToString(e.time[j].end)}</td>
                                    <td className={styles.col80}>
                                        <div className={styles.center}>
                                            {e.time[j].enabled ? <Enabled /> : <Disabled />}
                                        </div>
                                    </td>
                                    <td className={styles.col80}>
                                        <div className={styles.center}>
                                            <button className={styles.iconButton} disabled={loading}
                                                onClick={() => setTimeEditIndex([i, j])}
                                            >
                                                <img src="/svg/edit.svg" />
                                            </button>
                                            <button className={styles.iconButton} disabled={loading}
                                                onClick={() => handleTimeDelete(i, j)}
                                            >
                                                <img src="/svg/delete.svg" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        }
                    }
                }
            }
        }
        return elems;
    }

    return (
        <div className={styles.wrapper} id="events">
            <table className={styles.main}>
                <thead>
                    <tr>
                        <th rowSpan={2}>Code</th>
                        <th rowSpan={2}>Color</th>
                        <th rowSpan={1} colSpan={5}>Time</th>
                        <th rowSpan={2}>Actions</th>
                    </tr>
                    <tr>
                        <th>Day</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {generateRows()}
                </tbody>
            </table>
        </div>
    );
}