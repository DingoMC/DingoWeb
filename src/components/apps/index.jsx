import { useState } from 'react';
import MainLayout from '../../layouts/main';
import SingleApp from './single_app';
import styles from './styles.module.css'
import DownloadModal from './download_modal';

export default function Apps () {
    const [downloadFileName, setDownloadFileName] = useState('');
    const [showDownloadModal, setShowDownloadModal] = useState(false);

    return (
        <>
            <MainLayout current='apps'>
                <div>
                    <SingleApp
                        displayName='Dingo SC Timer App'
                        appName='dingo_sc_app'
                        description='Dingo Speedclimbing timer app for Android. Allows manual time measurements, USB SC System connectivity, adding participants, custom sequences and persisting results.'
                        latestVersion='Beta 0.4.0'
                        allVersions={['Beta 0.4.0']}
                        setDownloadFileName={setDownloadFileName}
                        setShowDownloadModal={setShowDownloadModal}
                    />
                </div>
            </MainLayout>
            { showDownloadModal &&
                <DownloadModal
                    filename={downloadFileName}
                    setShowDownloadModal={setShowDownloadModal}
                />
            }
        </>
    );
}