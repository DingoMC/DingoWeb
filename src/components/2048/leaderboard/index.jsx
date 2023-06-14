import axios from "axios"
import { useState, useEffect } from "react"
import styles from "./styles.module.css"
import { cors_url } from "../../../lib/cors_url"
import { useSelector, useDispatch } from "react-redux"
import { setUserSettings } from "../../../actions"
import NavBar2048 from "../navbar"
import { isGuest } from "../../../lib/guest"

const Leaderboard2048 = () => {
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
        if (!isGuest()) handleSettingsGet().catch(console.error)
    }, [])

    const [leaderboard, setLeaderboard] = useState({scores: [], rank: 0})
    const [grid, setGrid] = useState(4)
    useEffect(() => {
        const handleScoreGet = async () => {
            try {
                const url = cors_url('api/2048/leaderboard')
                const token = localStorage.getItem("token")
                const response = await axios.get(url, {params: {token: token, grid: grid}})
                setLeaderboard(response.data)
            }
            catch (error) {
                console.log(error)
            }
        }
        handleScoreGet().catch(console.error)
    }, [grid])
    const generateRows = () => {
        const rows = []
        if (leaderboard.scores !== undefined || leaderboard) {
            for (let i = 0; i < (leaderboard.scores.length > 10 ? 10 : leaderboard.scores.length); i++) {
                rows.push(<tr key={i}>
                    <td>#{(i + 1).toString()}</td>
                    <td>{leaderboard.scores[i].user}</td>
                    <td>{leaderboard.scores[i].score}</td>
                </tr>)
            }
        }
        return (<tbody>{rows}</tbody>)
    }
    const grids = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    const handleGridChange = (e) => {
        setGrid(e.target.value)
    }
    return (
        <div className={`${styles.main_container} ${settings.darkMode && styles.dark}`}>
            <NavBar2048 current={"leaderboard"} settings={settings} />
            <div className={styles.main}>
                <div className={`${styles.title} ${settings.darkMode && styles.dark}`}>Top 10 Players in {grid}x{grid} 2048</div>
                <table className={`${styles.leaderboard} ${settings.darkMode && styles.dark}`}>
                    <thead>
                        <tr>
                            <th colSpan={3}>
                                <div className={styles.mode_select_wrapper}>
                                    <div>Select Mode: </div>
                                    <select value={grid} onChange={handleGridChange} className={`${styles.mode_select} ${settings.darkMode && styles.dark}`}>
                                        {grids.map((option) => (
                                            <option value={option} key={option}>{`${option.toString()}x${option.toString()}`}</option>
                                        ))}
                                    </select>
                                </div>
                            </th>
                        </tr>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    {generateRows()}
                </table>
                <div className={`${styles.own_score_wrap} ${settings.darkMode && styles.dark}`}>
                    <div className={`${styles.own_score_title} ${settings.darkMode && styles.dark}`}>Your Rank and Score:</div>
                    <div>
                        {
                            (leaderboard.rank !== 0) ?
                            <div className={styles.own_score_grid}>
                                <div className={`${styles.own_rank} ${settings.darkMode && styles.dark}`}>#{leaderboard.rank} / {leaderboard.scores.length}</div>
                                <div>-</div>
                                <div className={`${styles.own_points} ${settings.darkMode && styles.dark}`}>{leaderboard.scores[leaderboard.rank - 1].score} points</div>
                            </div>
                            : (
                                (!isGuest() || localStorage.getItem('hs' + grid.toString()) === null) ? 
                                <div className={`${styles.no_own_score} ${settings.darkMode && styles.dark}`}>You haven't played this mode yet!</div>
                                : <div className={styles.own_score_grid}>
                                    <div className={styles.own_rank}>Unranked</div>
                                    <div>-</div>
                                    <div className={styles.own_points}>{localStorage.getItem('hs' + grid.toString())}</div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Leaderboard2048