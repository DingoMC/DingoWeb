import styles from './latest.module.css'
import PropTypes from 'prop-types'

export default function Latest (props) {
    const {
        style,
    } = props;

    return (
        <div style={style} className={styles.latest}>Latest</div>
    );
}

Latest.propTypes = {
    style: PropTypes.object,
}