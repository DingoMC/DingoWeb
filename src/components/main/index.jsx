import { useEffect, useState } from "react"
import { cors_url } from "../../lib/cors_url"
import axios from "axios"
import Card from "../card"
import styles from "./styles.module.css"
import NavBar from "../nav"
import Footer from "../footer"

const Main = () => {
    const [cardData, setCardData] = useState([])

    useEffect (() => {
        const handleCardsGet = async () => {
            try {
                const url = cors_url("api/cards")
                const response = await axios.get(url)
                setCardData(response.data.cards)
            }
            catch (error) {
                console.log(error)
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
        <div className={styles.main}>
            <NavBar current="main" />
            <div className={styles.container}>
                <div className={styles.title}>DingoMC Projects List</div>
                <div className={styles.card_wrapper}>
                    {displayCards()}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Main