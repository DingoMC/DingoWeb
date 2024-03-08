import styles from './fixed.module.css'
import PropTypes from 'prop-types'

export default function Fixed (props) {
    const {
        style,
    } = props;

    return (
        <div style={style} className={styles.fixed}>Fixed</div>
    );
}

Fixed.propTypes = {
    style: PropTypes.object,
}