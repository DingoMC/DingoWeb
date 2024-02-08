import styles from './warning.module.css'
import PropTypes from 'prop-types'

export default function Warning (props) {
    const {
        style,
    } = props;

    return (
        <div style={style} className={styles.warning}>Warning</div>
    );
}

Warning.propTypes = {
    style: PropTypes.object,
}