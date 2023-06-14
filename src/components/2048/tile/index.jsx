import styles from "./styles.module.css"

const Tile = ({value}) => {
    return (
        <div className={`${styles.tile} ${styles["tile_" + value.toString()]}`}>{value.toString()}</div>
    )
}

export default Tile