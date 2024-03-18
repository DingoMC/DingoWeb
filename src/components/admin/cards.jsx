import styles from "./cards.module.css"
import axios from "axios"
import { cors_url } from "../../lib/cors_url"
import { useEffect, useState } from "react"
import Disabled from "../vcs/disabled";
import Enabled from "../vcs/enabled";

export default function CardsTable () {
    const cleanRow = {title: '', content: '', golink: '/', version: '', vtype: '', disabled: true};
    const [cardData, setCardData] = useState([]);
    const [addData, setAddData] = useState(cleanRow);
    const [editData, setEditData] = useState(cleanRow);
    const [editIndex, setEditIndex] = useState(-1);
    const [loading, setLoading] = useState(true);

    useEffect (() => {
        const handleCardsGet = async () => {
            try {
                const url = cors_url("api/cards");
                const response = await axios.get(url);
                setCardData(response.data.cards);
            }
            catch (error) {
                console.log(error)
            }
            setLoading(false);
        }
        handleCardsGet().catch(console.error)
    }, [])

    useEffect(() => {
        if (editIndex === -1) setEditData(cleanRow);
        else setEditData(cardData[editIndex]);
    }, [editIndex])

    const handleAdd = async () => {
        setLoading(true);
        try {
            const url = cors_url("api/cards");
            const response = await axios.post(url, addData);
            setCardData([...cardData, response.data.data]);
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
            const url = cors_url("api/cards/" + cardData[idx]["_id"]);
            const response = await axios.delete(url);
            if (response.data.status) setCardData((prevState) => prevState.filter((el, i) => i !== idx));
        }
        catch (error) {
            console.log(error)
        }
        setLoading(false);
    }

    const handleEdit = async () => {
        setLoading(true);
        try {
            const url = cors_url("api/cards/" + cardData[editIndex]["_id"]);
            const response = await axios.put(url, editData);
            if (response.data.status) setCardData((prevState) => prevState.map((el, i) => {
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
                    <input type="text" value={addData.title} 
                        disabled={loading}
                        onInput={(e) => setAddData({...addData, title: e.target.value})} />
                </td>
                <td className={styles.col360}>
                    <textarea rows={3} value={addData.content} 
                        disabled={loading}
                        onInput={(e) => setAddData({...addData, content: e.target.value})}></textarea>
                </td>
                <td className={styles.col120}>
                    <input type="text" value={addData.golink} 
                        disabled={loading}
                        onInput={(e) => setAddData({...addData, golink: e.target.value})} />
                </td>
                <td className={styles.col80}>
                    <input type="text" value={addData.version} 
                        disabled={loading}
                        onInput={(e) => setAddData({...addData, version: e.target.value})} />
                </td>
                <td className={styles.col80}>
                    <input type="text" value={addData.vtype}
                        disabled={loading}
                        onInput={(e) => setAddData({...addData, vtype: e.target.value})} />
                </td>
                <td className={styles.col80}>
                    <div className={styles.center}>
                        <input type="checkbox" checked={!addData.disabled}
                            disabled={loading}
                            onChange={() => setAddData({...addData, disabled: !addData.disabled})} />
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
        for (let i = 0; i < cardData.length; i++) {
            if (editIndex === i) {
                elems.push(
                    <tr className={styles.editRow}>
                        <td className={styles.col120}>
                            <input type="text" value={editData.title} 
                                disabled={loading}
                                onInput={(e) => setEditData({...editData, title: e.target.value})} />
                        </td>
                        <td className={styles.col360}>
                            <textarea rows={3} value={editData.content} 
                                disabled={loading}
                                onInput={(e) => setEditData({...editData, content: e.target.value})}></textarea>
                        </td>
                        <td className={styles.col120}>
                            <input type="text" value={editData.golink} 
                                disabled={loading}
                                onInput={(e) => setEditData({...editData, golink: e.target.value})} />
                        </td>
                        <td className={styles.col80}>
                            <input type="text" value={editData.version} 
                                disabled={loading}
                                onInput={(e) => setEditData({...editData, version: e.target.value})} />
                        </td>
                        <td className={styles.col80}>
                            <input type="text" value={editData.vtype}
                                disabled={loading}
                                onInput={(e) => setEditData({...editData, vtype: e.target.value})} />
                        </td>
                        <td className={styles.col80}>
                            <div className={styles.center}>
                                <input type="checkbox" checked={!editData.disabled}
                                    disabled={loading}
                                    onChange={() => setEditData({...editData, disabled: !editData.disabled})} />
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
                        <td className={styles.col120}>{cardData[i].title}</td>
                        <td className={styles.col360}>{cardData[i].content}</td>
                        <td className={styles.col120}>{cardData[i].golink}</td>
                        <td className={styles.col80}>{cardData[i].version}</td>
                        <td className={styles.col80}>{cardData[i].vtype}</td>
                        <td className={styles.col80}>
                            <div className={styles.center}>
                                {cardData[i].disabled ? <Disabled /> : <Enabled />}
                            </div>
                        </td>
                        <td className={styles.col80}>
                            <div className={styles.center}>
                                <button className={styles.iconButton} disabled={loading}
                                    onClick={() => setEditIndex(i)}
                                >
                                    <img src="/svg/edit.svg" />
                                </button>
                                <button className={styles.iconButton} disabled={loading}
                                    onClick={() => handleDelete(i)}
                                >
                                    <img src="/svg/delete.svg" />
                                </button>
                            </div>
                        </td>
                    </tr>
                );
            }
        }
        return elems;
    }

    return (
        <div className={styles.wrapper} id="cards">
            <table className={styles.main}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Link</th>
                        <th>Version</th>
                        <th>V-Type</th>
                        <th>Status</th>
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