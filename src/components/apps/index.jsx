import { useEffect, useState } from 'react';
import MainLayout from '../../layouts/main';
import SingleApp from './single_app';
import styles from './styles.module.css'
import DownloadModal from './download_modal';
import { cors_url } from '../../lib/cors_url';
import axios from 'axios';

export default function Apps () {
    const [downloadFileName, setDownloadFileName] = useState('');
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [appData, setAppData] = useState([]);

    useEffect (() => {
        const handleAppsGet = async () => {
            try {
                const url = cors_url("api/apps")
                const response = await axios.get(url)
                setAppData(response.data.apps)
            }
            catch (error) {
                console.log(error)
                if (cors_url().includes('192.168.1')) window.location.replace('https://192.168.1.200:8001')
                else window.location.replace('https://dingomc.net:8001')
            }
        }
        handleAppsGet().catch(console.error)
    }, [])


    return (
        <>
            <MainLayout current='apps'>
                <div>
                    {
                        appData.map((a) => {
                            return (
                                <SingleApp
                                    key={a.id}
                                    data={a}
                                    setDownloadFileName={setDownloadFileName}
                                    setShowDownloadModal={setShowDownloadModal}
                                />
                            )
                        })
                    }
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