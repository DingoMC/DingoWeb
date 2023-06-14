import axios from "axios"
import { useState, useEffect } from "react"
import styles from "./styles.module.css"
import NavBar from "../nav"
import { cors_url } from "../../lib/cors_url"
import { useSelector, useDispatch } from "react-redux"
import { setUserSettings } from "../../actions"

const Profile = () => {
    const settings = useSelector((state) => state.user_settings)
    const dispatch = useDispatch()

    const [userSettings, setUSettings] = useState({})
    const [changed, setChanged] = useState({firstName: false, lastName: false, dark_mode: false})
    const [validated, setValidated] = useState({firstName: true, lastName: true})
    const allValidated = () => {
        return !(Object.values(validated).includes(false))
    }
    const somethingChanged = () => {
        return (Object.values(changed).includes(true))
    }
    const validate = (name) => {
        return (name.length >= 2)
    }
    useEffect (() => {
        const handleSettingGet = async () => {
            try {
                const url = cors_url('api/usersettings')
                const token = localStorage.getItem("token")
                const response = await axios.get(url, {params: {token: token}})
                setUSettings(response.data)
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
        handleSettingsGet().catch(console.error)
        handleSettingGet().catch(console.error)
    }, [])
    const handleSettingsPost = async () => {
        try {
            const url = cors_url('api/usersettings')
            const token = localStorage.getItem("token")
            await axios.post(url, {token: token, firstName: userSettings.udata.firstName, lastName: userSettings.udata.lastName, darkMode: userSettings.settings.dark_mode})
            window.location.reload()
        }
        catch (error) {
            console.log(error)
        }
    }
    const handleScoreReset = async () => {
        try {
            const url = cors_url('api/usersettings/reset')
            const token = localStorage.getItem("token")
            await axios.post(url, {token: token})
            window.location.reload()
        }
        catch (error) {
            console.log(error)
        }
    }
    const handleUserDelete = async () => {
        try {
            const token = localStorage.getItem("token")
            const url = cors_url('api/usersettings/') + token
            await axios.delete(url)
            localStorage.removeItem("token")
            window.location.reload()
        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        <div className={`${styles.main_container} ${settings.darkMode && styles.dark}`}>
            <NavBar current="myprofile" />
            <div className={styles.main}>
                <div className={`${styles.section} ${settings.darkMode && styles.dark}`}>
                    <div className={`${styles.title} ${settings.darkMode && styles.dark}`}>Profile Data</div>
                    <div className={styles.uinput}>
                        <span>First Name</span>
                        <input type="text" defaultValue={userSettings.udata && userSettings.udata.firstName} onChange={(event) => {
                            setValidated(prevState => ({...prevState, firstName: validate(event.target.value)}))
                            setUSettings(prevState => ({...prevState, udata: {...prevState.udata, firstName: event.target.value}}))
                            setChanged(prevState => ({...prevState, firstName: true}))
                        }}
                        className={`${settings.darkMode && styles.dark} ${changed.firstName && styles.changed} ${!validated.firstName && styles.invalid}`} />
                    </div>
                    <div className={styles.uinput}>
                        <span>Last Name</span>
                        <input type="text" defaultValue={userSettings.udata && userSettings.udata.lastName} onChange={(event) => {
                            setValidated(prevState => ({...prevState, lastName: validate(event.target.value)}))
                            setUSettings(prevState => ({...prevState, udata: {...prevState.udata, lastName: event.target.value}}))
                            setChanged(prevState => ({...prevState, lastName: true}))
                        }}
                        className={`${settings.darkMode && styles.dark} ${changed.lastName && styles.changed} ${!validated.lastName && styles.invalid}`}/>
                    </div>
                </div>
                <div className={`${styles.section} ${settings.darkMode && styles.dark}`}>
                    <div className={`${styles.title} ${settings.darkMode && styles.dark}`}>Appearance</div>
                    <div className={styles.agrid}>
                        <span>Dark Mode</span>
                        <label className={styles.switch}>
                            <input type="checkbox" className={styles.dminput} defaultChecked={userSettings.settings && userSettings.settings.dark_mode} onChange={(event) => {
                                setUSettings(prevState => ({...prevState, settings: {...prevState.udata, dark_mode: event.target.checked}}))
                                setChanged(prevState => ({...prevState, dark_mode: true}))
                            }} />
                            <span className={`${styles.slider} ${styles.round}`}></span>
                        </label>
                    </div>
                </div>
                <div className={`${styles.section} ${styles.danger} ${settings.darkMode && styles.dark}`}>
                    <div className={`${styles.title} ${styles.danger} ${settings.darkMode && styles.dark}`}>Danger Zone</div>
                    <button className={styles.danger} onClick={() => {
                        if (window.confirm("Warning! You are about to delete all your stats! Are you sure You want to continue?")) {
                            handleScoreReset()
                        }
                    }}>Reset my scores</button>
                    <button className={styles.danger} onClick={() => {
                        if (window.confirm("Warning! This action is irreverisble and will also delete all Your Scores and Settings! Are you sure You want to continue?")) {
                            handleUserDelete()
                        }
                    }}>Delete my account</button>
                </div>
                <div className={styles.right}>
                    {allValidated() && somethingChanged() && <button className={styles.apply} onClick={handleSettingsPost}>Apply</button>}
                </div>
            </div>
        </div>
    )
}

export default Profile
