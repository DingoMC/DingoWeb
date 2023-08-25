import { useState, useEffect } from "react"
import { moveLeft, autoRandomMovePicker, moveUp, moveDown, moveRight, autoCycleMoverPicker, autoLURUMoverPicker, autoAIMovePicker, countAON, generateStartingState, isGameOver } from "../../../lib/tile_array"
import styles from "./styles.module.css"

const Auto2048 = ({score, setScore, setScoreOnLastFuse, setTileArray, setAIWasEnabled, tileArray, gridSize, running, setRunning}) => {

    const modes = ['Random', 'Cycle', 'LURU', 'AI-1', 'AI-2', 'AI-3', 'AI-4', 'AI-5']
    const [mode, setMode] = useState(modes[0])
    const [sequencer, setSequencer] = useState([])
    const [seq, setSeq] = useState(0)
    const [delay, setDelay] = useState(500)

    // AI Test mode states
    const [aiTestMode, setAITestMode] = useState({enabled: false, iter: 1, max_iter: 52, scores: [], average: 0.00})

    const afterMoveInteraction = (r) => {
        let newState = r.tileArray
        if (r.score !== 0) setScore(score + r.score)
        setScoreOnLastFuse(r.score)
        setTileArray(newState)
    }

    const startHandler = () => {
        setRunning(true)
        setAIWasEnabled(true)
        if (mode === modes[1]) {
            setSequencer([0, 1, 2, 3])
            setSeq(0)
        }
        if (mode === modes[2]) {
            setSequencer([3, 0, 1, 0])
            setSeq(0)
        }
    }

    const stopHandler = () => {
        if (aiTestMode.enabled) {
            setRunning(false)
            let new_iter = aiTestMode.iter + 1
            let new_scores = aiTestMode.scores
            new_scores.push(score)
            let new_average = countAON(new_scores)
            console.log(`Iteration: ${aiTestMode.iter}/${aiTestMode.max_iter}, Score: ${score}, AOn: ${new_average}`)
            setAITestMode({...aiTestMode, iter: new_iter, scores: new_scores, average: new_average})
            if (new_iter > aiTestMode.max_iter) {
                setAITestMode({...aiTestMode, scores: [], average: 0, iter: 1})
            }
            else {
                setScore(0)
                setScoreOnLastFuse(0)
                setTileArray(generateStartingState(gridSize))
                setRunning(true)
            }
        }
        else setRunning(false)
    }

    useEffect(() => {
        if (mode === modes[1]) {
            setSequencer([0, 1, 2, 3])
            setSeq(0)
        }
        if (mode === modes[2]) {
            setSequencer([3, 0, 1, 0])
            setSeq(0)
        }
    }, [mode])

    useEffect(() => {
        if (!running) return
        const f = setInterval(() => {
            let moveNo = 0
            switch (mode) {
                case (modes[0]): {
                    moveNo = autoRandomMovePicker(tileArray, gridSize)
                    break
                }
                case (modes[1]): {
                    let cdata = autoCycleMoverPicker(tileArray, gridSize, sequencer, seq)
                    moveNo = cdata.moveID
                    setSeq(cdata.seq)
                }
                case (modes[2]): {
                    let cdata = autoLURUMoverPicker(tileArray, gridSize, sequencer, seq)
                    moveNo = cdata.moveID
                    setSeq(cdata.seq)
                }
                case (modes[3]): {
                    moveNo = autoAIMovePicker(1, tileArray, gridSize)
                    break
                }
                case (modes[4]): {
                    moveNo = autoAIMovePicker(2, tileArray, gridSize)
                    break
                }
                case (modes[5]): {
                    moveNo = autoAIMovePicker(3, tileArray, gridSize)
                    break
                }
                case (modes[6]): {
                    moveNo = autoAIMovePicker(4, tileArray, gridSize)
                    break
                }
                case (modes[7]): {
                    moveNo = autoAIMovePicker(5, tileArray, gridSize)
                    break
                }
            }
            let r = {};
            switch (moveNo) {
                case -1: break;
                case 0: { r = moveUp(tileArray, gridSize); break; }
                case 1: { r = moveRight(tileArray, gridSize); break; }
                case 2: { r = moveDown(tileArray, gridSize); break; }
                case 3: { r = moveLeft(tileArray, gridSize); break; }
                default: { console.error("Unknown moveID"); break; }
            }
            let gameOver = isGameOver(tileArray, gridSize)
            if (moveNo !== -1) afterMoveInteraction(r)
            if (gameOver) stopHandler()
        }, delay)
        return () => clearInterval(f)
    }, [tileArray, gridSize, running, delay, mode])

    const handleModeChange = (e) => {
        setMode(e.target.value)
    }

    return (
        <div className={styles.main}>
            <span>Mode</span>
            <span>Delay</span>
            <button className={styles.plus} disabled={running} onClick={startHandler}>Start</button>
            <select disabled={running} value={mode} onChange={handleModeChange}>
                {modes.map((option) => (
                    <option value={option} key={option}>{option}</option>
                ))}
            </select>
            <div className={styles.delay_grid}>
                <input type="text" disabled value={delay.toString()} />
                <button className={styles.minus} disabled={delay > 9975} onClick={() => {
                    if (delay <= 9975) setDelay(delay + 25)
                }}>&#8679;</button>
                <button className={styles.plus} disabled={delay < 50} onClick={() => {
                    if (delay >= 50) setDelay(delay - 25)
                }}>&#8681;</button>
            </div>
            <button className={styles.minus} disabled={!running} onClick={stopHandler}>Stop</button>
        </div>
    )
}

export default Auto2048