import styles from "./styles.module.css"

const Tile = ({value, tileSize}) => {
    const fontSize = () => {
        let font_size = Math.floor(0.5 * tileSize)
        let digits = value.toString().length
        while (3.0 * font_size * digits / 4.0 > tileSize) font_size--;
        return font_size.toFixed(0) + "px"
    }
    return (
        <div style={{"fontSize": fontSize()}} className={`${styles.tile} ${styles["tile_" + value.toString()]}`}>{value.toString()}</div>
    )
}

export default Tile