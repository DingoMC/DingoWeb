import styles from "./styles.module.css"

/**
 * 
 * @param {{gridSizeChange: (gridSize: number) => void, currGridSize: number, settings: any}} param0 
 * @returns 
 */
const GridOpt = ({gridSizeChange, currGridSize, settings}) => {

    const convertToNN = (n) => {
        return n.toString() + "x" + n.toString()
    }
    return (
        <div className={`${styles.gridchg_wrap} ${settings.darkMode && styles.dark}`}>
            <label>Grid: </label>
            <input className={`${styles.grid_size} ${settings.darkMode && styles.dark}`} type="text" disabled="disabled" value={convertToNN(currGridSize)}/>
            <button className={`${styles.plus} ${settings.darkMode && styles.dark}`} onClick={() => {
                if (currGridSize < 16) gridSizeChange(currGridSize + 1)
            }}>&#8679;</button>
            <button className={`${styles.minus} ${settings.darkMode && styles.dark}`} onClick={() => {
                if (currGridSize > 2) gridSizeChange(currGridSize - 1)
            }}>&#8681;</button>
        </div>
    )
}

export default GridOpt