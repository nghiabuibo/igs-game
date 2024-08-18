import { useEffect, useState } from 'react'
import secondsToMinutesSeconds from '../../utils/secondsToMinutesSeconds'
import styles from './state.module.css'
import { GAME_STATUS } from '../../utils/defines'

const GameStateItem = (props) => {
    const { label, value, className } = props

    return (
        <div className={`d-flex align-items-center justify-content-between line-height-1 gap-2 ${styles.itemWrapper} ${className}`}>
            {
                label != null &&
                <span className={`${styles.itemLabel}`}>{label}: </span>
            }
            {
                value != null &&
                <span className={`m-auto text-uppercase ${styles.itemValue}`}>{value}</span>
            }
        </div>
    )
}

function GameState(props) {
    const { gameState, userResult } = props
    const [timeLeft, setTimeLeft] = useState(gameState?.currentTimeLeft || 0)

    useEffect(() => {
        // reset timer on change
        setTimeLeft(gameState?.currentTimeLeft || 0)

        // timer countdown
        const timerInterval = setInterval(() => {
            setTimeLeft(prevTimeLeft => {
                let nextTimeLeft = prevTimeLeft
                if (gameState?.currentStatus === GAME_STATUS.playing) {
                    nextTimeLeft--
                }
                if (nextTimeLeft <= 0) {
                    clearInterval(timerInterval)
                    return 0
                }
                
                return nextTimeLeft;
            })
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [gameState?.currentTimeLeft, gameState?.currentStatus])

    return (
        <div className="mb-3">
            <GameStateItem className={`text-center ${styles.group}`} value={userResult?.group?.name} />
            <GameStateItem className={styles.timer} label="TIME" value={secondsToMinutesSeconds(timeLeft)} />
            <GameStateItem className={styles.score} label="SCORE" value={userResult?.totalScore || 0} />
        </div>
    )
}
export default GameState