import PropTypes from 'prop-types'
import styles from './version.module.css'
import { splitVersion } from '../../lib/vcs';

export default function Version (props) {
    const {
        version,
        style,
    } = props;

    const vsplit = splitVersion(version);

    return (
        <div style={style} className={`${styles.version} ${styles[vsplit.type]}`}>{version}</div>
    );
}

Version.propTypes = {
    version: PropTypes.string.isRequired,
    style: PropTypes.object,
}