import Grid from "../grid"
import GridOpt from "../gridopt"
import Scoreboard from "../scoreboard"
import styles from "./styles.module.css"
import { useState, useEffect } from "react"
import GameOpt from "../gameopt"
import axios from "axios"
import { cors_url } from "../../../lib/cors_url"
import { useSelector, useDispatch } from "react-redux"
import { setUserSettings } from "../../../actions"
import NavBar2048 from "../navbar"
import { isGuest } from "../../../lib/guest"
import { TileArray } from "../../../lib/ai_2048";

const Main2048 = () => {
    const settings = useSelector((state) => state.user_settings);
    const dispatch = useDispatch();
    // Touch points (mobile only)
    const [touchStart, setTouchStart] = useState({x: null, y: null});
    const [touchEnd, setTouchEnd] = useState({x: null, y: null});
    // Tile Array object
    const [tileArray, setTileArray] = useState(new TileArray(4));
    // Player's highscore
    const [highscoreDB, setHighscoreDB] = useState(0);
    // Auto States
    const [aiMode, setAIMode] = useState(false);

    /**
     * Handle move hook
     * @param {TileArray} prevState 
     * @param {0 | 1 | 2 | 3} move
     * @returns new tile array
     */
    const handleMove = (prevState, move) => {
        let newState = new TileArray(prevState.gridSize);
        newState.copyFrom(prevState);
        newState.move(move);
        return newState;
    }

    /**
     * 
     * @param {number} gridSize 
     */
    const handleScoreGet = async (gridSize) => {
        try {
            const url = cors_url("api/2048/getscore");
            const token = localStorage.getItem("token");
            const response = await axios.get(url, {params: {token: token, grid: gridSize}});
            let newState = new TileArray(gridSize);
            newState.generateStartingState();
            newState.newHighscore = parseInt(response.data.score);
            setHighscoreDB(response.data.score);
            setTileArray(newState);
        }
        catch (error) {
            console.log(error);
        }
    }

    const onRestart = async () => {
        if (aiMode) {
            let newState = new TileArray(tileArray.gridSize);
            newState.generateStartingState();
            setTileArray(newState);
            return;
        }
        if (isGuest()) {
            let newState = new TileArray(tileArray.gridSize);
            newState.generateStartingState();
            let key = 'hs' + tileArray.gridSize.toString();
            if (localStorage.getItem(key) !== null) newState.newHighscore = parseInt(localStorage.getItem(key));
            setTileArray(newState);
        }
        else handleScoreGet(tileArray.gridSize).catch(console.error);
    }

    const onUndo = () => {
        if (tileArray.canUndo()) {
            let newState = new TileArray(tileArray.gridSize);
            newState.copyFrom(tileArray);
            newState.undo();
            setTileArray(newState);
        }
    }

    /**
     * 
     * @param {number} gridSize 
     */
    const onGridSizeChange = (gridSize) => {
        if (aiMode) {
            let newState = new TileArray(gridSize);
            newState.generateStartingState();
            setTileArray(newState);
            return;
        }
        if (isGuest()) {
            let newState = new TileArray(gridSize);
            newState.generateStartingState();
            let key = 'hs' + gridSize.toString();
            if (localStorage.getItem(key) !== null) newState.newHighscore = parseInt(localStorage.getItem(key));
            setTileArray(newState);
        }
        else handleScoreGet(gridSize).catch(console.error)
    }

    /**
     * 
     * @param {0 | 1 | 2 | 3} move 
     */
    const onMove = (move) => {
        setTileArray((prevState) => handleMove(prevState, move));
    }

    const aiToggle = () => {
        setAIMode(!aiMode);
    }

    const handleKeyDown = (event) => {
        if (!tileArray.gameOver) {
            if (event.key === 'ArrowUp' || event.key === 'w') onMove(0);
            else if (event.key === 'ArrowDown' || event.key === 's') onMove(2);
            else if (event.key === 'ArrowLeft' || event.key === 'a') onMove(3);
            else if (event.key === 'ArrowRight' || event.key === 'd') onMove(1);
        }
    }

    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 45;
    const onTouchStart = (e) => {
        setTouchEnd({x: null, y: null}) // otherwise the swipe is fired even with usual touch events
        setTouchStart({x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY})
    }
    const onTouchMove = (e) => setTouchEnd({x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY})
    const onTouchEnd = () => {
        if (tileArray.gameOver) return
        if (!touchStart || !touchEnd) return
        const dX = touchStart.x - touchEnd.x
        const dY = touchStart.y - touchEnd.y
        // If no swipe
        if (Math.abs(dX) < minSwipeDistance && Math.abs(dY) < minSwipeDistance) return
        // Check for swipe left right
        if (Math.abs(dX) > Math.abs(dY)) {
            if (dX < 0) onMove(1);
            else onMove(3);
        }
        // Check for swipe up down
        else {
            if (dY < 0) onMove(2);
            else onMove(0);
        }
    }

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
            handleSettingsGet().catch(console.error);
            handleScoreGet(tileArray.gridSize).catch(console.error);
        } else {
            setTileArray((prevState) => {
                prevState.generateStartingState();
                return prevState;
            });
        }
    }, [])

    useEffect(() => {
        const handleScoreUpdate = async () => {
            try {
                setHighscoreDB(tileArray.highscore);
                const url = cors_url('api/2048/updatescore');
                const token = localStorage.getItem("token");
                await axios.post(url, {token: token, grid: tileArray.gridSize, score: tileArray.highscore});
            }
            catch (error) {
                console.log(error);
            }
        }
        if (isGuest()) {
            let key = 'hs' + tileArray.gridSize.toString();
            const hs = localStorage.getItem(key);
            if (hs === null) localStorage.setItem(key, tileArray.highscore);
            else if (parseInt(hs) < tileArray.highscore) localStorage.setItem(key, tileArray.highscore);
        }
        if (!aiMode && tileArray.gameOver && tileArray.highscore > highscoreDB) {
            if (isGuest()) {
                let key = 'hs' + tileArray.gridSize.toString();
                localStorage.setItem(key, tileArray.highscore);
            }
            else handleScoreUpdate().catch(console.error);
        }
    }, [tileArray])

    useEffect(() => {
        if (aiMode) {
            let newState = new TileArray(tileArray.gridSize);
            newState.generateStartingState();
            setTileArray(newState);
        } else if (isGuest()) {
            let newState = new TileArray(tileArray.gridSize);
            newState.generateStartingState();
            let key = 'hs' + tileArray.gridSize.toString();
            if (localStorage.getItem(key) !== null) newState.newHighscore = parseInt(localStorage.getItem(key));
            setTileArray(newState);
        }
        else handleScoreGet(tileArray.gridSize).catch(console.error)
    }, [aiMode])

    return (
        <div className={`${styles.main_container} ${settings.darkMode && styles.dark}`} tabIndex={0} onKeyDown={handleKeyDown}>
            <NavBar2048 current={"main"} settings={settings} />
            <div className={styles.main}
                onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                <Scoreboard tileArray={tileArray} settings={settings} aiMode={aiMode} onMove={onMove} onRestart={onRestart} />
                <div className={styles.setting_box}>
                    <GameOpt onRestart={onRestart}
                        onUndo={onUndo}
                        onAI={aiToggle}
                        tileArray={tileArray}
                        settings={settings}
                        aiMode={aiMode}
                    />
                    <GridOpt currGridSize={tileArray.gridSize} settings={settings} gridSizeChange={onGridSizeChange} />
                </div>
                <div className={styles.wrapper}>
                    <Grid settings={settings} tileArray={tileArray}/>
                    {tileArray.gameOver && <div className={styles.lost}>Game Over</div>}
                </div>
            </div>
        </div>
    )
}

export default Main2048