import PropTypes from 'prop-types'
import styles from './styles.module.css'
import Version from '../../vcs/version';
import Warning from '../../vcs/warning';
import Latest from '../../vcs/latest';
import { splitVersion } from '../../../lib/vcs';
import { FaDownload } from "react-icons/fa6";

/**
 * Create App File Name. Add /apps/ before file name to create URL
 * @param {string} appName 
 * @param {string} version 
 */
const generateAppFileName = (appName, version) => {
    const sp = splitVersion(version);
    return appName + '-' + sp.type.toLowerCase() + '-' + sp.version + '.apk'
}

export default function SingleApp (props) {
    const {
        displayName,
        appName,
        description,
        latestVersion,
        allVersions,
        setDownloadFileName,
        setShowDownloadModal,
    } = props;

    return (
        <div className={styles.content}>
            <div className={styles.titleWrapper}>
                <div className={styles.displayName}>{displayName}</div>
                <Version version={latestVersion} />
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.description}>{description}</div>
                { splitVersion(latestVersion).type !== 'Release' &&
                    <div className={styles.betaWarning}>
                        <Warning />
                        <span>
                            This appliaction is still in {splitVersion(latestVersion).type} version, which is under development. It may contain various visual or functional bugs depending on the device used.
                        </span>
                    </div>
                }
                <button className={styles.downloadBtn} onClick={() => {
                    setDownloadFileName(generateAppFileName(appName, latestVersion))
                    setShowDownloadModal(true)
                }}>
                    <span>Download Latest</span>
                    <FaDownload />
                </button>
                <div className={styles.description}>Versions available for download:</div>
                <div className={styles.other}>
                    {
                        allVersions.map((v) => {
                            return (
                                <div key={v} className={styles.downloadOther}>
                                    { v === latestVersion && <Latest /> }
                                    <div>{generateAppFileName(appName, v)}</div>
                                    <button className={styles.minorDownloadBtn} onClick={() => {
                                        setDownloadFileName(generateAppFileName(appName, v))
                                        setShowDownloadModal(true)
                                    }}><FaDownload /></button>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}

SingleApp.propTypes = {
    displayName: PropTypes.string.isRequired,
    appName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    latestVersion: PropTypes.string.isRequired,
    allVersions: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    setDownloadFileName: PropTypes.func.isRequired,
    setShowDownloadModal: PropTypes.func.isRequired,
};