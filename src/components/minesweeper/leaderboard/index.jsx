import NavBarMS from '../navbar'
import styles from './styles.module.css'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { setUserSettings } from "../../../actions"
import axios from "axios"
import { cors_url } from "../../../lib/cors_url"
import { isGuest } from '../../../lib/guest'

const LeaderboardMS = () => {
    const settings = useSelector((state) => state.user_settings)
    const dispatch = useDispatch()

    useEffect(() => {
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
        if (!isGuest()) {
            handleSettingsGet().catch(console.error)
        }
        else {
            if (localStorage.getItem('ms_stats') !== null) {
                let e = JSON.parse(localStorage.getItem('ms_stats'))
            }
        }
    }, [])

    return (
        <div className={`${styles.main_container} ${settings.darkMode ? styles.dark : ''}`}>
            <NavBarMS current="leaderboard" settings={{darkMode: settings.darkMode}}/>
            <div className={styles.main}>

            </div>
        </div>
    )
}

export default LeaderboardMS