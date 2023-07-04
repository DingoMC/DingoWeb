import { breakpointColor } from '../../../lib/colors'
import { countFlags, flagField, generateStartingState, isBomb, isFlagged, isGameOver, isGameWin, isOpen, openField, valAt } from '../../../lib/minesweeper'
import NavBarMS from '../navbar'
import styles from './styles.module.css'
import { useEffect, useState, useRef } from 'react'

const MainMS = () => {
    const windowSize = useRef([window.innerWidth, window.innerHeight])
    const [gridSize, setGridSize] = useState({x: 9, y: 9})
    const [bombs, setBombs] = useState(10)
    const [flags, setFlags] = useState(10)
    const [flagMode, setFlagMode] = useState(false)
    const [minefield, setMinefield] = useState([])
    const [gameOver, setGameOver] = useState(false)
    const [gameWon, setGameWon] = useState(false)
    const [hasStarted, setHasStarted] = useState(false)
    const [difficulty, setDifficulty] = useState(1)
    const [time, setTime] = useState(0)

    // Timer
    useEffect (() => {
        if (!hasStarted) return
        const f = setInterval(() => {
            setTime((prev) => prev + 1)
        }, 1000)
        return () => clearInterval(f)
    }, [hasStarted])

    useEffect(() => {
        setMinefield(generateStartingState(gridSize, bombs))
        setDifficulty(calculateDifficulty())
    }, [gridSize, bombs])

    const calculateDifficulty = () => {
        /*let a = 1.0 * gridSize.x * gridSize.y
        return (81.0 * bombs) / (10.0 * a)*/
        let a = 1.0 * gridSize.x * gridSize.y
        let d_a = 3e-05 * Math.pow(a, 2.0) + 0.0198 * a - 1.0668
        let d_b = -0.0002 * Math.pow(bombs, 2.0) + 0.32 * bombs + -2.2052
        return (d_a + d_b) / 2.0
    }

    const handleOpen = (row, col) => {
        let newState = openField(minefield, gridSize, row, col)
        if (isGameOver(newState)) {
            setHasStarted(false)
            setGameOver(true)
        }
        setMinefield(newState)
    }

    const handleFlagging = (row, col) => {
        // Unflagging
        if (isFlagged(minefield, row, col)) {
            let newState = flagField(minefield, gridSize, row, col)
            setFlags(flags + 1)
            setMinefield(newState)
        }
        // Flagging
        else if (flags > 0) {
            let newState = flagField(minefield, gridSize, row, col)
            setFlags(flags - 1)
            setMinefield(newState)
            if (isGameWin(newState, bombs)) {
                setHasStarted(false)
                setGameWon(true)
            }
        }
    }

    const valDisplay = (row, col) => {
        if (isFlagged(minefield, row, col)) return <div className={styles.flagged} onContextMenu={() => {handleFlagging(row, col);}} onClick={() => {handleFlagging(row, col);}}><img src="ms_icons/flag.png" alt="F" title="Remove Flag" /></div>
        if (!isOpen(minefield, row, col)) return <div className={styles.closed} onContextMenu={() => {handleFlagging(row, col);}} onClick={() => {if (flagMode) handleFlagging(row, col); else handleOpen(row, col);}}></div>
        if (isBomb(minefield, row, col)) return <div className={`${styles.bomb} ${styles.open}`}><img src="ms_icons/bomb.png" alt="B" /></div>
        return <div className={`${styles.open} ${styles['f-' + valAt(minefield, row, col)]}`}>{valAt(minefield, row, col)}</div>
    }

    const generateCols = (row) => {
        let e = []
        let freeSpacing_w = windowSize.current[0] < 480 ? 60 : 120
        let freeSpacing_h = windowSize.current[0] < 480 ? 220 : 180
        let paddings_w = (32.0 / gridSize.y) * (gridSize.y + 1.0)
        let paddings_h = (32.0 / gridSize.x) * (gridSize.x + 1.0)
        let tileSizeMax_w = (windowSize.current[0] - freeSpacing_w - paddings_w) / gridSize.y
        let tileSizeMax_h = (windowSize.current[1] - freeSpacing_h - paddings_h) / gridSize.x
        let tileSize = Math.min(tileSizeMax_w, tileSizeMax_h)
        let tSizeStr = tileSize.toFixed(0) + 'px'
        let fSizeStr = (0.75 * tileSize).toFixed(0) + 'px'
        for (let i = 0; i < gridSize.y; i++) {
            e.push(<div key={i} style={{"width": tSizeStr, "height": tSizeStr, "fontSize": fSizeStr}} className={styles.tile}>{valDisplay(row, i)}</div>)
        }
        return e
    }

    const generateRows = () => {
        let e = []
        for (let i = 0; i < gridSize.x; i++) {
            e.push(<div key={i} className={styles.row}>{generateCols(i)}</div>)
        }
        return e;
    }

    const generateMenu = () => {
        if (gameWon) {
            return <div className={styles.lost}><span className={styles.menu_title}>You Win!</span>
            <span className={styles.menu_content}>Your time: {timeStr()}</span>
            <span className={styles.menu_content}>Press Play to play again</span></div>
        }
        if (gameOver) {
            return <div className={styles.lost}><span className={styles.menu_title}>Game Over</span>
            <span className={styles.menu_content}>Your time: {timeStr()}</span>
            <span className={styles.menu_content}>Press Play to play again</span></div>
        }
        if (!hasStarted) {
            return <div className={styles.lost}><span className={styles.menu_title}>Minesweeper</span>
            <span className={styles.menu_content}>Press Play to begin</span></div>
        }
        return ''
    }

    const handlePlay = () => {
        if (gameOver) setGameOver(false)
        if (gameWon) setGameWon(false)
        if (!hasStarted) setHasStarted(true)
        setMinefield(generateStartingState(gridSize, bombs))
        setFlags(bombs)
        setFlagMode(false)
        setTime(0)
    }
    
    const handleResign = () => {
        if (gameOver) setGameOver(false)
        if (gameWon) setGameWon(false)
        if (hasStarted) setHasStarted(false)
        setMinefield(generateStartingState(gridSize, bombs))
        setFlags(bombs)
        setFlagMode(false)
        setTime(0)
    }

    const minBombCount = (x, y) => {
        let f = x * y;
        return Math.floor(0.000230487 * f * f + 0.0937545 * f + 0.893663);
    }

    const maxBombCount = () => {
        return ((gridSize.x * gridSize.y) - Math.max(gridSize.x, gridSize.y))
    }

    const handleGridChange = (dx, dy) => {
        let x = gridSize.x + dx, y = gridSize.y + dy
        setGridSize({x: x, y: y})
        setBombs(minBombCount(x, y))
        setFlags(minBombCount())
    }

    const displayDifficulty = () => {
        let str = ''
        if (difficulty < 1) str = difficulty.toPrecision(2)
        else if (difficulty < 1000) str = difficulty.toPrecision(3)
        else str = difficulty.toFixed(0)
        let rgb = breakpointColor([{r:255,g:255,b:255,v:0},
            {r:85,g:255,b:255,v:1},
            {r:85,g:255,b:85,v:2},
            {r:255,g:255,b:85,v:4},
            {r:255,g:170,b:0,v:8},
            {r:255,g:50,b:50,v:16},
            {r:170,g:35,b:35,v:32},
            {r:170,g:35,b:170,v:64},
            {r:120,g:120,b:120,v:1024}], difficulty)
        let color = 'rgb(' + rgb.r.toFixed(0) + ',' + rgb.g.toFixed(0) + ',' + rgb.b.toFixed(0) + ')'
        return <span style={{color: color}} className={styles.info_box}>{str}</span>
    }

    const timeStr = () => {
        let str = ''
        let t = time, h = 0, m = 0, s = 0
        while (t >= 3600) {
            h++
            t -= 3600
        }
        while (t >= 60) {
            m++
            t -= 60
        }
        s = t
        if (h > 0) str += h.toString() + ':'
        if (m < 10) str += '0'
        str += m.toString() + ':'
        if (s < 10) str += '0'
        str += s.toString()
        return str
    }

    const displayTime = () => {
        /*
            255, 255, 255 --> 0
            85, 255, 255 --> 60
            85, 255, 85 --> 180
            255, 255, 85 --> 420
            255, 170, 0 --> 900
            255, 50, 50 --> 1860
            170, 35, 35 --> 3780
            170, 35, 170 --> 7620
            120, 120, 120 --> 86400
        */
        let rgb = breakpointColor([{r:255,g:255,b:255,v:0},
            {r:85,g:255,b:255,v:60},
            {r:85,g:255,b:85,v:180},
            {r:255,g:255,b:85,v:420},
            {r:255,g:170,b:0,v:900},
            {r:255,g:50,b:50,v:1860},
            {r:170,g:35,b:35,v:3780},
            {r:170,g:35,b:170,v:7620},
            {r:120,g:120,b:120,v:86400}], time)
        let color = 'rgb(' + rgb.r.toFixed(0) + ',' + rgb.g.toFixed(0) + ',' + rgb.b.toFixed(0) + ')'
        return <span style={{color: color}} className={styles.info_box}>{timeStr()}</span>
    }

    return (
        <div className={styles.main_container}>
            <NavBarMS current="main" settings={{darkMode: false}}/>
            <div className={styles.info}>
                <div>
                    <img src="svg/difficulty.svg" alt="D" />
                    {displayDifficulty()}
                </div>
                <div>
                    <img src="svg/time.svg" alt="T" />
                    {displayTime()}
                </div>
            </div>
            <div className={styles.options}>
                {hasStarted && <div className={styles.options}>
                    <button className={styles.resign} onClick={handleResign}>Resign</button>
                    <div className={styles.option_wrapper}>
                        <img title='Toggle flag mode' src={flagMode ? "ms_icons/flag-selected.png" : "ms_icons/flag.png"} alt="F" className={styles.selectable} onClick={() => {setFlagMode(!flagMode)}} />
                        <input type="text" disabled value={flags.toString()} />
                    </div>
                </div>}
                {!hasStarted && <div className={styles.options}>
                    <button className={styles.play} onClick={handlePlay}>Play</button>
                    <div className={styles.option_wrapper}>
                        <img src="ms_icons/double_arrow.png" alt="W" />
                        <input type="text" disabled value={gridSize.y.toString()}/>
                        <button className={styles.plus} disabled={gridSize.y === 30} onClick={() => {
                            if (gridSize.y < 30) handleGridChange(0, 1)
                        }}>+</button>
                        <button className={styles.minus} disabled={gridSize.y === 9} onClick={() => {
                            if (gridSize.y > 9) handleGridChange(0, -1)
                        }}>-</button>
                    </div>
                    <div className={styles.option_wrapper}>
                        <img src="ms_icons/double_arrow.png" className={styles.rotated} alt="H" />
                        <input type="text" disabled value={gridSize.x.toString()} />
                        <button className={styles.plus} disabled={gridSize.x === 16} onClick={() => {
                            if (gridSize.x < 16) handleGridChange(1, 0)
                        }}>+</button>
                        <button className={styles.minus} disabled={gridSize.x === 9} onClick={() => {
                            if (gridSize.x > 9) handleGridChange(-1, 0)
                        }}>-</button>
                    </div>
                    <div className={styles.option_wrapper}>
                        <img src="ms_icons/bomb.png" alt="F" />
                        <input type="text" disabled value={bombs.toString()} />
                        <button className={styles.plus} disabled={bombs === maxBombCount()} onClick={() => {
                            if (bombs < maxBombCount()) {
                                setBombs(bombs + 1)
                                setFlags(bombs + 1)
                            }
                        }}>+</button>
                        <button className={styles.minus} disabled={bombs === minBombCount(gridSize.x, gridSize.y)} onClick={() => {
                            if (bombs > minBombCount(gridSize.x, gridSize.y)) {
                                setBombs(bombs - 1)
                                setFlags(bombs - 1)
                            }
                        }}>-</button>
                    </div>
                </div>}
            </div>
            <div className={styles.main}>
                <div className={styles.wrapper}>
                    <div className={styles.grid} onContextMenu={(e) => {e.preventDefault()}}>{generateRows()}</div>
                    {generateMenu()}
                </div>
            </div>
        </div>
    )
}

export default MainMS