import styles from './enabled.module.css'
import PropTypes from 'prop-types'

export default function Enabled (props) {
    const {
        style,
    } = props;

    return (
        <div style={style} className={styles.enabled}>Enabled</div>
    );
}

Enabled.propTypes = {
    style: PropTypes.object,
}