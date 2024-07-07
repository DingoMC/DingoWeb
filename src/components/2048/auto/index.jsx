import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { TileArray } from "../../../lib/ai_2048";

/**
 * 
 * @param {{tileArray: TileArray, aiMode: boolean, onMove: (move: 0 | 1 | 2 | 3) => void}} param0 
 * @returns 
 */
const Auto2048 = ({tileArray, aiMode, onMove}) => {

    const modes = ['Random', 'Cycle', 'LURU'];
    const [running, setRunning] = useState(false);
    const [mode, setMode] = useState(modes[0])
    const [sequencer, setSequencer] = useState([])
    const [seq, setSeq] = useState(0)
    const [delay, setDelay] = useState(500)

    const startHandler = () => {
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