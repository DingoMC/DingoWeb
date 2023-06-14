import axios from "axios"
import { useState, useEffect } from "react"
import styles from "./styles.module.css"
import { cors_url } from "../../../lib/cors_url"
import { useSelector, useDispatch } from "react-redux"
import { setUserSettings } from "../../../actions"
import NavBar2048 from "../navbar"
import { isGuest } from "../../../lib/guest"

const UserScores2048 = () => {
    const settings = useSelector((state) => state.user_settings)
    const dispatch = useDispatch()

    const [userScores, setUserScores] = useState([])
    useEffect(() => {
        const handleScoreGet = async () => {
            try {
                const url = cors_url('api/2048/userscores')
                const token = localStorage.getItem("token")
                const response = await axios.get(url, {params: {token: token}})
                setUserScores(response.data.scores)
            }
            catch (error) {
                console.log(error)
            }
        }
        const handleSettingsGet = async () => {
            try {
                const url = cors_url("api/usersettings/settings")
                const token = localStorage.getItem("token")
                const response = await axios.get(url, {params: {token: token}})
                dispatch(setUserSettings(response.data.settings.dark_mode))
            }
            catch (error) {
                console.log(error)
            }
        }
        if (isGuest()) {
            let uScores = []
            for (let i = 2; i < 16; i++) {
                let key = 'hs' + i.toString();
                if (localStorage.getItem(key) !== null) {
                    uScores.push({grid: i, score: localStorage.getItem(key)})
                }
            }
            setUserScores(uScores)
        }
        else {
            handleSettingsGet().catch(console.error)
            handleScoreGet().catch(console.error)
        }
    }, [])
    const generateRows = () => {
        let e = []
        if (userScores !== undefined || userScores) {
            for (let i = 0; i < userScores.length; i++) {
                e.push(<tr key={i}><td>{`${userScores[i].grid}x${userScores[i].grid}`}</td><td>{userScores[i].score}</td></tr>)
            }
        }
        return (<tbody>{e}</tbody>);
    }
    return (
        <div className={`${styles.main_container} ${settings.darkMode && styles.dark}`}>
            <NavBar2048 current={"myscores"} settings={settings} />
            <div className={styles.main}>
                <div className={styles.title}>Your stats</div>
                <table className={`${styles.scoreboard} ${settings.darkMode && styles.dark}`}>
                    <thead>
                        <tr>
                            <th>Mode</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    {generateRows()}
                </table>
            </div>
        </div>
    )
}

export default UserScores2048