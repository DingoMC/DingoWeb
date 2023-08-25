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
        const handleLeaderboardGet = async () => {
            try {
                const url = cors_url('api/minesweeper/leaderboard')
                const token = localStorage.getItem("token")
                const response = await axios.get(url, {params: {token: token}})
                setLeaderboard(response.data)
            }
            catch (error) {
                console.log(error)
            }
        }
        handleLeaderboardGet()
        if (!isGuest()) {
            handleSettingsGet().catch(console.error)
        }
        else {
            if (localStorage.getItem('ms_stats') !== null) {
                let e = JSON.parse(localStorage.getItem('ms_stats'))
                setGuestStats(e)
            }
        }
    }, [])

    const [leaderboard, setLeaderboard] = useState({data: [], rank: 0})
    const [guestStats, setGuestStats] = useState({score: 0, wins: 0, losses: 0})

    const generateRows = () => {
        let elems = []
        for (let i = 0; i < (leaderboard.data.length > 10 ? 10 : leaderboard.data.length); i++) {
            elems.push(<tr key={i}>
                <td>{i + 1}</td>
                <td>{leaderboard.data[i].user}</td>
                <td>{leaderboard.data[i].score}</td>
                <td>{leaderboard.data[i].wins}</td>
                <td>{leaderboard.data[i].losses}</td>
                <td>{(leaderboard.data[i].wins / leaderboard.data[i].losses).toFixed(3)}</td>
            </tr>)
        }
        return elems
    }

    return (
        <div className={`${styles.main_container} ${settings.darkMode ? styles.dark : ''}`}>
            <NavBarMS current="leaderboard" settings={{darkMode: settings.darkMode}}/>
            <div className={styles.main}>
                <div className={styles.title}>Top 10 Players in Minesweeper</div>
                <table className={styles.leaderboard}>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Score</th>
                            <th>Wins</th>
                            <th>Losses</th>
                            <th>W/L</th>
                        </tr>
                    </thead>
                    <tbody>
                        {generateRows()}
                    </tbody>
                </table>
                <div className={`${styles.own_score_wrap}`}>
                    <div className={`${styles.own_score_title}`}>Your Rank and Score:</div>
                    <div>
                        {
                            (leaderboard.rank !== 0) ?
                            <div className={styles.own_score_grid}>
                                <div className={`${styles.own_rank}`}>#{leaderboard.rank} / {leaderboard.data.length}</div>
                                <div>-</div>
                                <div className={`${styles.own_points}`}>{leaderboard.data[leaderboard.rank - 1].score} points</div>
                            </div>
                            : (
                                (!isGuest() || localStorage.getItem('ms_stats') === null) ? 
                                <div className={`${styles.no_own_score}`}>You haven't played this game yet!</div>
                                : <div className={styles.own_score_grid}>
                                    <div className={styles.own_rank}>Unranked</div>
                                    <div>-</div>
                                    <div className={styles.own_points}>{JSON.parse(localStorage.getItem('ms_stats')).score}</div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeaderboardMS