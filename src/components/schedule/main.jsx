import { useEffect, useState } from "react"
import { cors_url } from "../../lib/cors_url"
import axios from "axios"
import styles from './styles.module.css'
import Row from "./row"
import Add from "./add"
import Display from "./display"
import MainLayout from "../../layouts/main"

const handleIsAdmin = async () => {
    try {
        const url = cors_url("api/usersettings/isadmin")
        const token = localStorage.getItem("token")
        const response = await axios.get(url, {params: {token: token}})
        if (response.data.is_admin) return 2
        else return 0
    }
    catch (error) {
        console.log(error)
        return 0
    }
}

const Schedule = () => {
    const user = localStorage.getItem("token")
    const guest = (user === null)
    const [scheduleArray, setScheduleArray] = useState([])
    const [isAdmin, setIsAdmin] = useState(1)
    const [addMode, setAddMode] = useState(false)
    const [tzOffset, setTZOffset] = useState(0)

    const handleScheduleGet = async () => {
        try {
            const url = cors_url("api/schedule")
            const response = await axios.get(url)
            setScheduleArray(response.data)
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (isAdmin === 1) {
            if (guest) setIsAdmin(0)
            else handleIsAdmin().then((v) => {
                setIsAdmin(v)
            })
        }
    }, [isAdmin])

    useEffect(() => {
        if (isAdmin !== 1) handleScheduleGet()
    }, [isAdmin])

    useEffect(() => {
        if (scheduleArray && scheduleArray.length > 0) {
            const dt = new Date();
            let diffTZ = -dt.getTimezoneOffset() / 60.0;
            setTZOffset(diffTZ)
        }
    }, [scheduleArray])

    useEffect(() => {
        setScheduleArray(scheduleArray.map((v) => {
            return {...v, start: v.start + tzOffset, end: v.end + tzOffset}
        }))
    }, [tzOffset])

    const generateRows = () => {
        let rows = []
        if (addMode) rows.push(<Add key={'as'} setAddMode={setAddMode} handleIsAdmin={handleIsAdmin}/>)
        for (let i = 0; i < scheduleArray.length; i++) {
            rows.push(<Row key={i} data={scheduleArray[i]} isAdmin={isAdmin} handleIsAdmin={handleIsAdmin} />)
        }
        return rows
    }

    if (isAdmin === 1) {
        return (
            <div>
                <div>Verifying... Please wait</div>
            </div>
        )
    }
    return (
        <MainLayout current="schedule">
            <div className={styles.container}>
                <div className={styles.title}>DingoMC's Schedule</div>
                <Display data={scheduleArray} />
                {isAdmin === 2 && !addMode && <button className={styles.btn_green} onClick={() => {
                    setAddMode(true)
                }}>Add Schedule</button>}
                <div className={styles.subtitle}>Legend</div>
                <table className={styles.legend}>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Day</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Color</th>
                            {isAdmin === 2 && <th>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {generateRows()}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    )
}

export default Schedule