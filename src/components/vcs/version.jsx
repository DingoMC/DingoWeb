import PropTypes from 'prop-types'
import styles from './version.module.css'
import { splitVersion } from '../../lib/vcs';

export default function Version (props) {
    const {
        version,
        style,
        border = true,
        background = true,
    } = props;

    const vsplit = splitVersion(version);

    return (
        <div
            style={style}
            className={`${styles.version} ${styles[vsplit.type]} ${border && styles.withBorder} ${background && styles.withBackground}`}
        >{version}</div>
    );
}

Version.propTypes = {
    version: PropTypes.string.isRequired,
    style: PropTypes.object,
}