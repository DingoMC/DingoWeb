import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/admin";
import { cors_url } from "../../lib/cors_url";
import axios from "axios";
import CardsTable from "./cards";
import styles from "./styles.module.css"
import EventsTable from "./events";

export default function Admin () {
    const defaultTab = 'cards';
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('');
    const user = localStorage.getItem("token");
    const guest = (user === null);

    useEffect(() => {
        const href = window.location.href.split('#');
        if (href.length === 2) setActiveTab(href[1]);
        else setActiveTab(defaultTab);
    }, [])

    useEffect(() => {
        const handleIsAdmin = async () => {
            try {
                const url = cors_url("api/usersettings/isadmin")
                const token = localStorage.getItem("token")
                const response = await axios.get(url, {params: {token: token}})
                if (response.data.is_admin) setLoading(false);
                else window.location.replace('/');
            }
            catch (error) {
                console.log(error)
                window.location.replace('/');
            }
        }
        if (!guest) handleIsAdmin().catch(console.error);
        else window.location.replace('/');
    }, [])

    return (
        <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            {loading ?
                <div>Loading...</div> :
                <div className={styles.container}>
                    {activeTab === 'cards' && <CardsTable />}
                    {activeTab === 'events' && <EventsTable />}
                </div>
            }
        </AdminLayout>
    );
}