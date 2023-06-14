import styles from "./styles.module.css"
import { Link } from "react-router-dom"

const Card = ({data}) => {
    return (
        <div className={styles.card}>
            <div className={styles.card_title}>
                <div className={styles.text}>{data.title}</div>
                <div className={styles[data.vtype.toLowerCase()]}>{data.vtype + ' ' + data.version}</div>
            </div>
            <div className={styles.card_content}>
                <span className={styles.card_text}>{data.content}</span>
                <hr />
                <Link to={data.golink} className={styles.card_go}>Go &#8594;</Link>
            </div>
        </div>
    )
}

export default Card