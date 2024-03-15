import styles from './disabled.module.css'
import PropTypes from 'prop-types'

export default function Disabled (props) {
    const {
        style,
    } = props;

    return (
        <div style={style} className={styles.disabled}>Disabled</div>
    );
}

Disabled.propTypes = {
    style: PropTypes.object,
}