import styles from "./styles.module.css";
import Tile from "../tile";
import { TileArray } from "../../../lib/ai_2048";
import { useEffect, useState } from "react"

/**
 * 
 * @param {{tileArray: TileArray, settings: any}} param0 
 * @returns 
 */
const Grid = ({tileArray, settings}) => {

    const freeSpacing = 32
    const getPadding = () => {
        return (32.0 / tileArray.gridSize).toFixed(0) + "px"
    }
    const [windowSize, setWindowSize] = useState([
        window.innerWidth,
        window.innerHeight,
    ]);
    useEffect(() => {
        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);
    
    const generateCols = (x) => {
        let a = 40.0 / (Math.exp(-2) - Math.exp(-4))
        let b = 120.0 - (40.0 * Math.exp(-2) / (Math.exp(-2) - Math.exp(-4)))
        let e_size_opt = a * Math.exp(-tileArray.gridSize) + b
        let total_paddings = (32.0 / tileArray.gridSize) * (tileArray.gridSize + 1.0)
        let w = windowSize[0] - freeSpacing - total_paddings
        let h = windowSize[1] - freeSpacing - total_paddings - 184
        let e_size_max = Math.min(w, h) / tileArray.gridSize
        let e_size = (e_size_opt > e_size_max ? e_size_max : e_size_opt)
        let e_size_str = e_size.toFixed(0) + "px"
        let cols = []
        for (let i = 0; i < tileArray.gridSize; i++) {
            cols.push(<div className={`${styles.col} ${settings.darkMode && styles.dark}`} style={{"width": e_size_str, "height": e_size_str}} key={i}>
                <Tile tileSize={e_size} value={tileArray.getTileValue(x, i)}></Tile>
            </div>)
        }
        return cols
    }

    const generateRows = () => {
        let rows = []
        for (let i = 0; i < tileArray.gridSize; i++) {
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