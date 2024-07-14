import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { aiMovePicker, countAON, TileArray, trueScore } from "../../../lib/ai_2048";
import { cors_url } from "../../../lib/cors_url";
import axios from "axios";

/**
 * 
 * @param {{tileArray: TileArray, aiMode: boolean, onMove: (move: 0 | 1 | 2 | 3) => void, onRestart: () => Promise<void>}} param0 
 * @returns 
 */
const Auto2048 = ({tileArray, aiMode, onMove, onRestart}) => {
    const modes = ['Random', 'Cycle', 'LURU', 'AI'];
    const [running, setRunning] = useState(false);
    const [mode, setMode] = useState(modes[3]);
    const [sequencer, setSequencer] = useState([]);
    const [seq, setSeq] = useState(0);
    const [delay, setDelay] = useState(250);
    const [firstLoad, setFirstLoad] = useState(true);

    // AI Testing
    const testingEnabled = false;
    const maxIterations = 202;
    const [iterations, setIterations] = useState(0);
    const [scores, setScores] = useState([]);

    useEffect(() => {
        const handleAutoRestart = async () => {
            console.log('Iteration: ', iterations + 1, '/', maxIterations, ', Score:', tileArray.score, ', Average: ', countAON([...scores, tileArray.score]));
            setScores((prevState) => [...prevState, tileArray.score]);
            setDelay(10);
            await onRestart();
            setIterations(iterations + 1);
            startHandler();
        }
        if (!running && testingEnabled && iterations < maxIterations && !firstLoad) {
            handleAutoRestart();
        }
    }, [running, testingEnabled])

    // AI Telemetry
    const telemetryEnabled = false;
    useEffect(() => {
        const handleSendTelemetry = async () => {
            try {
                const url = cors_url('api/ai_2048');
                await axios.post(url, {mode: mode, grid: tileArray.gridSize, score: tileArray.score, tile: tileArray.highestTile()});
            } catch (error) {
                console.error(error);
            }
            console.info(`[Telemetry] Mode: ${mode}, Grid: ${tileArray.gridSize}, Score: ${tileArray.score}, Highest Tile: ${tileArray.highestTile()} (${trueScore(tileArray.highestTile())})`);
            setDelay(150);
            await onRestart();
            startHandler();
        }
        if (!running && telemetryEnabled && !firstLoad) {
            handleSendTelemetry();
        }
    }, [running, telemetryEnabled])

    const startHandler = () => {
        setFirstLoad(false);
        setRunning(true);
        if (mode === modes[1]) {
            setSequencer([0, 1, 2, 3]);
            setSeq(0);
        }
        if (mode === modes[2]) {
            setSequencer([3, 0, 1, 0]);
            setSeq(0);
        }
    }

    const stopHandler = () => {
        setRunning(false);
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
        if (!aiMode) stopHandler();
    }, [aiMode])

    useEffect(() => {
        if (!running) return;
        const f = setInterval(() => {
            let moveNo = 0;
            switch (mode) {
                case (modes[0]): {
                    moveNo = tileArray.aiGetRandomMove();
                    break;
                }
                case (modes[1]): {
                    const mData = tileArray.aiGetSequenceMove(sequencer, seq);
                    if (mData == null) moveNo = null;
                    else {
                        moveNo = mData.moveID;
                        setSeq(mData.current);
                    }
                    break;
                }
                case (modes[2]): {
                    const mData = tileArray.aiGetSequenceMove(sequencer, seq);
                    if (mData == null) moveNo = null;
                    else {
                        moveNo = mData.moveID;
                        setSeq(mData.current);
                    }
                    break;
                }
                case (modes[3]): {
                    let testArray = new TileArray(tileArray.gridSize);
                    testArray.copyFrom(tileArray);
                    if (tileArray.gridSize === 2) moveNo = aiMovePicker(testArray, 8);
                    else if (tileArray.gridSize === 3) moveNo = aiMovePicker(testArray, 6);
                    else if (tileArray.gridSize < 7) moveNo = aiMovePicker(testArray, 5);
                    else if (tileArray.gridSize < 10) moveNo = aiMovePicker(testArray, 4);
                    else if (tileArray.gridSize < 15) moveNo = aiMovePicker(testArray, 3);
                    else moveNo = aiMovePicker(testArray, 2);
                    break;
                }
                default: {
                    moveNo = tileArray.aiGetRandomMove();
                    break
                }
            }
            if (moveNo !== null) onMove(moveNo);
            if (tileArray.gameOver) stopHandler();
        }, delay)
        return () => clearInterval(f);
    }, [tileArray, running, delay, mode])

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