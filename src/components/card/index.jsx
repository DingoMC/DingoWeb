import Version from "../vcs/version"
import styles from "./styles.module.css"
import { Link } from "react-router-dom"
import { MdKeyboardArrowRight } from "react-icons/md";

const Card = ({data}) => {
    return (
        <div className={styles.card}>
            <div className={styles.card_title}>
                <div className={styles.text}>{data.title}</div>
                {data.vtype && data.version &&
                    <Version version={data.vtype + ' ' + data.version} style={{justifySelf: 'right', alignSelf: 'center'}} />
                }
            </div>
            <div className={styles.card_content}>
                <span className={styles.card_text}>{data.content}</span>
                <hr />
                <Link to={data.golink} className={styles.card_go}>
                    <span>Go</span>
                    <MdKeyboardArrowRight size={24} />
                </Link>
            </div>
        </div>
    )
}

export default Card