import PropTypes from 'prop-types'
import styles from './styles.module.css'
import { breakpointColor, colorToRGB } from '../../lib/colors';

export default function ProgressBar (props) {
    const {
        percentage
    } = props;
    return (
        <div className={styles.wrapper}>
            <div
                style={{width: percentage.toFixed(2) + '%', backgroundColor: colorToRGB(breakpointColor([{r: 3, g: 86, b: 252, v: 0}, {r: 4, g: 176, b: 58, v: 100}], percentage))}}
                className={styles.inner}
            ></div>
        </div>
    );
}

ProgressBar.propTypes = {
    percentage: PropTypes.number.isRequired,
}