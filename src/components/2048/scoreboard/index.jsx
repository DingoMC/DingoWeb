import styles from "./styles.module.css"
import { useState } from "react"
import axios from "axios"
import { cors_url } from "../../../lib/cors_url"
import { isGuest } from "../../../lib/guest"

const Scoreboard = ({gridSize, score, score_on_fuse, highscore, settings}) => {
    const handleScoreUpdate = async () => {
        try {
            const url = cors_url('api/2048/updatescore')
            const token = localStorage.getItem("token")
            await axios.post(url, {token: token, grid: gridSize, score: highscore})
        }
        catch (error) {
            console.log(error)
        }
    }
    const [hsimg, setHSImg] = useState('/svg/save-highscore.svg')
    return (
        <div className={styles.score_wrapper}>
            <div className={`${styles.score_box} ${settings.darkMode && styles.dark}`}>
                <span>Score</span>
                <div className={styles.score_content}>
                    <span>{score}</span>
                    <span className={styles.score_on_fuse}>{`${score_on_fuse === 0 ? "" : "+" + score_on_fuse.toString()}`}</span>
                </div>
            </div>
            <div className={`${styles.score_box} ${settings.darkMode && styles.dark}`}>
                <span>High Score</span>
                <div className={`${isGuest() ? "" : styles.highscore_content}`}>
                    <span>{highscore}</span>
                    {!isGuest() &&
                    <img title="Click to save your current High Score" src={hsimg} alt="Save"
                        onClick={() => {handleScoreUpdate()}}
                        onMouseEnter={() => {setHSImg('/svg/save-highscore-hover.svg')}}
                        onMouseLeave={() => {setHSImg('/svg/save-highscore.svg')}} />}
                </div>
            </div>
        </div>
    )
}
export default Scoreboard