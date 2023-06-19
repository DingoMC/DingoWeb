import Grid from "../grid"
import GridOpt from "../gridopt"
import Scoreboard from "../scoreboard"
import styles from "./styles.module.css"
import { useState, useEffect, useCallback } from "react"
import { emptyTileGrid, generateStartingState, hasChanged, isGameOver, moveDown, moveLeft, moveRight, moveUp } from "../../../lib/tile_array"
import GameOpt from "../gameopt"
import axios from "axios"
import { cors_url } from "../../../lib/cors_url"
import { useSelector, useDispatch } from "react-redux"
import { setUserSettings } from "../../../actions"
import NavBar2048 from "../navbar"
import { isGuest } from "../../../lib/guest"
import { getGameState, saveGameState } from "../../../lib/grid_state"
import Auto2048 from "../auto"

const Main2048 = () => {

    const settings = useSelector((state) => state.user_settings)
    const dispatch = useDispatch()

    const afterMoveInteraction = (r) => {
        let newState = r.tileArray
        if (r.score !== 0) setScore(score + r.score)
        setScoreOnLastFuse(r.score)
        if (hasChanged(newState, tileArray)) {
            saveGameState(score + r.score, newState, gridSize)
            setPrevState(tileArray)
        }
        setTileArray(newState)
    }

    const handleKeyDown = (event) => {
        if (!gameOver) {
            if (event.key === 'ArrowUp' || event.key === 'w') {
                let r = moveUp(tileArray, gridSize)
                afterMoveInteraction(r)
            }
            else if (event.key === 'ArrowDown' || event.key === 's') {
                let r = moveDown(tileArray, gridSize)
                afterMoveInteraction(r)
            }
            else if (event.key === 'ArrowLeft' || event.key === 'a') {
                let r = moveLeft(tileArray, gridSize)
                afterMoveInteraction(r)
            }
            else if (event.key === 'ArrowRight' || event.key === 'd') {
                let r = moveRight(tileArray, gridSize)
                afterMoveInteraction(r)
            }
        }
    }

    // Touch points (mobile only)
    const [touchStart, setTouchStart] = useState({x: null, y: null})
    const [touchEnd, setTouchEnd] = useState({x: null, y: null})
    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 45
    const onTouchStart = (e) => {
        setTouchEnd({x: null, y: null}) // otherwise the swipe is fired even with usual touch events
        setTouchStart({x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY})
    }
    const onTouchMove = (e) => setTouchEnd({x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY})
    const onTouchEnd = () => {
        if (gameOver) return
        if (!touchStart || !touchEnd) return
        const dX = touchStart.x - touchEnd.x
        const dY = touchStart.y - touchEnd.y
        // If no swipe
        if (Math.abs(dX) < minSwipeDistance && Math.abs(dY) < minSwipeDistance) return
        let r = {}
        // Check for swipe left right
        if (Math.abs(dX) > Math.abs(dY)) {
            if (dX < 0) r = moveRight(tileArray, gridSize)
            else r = moveLeft(tileArray, gridSize)
        }
        // Check for swipe up down
        else {
            if (dY < 0) r = moveDown(tileArray, gridSize)
            else r = moveUp(tileArray, gridSize)
        }
        afterMoveInteraction(r)
    }

    // Grid Size
    const [gridSize, setGridSize] = useState(4)
    // Game Over boolean
    const [gameOver, setGameOver] = useState(false)
    // Tile Array
    const [tileArray, setTileArray] = useState(emptyTileGrid(gridSize))
    // Previous state of Tile Array
    const [prevState, setPrevState] = useState([])
    // Player score
    const [score, setScore] = useState(0)
    // Player score on last move (fuse)
    const [scoreOnLastFuse, setScoreOnLastFuse] = useState(0)
    // Player's highscore
    const [highscore, setHighscore] = useState(0)
    const [highscoreDB, setHighscoreDB] = useState(0)

    // Auto States
    const [running, setRunning] = useState(false)
    const [aiWasEnabled, setAIWasEnabled] = useState(false)

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
        if (!isGuest()) handleSettingsGet().catch(console.error)
    }, [])

    useEffect(() => {
        if (!running) setAIWasEnabled(false)
        if (score > 0) setScore(0)
        if (scoreOnLastFuse > 0) setScoreOnLastFuse(0)
        let state = getGameState(gridSize)
        if (state === null) setTileArray(generateStartingState(gridSize))
        else {
            setScore(state.score)
            setTileArray(state.tileArray)
        }
        const handleScoreGet = async () => {
            try {
                const url = cors_url("api/2048/getscore")
                const token = localStorage.getItem("token")
                const response = await axios.get(url, {params: {token: token, grid: gridSize}})
                setHighscore(response.data.score)
                setHighscoreDB(response.data.score)
            }
            catch (error) {
                console.log(error)
            }
        }
        if (isGuest()) {
            let key = 'hs' + gridSize.toString();
            if (localStorage.getItem(key) !== null) setHighscore(localStorage.getItem(key))
            else setHighscore(0)
        }
        else handleScoreGet().catch(console.error)
    }, [gridSize])

    useEffect(() => {
        setGameOver(isGameOver(tileArray, gridSize))
    }, [tileArray])

    useEffect(() => {
        if (score > highscore && !aiWasEnabled) {
            setHighscore(score)
            if (isGuest()) {
                let key = 'hs' + gridSize.toString()
                localStorage.setItem(key, highscore)
            }
        }
    }, [score])

    useEffect(() => {
        const handleScoreUpdate = async () => {
            try {
                setHighscoreDB(highscore)
                const url = cors_url('api/2048/updatescore')
                const token = localStorage.getItem("token")
                await axios.post(url, {token: token, grid: gridSize, score: highscore})
            }
            catch (error) {
                console.log(error)
            }
        }
        if (gameOver && highscore > highscoreDB) {
            if (!aiWasEnabled) {
                if (isGuest()) {
                    let key = 'hs' + gridSize.toString()
                    localStorage.setItem(key, highscore)
                }
                else handleScoreUpdate().catch(console.error)
            }
            if (running) {
                setAIWasEnabled(false)
            }
        }
    }, [gameOver])

    return (
        <div className={`${styles.main_container} ${settings.darkMode && styles.dark}`} tabIndex={0} onKeyDown={handleKeyDown}>
            <NavBar2048 current={"main"} settings={settings} />
            <div className={styles.main}
                onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                <Scoreboard gridSize={gridSize} settings={settings} score={score} score_on_fuse={scoreOnLastFuse} highscore={highscore} />
                <div className={styles.setting_box}>
                    <GameOpt gridSize={gridSize}
                        restart={setTileArray}
                        prev={prevState}
                        setprev={setPrevState}
                        score={score}
                        setScore={setScore}
                        scoreOnLastFuse={scoreOnLastFuse}
                        setScoreOnLastFuse={setScoreOnLastFuse}
                        settings={settings}/>
                    <GridOpt currGridSize={gridSize} settings={settings} gridSizeChange={setGridSize} />
                </div>
                <Auto2048 
                    score={score}
                    setScore={setScore}
                    setScoreOnLastFuse={setScoreOnLastFuse}
                    setTileArray={setTileArray}
                    setAIWasEnabled={setAIWasEnabled}
                    tileArray={tileArray}
                    gridSize={gridSize}
                    running={running}
                    setRunning={setRunning}
                    gameOver={gameOver} />
                <div className={styles.wrapper}>
                    <Grid gridSize={gridSize} settings={settings} tileArray={tileArray}/>
                    {gameOver && <div className={styles.lost}>Game Over</div>}
                </div>
            </div>
        </div>
    )
}

export default Main2048