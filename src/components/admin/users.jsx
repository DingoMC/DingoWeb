import styles from "./cards.module.css"
import axios from "axios"
import { cors_url } from "../../lib/cors_url"
import { useEffect, useState } from "react"

export default function UsersTable () {
    const cleanRow = {firstName: '', lastName: '', email: '', role: 0};
    const [userData, setUserData] = useState([]);
    const [addData, setAddData] = useState(cleanRow);
    const [editData, setEditData] = useState(cleanRow);
    const [editIndex, setEditIndex] = useState(-1);
    const [loading, setLoading] = useState(true);

    useEffect (() => {
        const handleUsersGet = async () => {
            try {
                const url = cors_url("api/users");
                const response = await axios.get(url);
                setUserData(response.data.users);
            }
            catch (error) {
                console.log(error)
            }
            setLoading(false);
        }
        handleUsersGet().catch(console.error)
    }, [])

    useEffect(() => {
        if (editIndex === -1) setEditData(cleanRow);
        else setEditData(userData[editIndex]);
    }, [editIndex])

    const handleAdd = async () => {
        setLoading(true);
        try {
            const url = cors_url("api/users");
            const response = await axios.post(url, addData);
            setUserData([...userData, response.data.data]);
            setAddData(cleanRow);
        }
        catch (error) {
            console.log(error)
        }
        setLoading(false);
    }

    const handleDelete = async (idx) => {
        setLoading(true);
        try {
            const url = cors_url("api/users/" + userData[idx]["_id"]);
            const response = await axios.delete(url);
            if (response.data.status) setUserData((prevState) => prevState.filter((el, i) => i !== idx));
        }
        catch (error) {
            console.log(error)
        }
        setLoading(false);
    }

    const handleEdit = async () => {
        setLoading(true);
        try {
            const url = cors_url("api/users/" + userData[editIndex]["_id"]);
            const response = await axios.put(url, editData);
            if (response.data.status) setUserData((prevState) => prevState.map((el, i) => {
                if (i !== editIndex) return el;
                return response.data.data;
            }));
            setEditIndex(-1);
        }
        catch (error) {
            console.log(error)
        }
        setLoading(false);
    }

    const generateRows = () => {
        let elems = [];
        elems.push(
            <tr className={styles.addRow}>
                <td className={styles.col120}>
                    <input type="text" value={addData.firstName} 
                        disabled={loading}
                        onInput={(e) => setAddData({...addData, firstName: e.target.value})} />
                </td>
                <td className={styles.col120}>
                    <input type="text" value={addData.lastName} 
                        disabled={loading}
                        onInput={(e) => setAddData({...addData, lastName: e.target.value})} />
                </td>
                <td className={styles.col200}>
                    <input type="text" value={addData.email} 
                        disabled={loading}
                        onInput={(e) => setAddData({...addData, email: e.target.value})} />
                </td>
                <td className={styles.col80}>
                    <div className={styles.center}>
                        <input type="checkbox" checked={addData.role === 1}
                            disabled={loading}
                            onChange={() => setAddData({...addData, role: (addData.role === 1 ? 0 : 1)})} />
                    </div>
                </td>
                <td className={styles.col80}>
                    <div className={styles.center}>
                        <button className={styles.iconButton} disabled={loading} onClick={handleAdd} >
                            <img src="/svg/add.svg" />
                        </button>
                        <button className={styles.iconButton} disabled={loading} onClick={() => setAddData(cleanRow)}>
                            <img src="/svg/clear.svg" />
                        </button>
                    </div>
                </td>
            </tr>
        );
        for (let i = 0; i < userData.length; i++) {
            if (editIndex === i) {
                elems.push(
                    <tr className={styles.editRow}>
                        <td className={styles.col120}>
                            <input type="text" value={editData.firstName} 
                                disabled={loading}
                                onInput={(e) => setEditData({...editData, firstName: e.target.value})} />
                        </td>
                        <td className={styles.col120}>
                            <input type="text" value={editData.lastName} 
                                disabled={loading}
                                onInput={(e) => setEditData({...editData, lastName: e.target.value})} />
                        </td>
                        <td className={styles.col200}>
                            <input type="text" value={editData.email} 
                                disabled={loading}
                                onInput={(e) => setEditData({...editData, email: e.target.value})} />
                        </td>
                        <td className={styles.col80}>
                            <div className={styles.center}>
                                <input type="checkbox" checked={addData.role === 1}
                                    disabled={loading}
                                    onChange={() => setEditData({...editData, role: (addData.role === 1 ? 0 : 1)})} />
                            </div>
                        </td>
                        <td className={styles.col80}>
                            <div className={styles.center}>
                                <button className={styles.iconButton} disabled={loading} onClick={handleEdit} >
                                    <img src="/svg/check.svg" />
                                </button>
                                <button className={styles.iconButton} disabled={loading} onClick={() => setEditIndex(-1)}>
                                    <img src="/svg/cross.svg" />
                                </button>
                            </div>
                        </td>
                    </tr>
                );
            } else {
                elems.push(
                    <tr>
                        <td className={styles.col120}>{userData[i].firstName}</td>
                        <td className={styles.col120}>{userData[i].lastName}</td>
                        <td className={styles.col200}>{userData[i].email}</td>
                        <td className={styles.col80}>
                            <div className={styles.center}>
                                {userData[i].role === 1 ? 'Yes' : 'No'}
                            </div>
                        </td>
                        <td className={styles.col80}>
                            <div className={styles.center}>
                                <button className={styles.iconButton} disabled={loading}
                                    onClick={() => setEditIndex(i)}
                                >
                                    <img src="/svg/edit.svg" />
                                </button>
                                {userData[i].role === 0 &&
                                    <button className={styles.iconButton} disabled={loading}
                                        onClick={() => handleDelete(i)}
                                    >
                                        <img src="/svg/delete.svg" />
                                    </button>
                                }
                            </div>
                        </td>
                    </tr>
                );
            }
        }
        return elems;
    }

    return (
        <div className={styles.wrapper} id="users">
            <table className={styles.main}>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {generateRows()}
                </tbody>
            </table>
        </div>
    );
}