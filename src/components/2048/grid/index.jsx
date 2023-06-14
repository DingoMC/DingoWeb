import styles from "./styles.module.css"
import Tile from "../tile"
import { valAt } from "../../../lib/tile_array"
import { useRef } from "react"

const Grid = ({gridSize, tileArray, settings}) => {

    const freeSpacing = 32
    const getPadding = () => {
        return (32.0 / gridSize).toFixed(0) + "px"
    }
    const windowSize = useRef([window.innerWidth, window.innerHeight])
    
    const generateCols = (x) => {
        let a = 40.0 / (Math.exp(-2) - Math.exp(-4))
        let b = 120.0 - (40.0 * Math.exp(-2) / (Math.exp(-2) - Math.exp(-4)))
        let e_size_opt = a * Math.exp(-gridSize) + b
        let total_paddings = (32.0 / gridSize) * (gridSize + 1.0)
        let w = windowSize.current[0] - freeSpacing - total_paddings
        let h = windowSize.current[1] - freeSpacing - total_paddings - 171
        let e_size_max = Math.min(w, h) / gridSize
        let e_size = (e_size_opt > e_size_max ? e_size_max : e_size_opt)
        let e_size_str = e_size.toFixed(0) + "px"
        let font_size = Math.floor(0.5 * e_size)
        let cols = []
        for (let i = 0; i < gridSize; i++) {
            let digits = valAt(tileArray, gridSize, x, i).toString().length
            while (3.0 * font_size * digits / 4.0 > e_size) font_size--;
            let font_size_str = font_size.toFixed(0) + "px"
            cols.push(<div className={`${styles.col} ${settings.darkMode && styles.dark}`} style={{"width": e_size_str, "height": e_size_str, "fontSize": font_size_str}} key={i}>
                <Tile value={valAt(tileArray, gridSize, x, i)}></Tile>
            </div>)
        }
        return cols
    }

    const generateRows = () => {
        let rows = []
        for (let i = 0; i < gridSize; i++) {
            rows.push(<div className={styles.tile_row} style={{"columnGap": getPadding()}} key={i}>{generateCols(i)}</div>)
        }
        return rows
    }

    return (
        <div className={`${styles.grid} ${settings.darkMode && styles.dark}`} style={{"padding": getPadding(), "rowGap": getPadding()}}>
            {generateRows()}
        </div>
    )
}

export default Grid