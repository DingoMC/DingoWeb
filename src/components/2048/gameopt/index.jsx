import { clearGameState, saveGameState } from "../../../lib/grid_state";
import { generateStartingState } from "../../../lib/tile_array";
import styles from "./styles.module.css";
import { TileArray } from "../../../lib/ai_2048";

/**
 * 
 * @param {{onRestart: () => Promise<void>, onUndo: () => void, onAI: () => void, tileArray: TileArray, aiMode: boolean settings: any}} param0 
 * @returns 
 */
const GameOpt = ({onRestart, onUndo, onAI, tileArray, aiMode, settings}) => {

    return (
        <div className={styles.rst_wrap}>
            <button className={`${styles.rst} ${settings.darkMode && styles.dark}`} onClick={onRestart}>Restart</button>
            <button
                className={`${styles.undo} ${settings.darkMode && styles.dark}`}
                disabled={`${tileArray.canUndo() ? "" : "disabled"}`}
                onClick={onUndo}>Undo</button>
            <button className={`${aiMode ? styles.ai_on : styles.ai_off} ${settings.darkMode && styles.dark}`}
                onClick={onAI}>AI</button>
        </div>
    )
}
export default GameOpt