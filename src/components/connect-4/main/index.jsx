import { useSelector, useDispatch } from "react-redux"
import styles from './styles.module.css'
import { useEffect, useState } from "react"
import { AIMoveSelector, gameState, generateStartingState, getRandomInt, updateGridByMove } from "../../../lib/connect4"
import NavBarC4 from "../navbar"
import axios from "axios"
import { cors_url } from "../../../lib/cors_url"
import { setUserSettings } from "../../../actions"
import { isGuest } from "../../../lib/guest"

const MainC4 = () => {
    const settings = useSelector((state) => state.user_settings)
    const dispatch = useDispatch()

    const [grid, setGrid] = useState([])
    const [player, setPlayer] = useState(1)
    const [state, setState] = useState(-1)
    const [mode, setMode] = useState(1)
    const [aiLevel, setAILevel] = useState(2)

    useEffect(() => {
        const handleSettingsGet = async () => {
            try {
                const url = cors_url("api/usersettings/settings")
                const token = localStorage.getItem("token")
                const response = await axios.get(url, {params: {token: token}})
                dispatch(setUserSettings(response.data.settings.dark_mode))
            }
            catch (error) {
                console.log(error)
            }
        }
        if (!isGuest()) {
            handleSettingsGet().catch(console.error)
        }
        setGrid(generateStartingState())
        setPlayer(getRandomInt(1, 2))
    }, [])

    useEffect(() => {
        if (grid.length > 0) setState(gameState(grid))
    }, [grid])

    useEffect(() => {
        if (mode === 1 && player === 2) {
            let move = AIMoveSelector(grid, aiLevel)
            handleMove(move.x, move.y)
        }
    }, [player])

    const handleMove = (x, y) => {
        setGrid(updateGridByMove(grid, player, x, y))
        if (player === 1) setPlayer(2)
        else setPlayer(1)
    }

    const handleRestart = () => {
        setGrid(generateStartingState())
        setPlayer(getRandomInt(1, 2))
    }

    const generateCols = (row) => {
        let elems = []
        for (let j = 0; j < grid[row].length; j++) {
            if (grid[row][j] === 'empty') {
                elems.push(
                    <div key={j}
                        className={styles.tile}
                        onClick={() => {
                            handleMove(row, j)
                        }}>
                        <div className={`${styles.circle} ${styles['empty' + player.toString()]}`}></div>
                    </div>
                );
            }
            else elems.push(<div key={j} className={styles.tile}><div className={`${styles.circle} ${styles[grid[row][j]]}`}></div></div>)
        }
        return elems
    }

    const generateRows = () => {
        let elems = []
        for (let i = 0; i < grid.length; i++) {
            elems.push(<div key={i} className={styles.row}>{generateCols(i)}</div>)
        }
        return elems
    }

    const generateMenu = () => {
        if (state === 0) {
            return (
                <div className={styles.menu}>
                    <div className={styles.menu_title}>It's a draw!</div>
                </div>
            )
        }
        if (state >= 1) {
            return (
                <div className={styles.menu}>
                    <div className={styles.menu_title}>Player {state.toString()} wins!</div>
                </div>
            )
        }
        return ''
    }

    return (
        <div className={`${styles.main_container} ${settings.darkMode ? styles.dark : ''}`}>
            <NavBarC4 current={'main'} settings={settings} />
            <div className={styles.main}>
                <div className={styles.options}>
                    <div>
                        <span>Mode:</span>
                        <select name="mode" id="mode" value={mode.toString()} onChange={(e) => {
                            setMode(parseInt(e.target.value))
                            handleRestart()
                        }}>
                            <option value="1">1 Player</option>
                            <option value="2">2 Players</option>
                        </select>
                    </div>
                    { mode === 1 && 
                        <div>
                            <span>AI Level:</span>
                            <select name="ailevel" id="ailevel" value={aiLevel.toString()} onChange={(e) => {
                                setAILevel(parseInt(e.target.value))
                                handleRestart()
                            }}>
                                <option value="1">Easy</option>
                                <option value="2">Normal</option>
                                <option value="3">Hard</option>
                            </select>
                        </div>
                    }
                    <button className={styles.btn_restart} onClick={handleRestart}>Restart</button>
                </div>
                <div className={styles.wrapper}>
                    <div className={styles.grid}>
                        <div className={styles['turn' + player.toString()]}>Player {player}'s turn</div>
                        {generateRows()}
                    </div>
                    {state >= 0 && generateMenu()}
                </div>
            </div>
        </div>
    )
}
export default MainC4
