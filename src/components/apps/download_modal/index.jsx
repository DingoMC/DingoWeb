import PropTypes from 'prop-types'
import useDownloader from 'react-use-downloader';
import { formatTime } from '../../../lib/time';
import styles from './styles.module.css'
import ProgressBar from '../../progress';

export default function DownloadModal (props) {
    const {
        filename,
        setShowDownloadModal,
    } = props;
    const fileUrl = '/apps/' + filename;
    const { size, elapsed, percentage, download, cancel, error, isInProgress } = useDownloader();

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div>File: {filename}</div>
                <div>Downloaded: {(percentage * size/100000000.0).toFixed(2)} / {(size/1000000.0).toFixed(2)} MB</div>
                <div>Progress: {percentage}%</div>
                <div>Time Elapsed: {formatTime(elapsed)}</div>
                {error && <div>Error while downloading: {JSON.stringify(error)}</div>}
                <ProgressBar percentage={percentage} />
                <div className={styles.modalFooter}>
                    { isInProgress ?
                        <button className={`${styles.modalBtn} ${styles.cancel}`} onClick={() => cancel()}>Cancel</button> :
                        <button className={`${styles.modalBtn} ${styles.start}`} onClick={() => download(fileUrl, filename)}>Start</button>
                    }
                    { !isInProgress &&
                        <button className={`${styles.modalBtn} ${styles.close}`} onClick={() => setShowDownloadModal(false)}>Close</button>
                    }
                </div>
            </div>
        </div>
    )
}

DownloadModal.propTypes = {
    filename: PropTypes.string,
    setShowDownloadModal: PropTypes.func.isRequired,
}