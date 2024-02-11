import PropTypes from 'prop-types'
import styles from './styles.module.css'
import Latest from '../../vcs/latest';
import { FaDownload } from 'react-icons/fa6';
import { useState } from 'react';

export default function DownloadOther (props) {
    const {
        data,
        generateAppFileName,
        setDownloadFileName,
        setShowDownloadModal,
    } = props;

    const [show, setShow] = useState(false);

    return (
        <>
            <div className={styles.downloadOther}>
                <div className={styles.description}>Versions available for download:</div>
                { show ?
                    <div onClick={() => setShow(false)} className={styles.hide}>{"[Hide]"}</div> :
                    <div onClick={() => setShow(true)} className={styles.show}>{"[Show]"}</div>
                }
            </div>
            {show &&
                <div className={styles.other}>
                    {
                        data.allVersions.filter((v) => !data.unavailable.includes(v)).map((v) => {
                            return (
                                <div key={v} className={styles.downloadOther}>
                                    { v === data.latestVersion && <Latest /> }
                                    <div>{generateAppFileName(data.name, v)}</div>
                                    <button className={styles.minorDownloadBtn} onClick={() => {
                                        setDownloadFileName(generateAppFileName(data.name, v))
                                        setShowDownloadModal(true)
                                    }}><FaDownload /></button>
                                </div>
                            );
                        }).reverse()
                    }
                </div>
            }
        </>
    )
}

DownloadOther.propTypes = {
    data: PropTypes.object.isRequired,
    generateAppFileName: PropTypes.func.isRequired,
    setDownloadFileName: PropTypes.func.isRequired,
    setShowDownloadModal: PropTypes.func.isRequired,
};