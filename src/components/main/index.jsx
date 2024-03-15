import { useEffect, useState } from "react"
import { cors_url } from "../../lib/cors_url"
import axios from "axios"
import Card from "../card"
import styles from "./styles.module.css"
import MainLayout from "../../layouts/main"

const hostname = process.env.REACT_APP_HOSTNAME;
const localname = process.env.REACT_APP_HOSTNAME;
const port = process.env.REACT_APP_API_PORT;

const Main = () => {
    const [cardData, setCardData] = useState([])

    useEffect (() => {
        const handleCardsGet = async () => {
            try {
                const url = cors_url("api/cards")
                const response = await axios.get(url)
                setCardData(response.data.cards.filter((c) => c.disabled === false));
            }
            catch (error) {
                console.log(error)
                if (cors_url().includes('192.168.1')) window.location.replace('https://' + localname + ':' + port)
                else window.location.replace('https://' + hostname + ':' + port)
            }
        }
        handleCardsGet().catch(console.error)
    }, [])

    const displayCards = () => {
        let cards = []
        for (let i = 0; i < cardData.length; i++) {
            cards.push(<Card key={i} data={cardData[i]}></Card>)
        }
        return cards
    }

    return (
        <MainLayout current="main">
            <div className={styles.title}>DingoMC Projects List</div>
            <div className={styles.card_wrapper}>
                {displayCards()}
            </div>
        </MainLayout>
    )
}

export default Main