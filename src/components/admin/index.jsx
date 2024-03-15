import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/admin";
import { cors_url } from "../../lib/cors_url";
import axios from "axios";
import CardsTable from "./cards";
import styles from "./styles.module.css"

export default function Admin () {
    const [loading, setLoading] = useState(true);
    const user = localStorage.getItem("token");
    const guest = (user === null);

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
        <AdminLayout>
            {loading ?
                <div>Loading...</div> :
                <div className={styles.container}>
                    <CardsTable />
                </div>
            }
        </AdminLayout>
    );
}