import { getBugNameFromId } from '../../lib/vcs';
import styles from './bug.module.css';
import PropTypes from 'prop-types'

export default function Bug (props) {
    const {
        bugId,
        style,
        border = true,
        background = true,
    } = props;

    return (
        <div
            style={style}
            className={`${styles.bug} ${border && styles.withBorder} ${background && styles.withBackground}`}
        ><a href={'#' + bugId}>
            {getBugNameFromId(bugId)}
        </a>
        </div>
    );
}

Bug.propTypes = {
    bugId: PropTypes.string,
    style: PropTypes.object,
    border: PropTypes.bool,
    background: PropTypes.bool
}