import { useEffect, useState } from "react"
import { cors_url } from "../../lib/cors_url"
import axios from "axios"
import styles from './styles.module.css'
import MainLayout from "../../layouts/main"
import offsetTime from "../../lib/schedule"
import ScheduleTable from "./table"

const Schedule = () => {
    const [scheduleArray, setScheduleArray] = useState([])
    const [tzOffset, setTZOffset] = useState(0)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleScheduleGet = async () => {
            try {
                const url = cors_url("api/schedule")
                const response = await axios.get(url)
                setScheduleArray(response.data);
            }
            catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
        handleScheduleGet();
    }, [])

    useEffect(() => {
        if (scheduleArray && scheduleArray.length > 0) {
            const dt = new Date();
            let diffTZ = -dt.getTimezoneOffset() / 60.0;
            setTZOffset(diffTZ)
        }
        else setLoading(false);
    }, [scheduleArray])

    useEffect(() => {
        setScheduleArray(scheduleArray.map((v) => {
            return {...v, time: offsetTime(v.time, tzOffset)}
        }));
        setLoading(false);
    }, [tzOffset])

    return (
        <MainLayout current="schedule">
            <div className={styles.container}>
                <div className={styles.title}>DingoMC's Schedule</div>
                { loading ?
                    <div>Laoding</div> :
                    <ScheduleTable data={scheduleArray} />
                }
            </div>
        </MainLayout>
    )
}

export default Schedule