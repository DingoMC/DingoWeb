import { clearGameState, saveGameState } from "../../../lib/grid_state"
import { generateStartingState } from "../../../lib/tile_array"
import styles from "./styles.module.css"

const GameOpt = ({gridSize, restart, prev, setprev, score, setScore, scoreOnLastFuse, setScoreOnLastFuse, settings}) => {

    return (
        <div className={styles.rst_wrap}>
            <button className={`${styles.rst} ${settings.darkMode && styles.dark}`} onClick={() => {
                clearGameState(gridSize)
                restart(generateStartingState(gridSize))
                setScore(0)
                setScoreOnLastFuse(0)
            }}>Restart</button>
            <button className={`${styles.undo} ${settings.darkMode && styles.dark}`} disabled={`${prev.length === 0 ? "disabled" : ""}`} onClick={() => {
                if (prev.length !== 0) {
                    saveGameState(score - scoreOnLastFuse, prev, gridSize)
                    restart(prev)
                    setprev([])
                    setScoreOnLastFuse(0)
                    setScore(score - scoreOnLastFuse)
                }
            }}>Undo</button>
            
        </div>
    )
}
export default GameOpt