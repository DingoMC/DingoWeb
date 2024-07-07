import styles from "./styles.module.css";
import { useState } from "react";
import axios from "axios";
import { cors_url } from "../../../lib/cors_url";
import { isGuest } from "../../../lib/guest";
import { TileArray } from "../../../lib/ai_2048";
import Auto2048 from "../auto";

/**
 * 
 * @param {{tileArray: TileArray, aiMode: boolean, onMove: (move: 0 | 1 | 2 | 3) => void, settings: any}} param0 
 * @returns 
 */
const Scoreboard = ({tileArray, aiMode, onMove, settings}) => {
    const handleScoreUpdate = async () => {
        try {
            const url = cors_url('api/2048/updatescore')
            const token = localStorage.getItem("token")
            await axios.post(url, {token: token, grid: tileArray.gridSize, score: tileArray.highscore})
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
                    <span>{tileArray.score}</span>
                    <span className={styles.score_on_fuse}>{`${tileArray.scoreOnLastFuse === 0 ? "" : "+" + tileArray.scoreOnLastFuse.toString()}`}</span>
                </div>
            </div>
            {aiMode ?
                <Auto2048
                    tileArray={tileArray}
                    onMove={onMove}
                    aiMode={aiMode}
                />
                :
                <div className={`${styles.score_box} ${settings.darkMode && styles.dark}`}>
                    <span>High Score</span>
                    <div className={`${isGuest() ? "" : styles.highscore_content}`}>
                        <span>{tileArray.highscore}</span>
                        {!isGuest() &&
                        <img title="Click to save your current High Score" src={hsimg} alt="Save"
                            onClick={() => {handleScoreUpdate()}}
                            onMouseEnter={() => {setHSImg('/svg/save-highscore-hover.svg')}}
                            onMouseLeave={() => {setHSImg('/svg/save-highscore.svg')}} />}
                    </div>
                </div>
            }
        </div>
    )
}
export default Scoreboard