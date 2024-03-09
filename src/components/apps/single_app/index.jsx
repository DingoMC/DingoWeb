import PropTypes from 'prop-types'
import styles from './styles.module.css'
import Version from '../../vcs/version';
import Warning from '../../vcs/warning';
import { splitVersion } from '../../../lib/vcs';
import { FaDownload } from "react-icons/fa6";
import React from 'react';
import DownloadOther from '../download_other';
import Buglist from '../buglist';
import Changelog from '../changelog';

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
        data,
        setDownloadFileName,
        setShowDownloadModal,
    } = props;

    return (
        <div className={styles.content}>
            <div className={styles.titleWrapper}>
                <div className={styles.displayName}>{data.displayName}</div>
                <Version version={data.latestVersion} />
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.description}>{data.description}</div>
                { splitVersion(data.latestVersion).type !== 'Release' &&
                    <div className={styles.betaWarning}>
                        <Warning />
                        <span>
                            This appliaction is still in {splitVersion(data.latestVersion).type} version, which is under development. It may contain various visual or functional bugs depending on the device used.
                        </span>
                    </div>
                }
                <button className={styles.downloadBtn} onClick={() => {
                    setDownloadFileName(generateAppFileName(data.name, data.latestVersion))
                    setShowDownloadModal(true)
                }}>
                    <span>Download Latest</span>
                    <FaDownload />
                </button>
                <DownloadOther
                    data={data}
                    generateAppFileName={generateAppFileName}
                    setDownloadFileName={setDownloadFileName}
                    setShowDownloadModal={setShowDownloadModal}
                />
                <Buglist data={data} />
                <Changelog data={data} />
            </div>
        </div>
    );
}

SingleApp.propTypes = {
    data: PropTypes.object.isRequired,
    setDownloadFileName: PropTypes.func.isRequired,
    setShowDownloadModal: PropTypes.func.isRequired,
};