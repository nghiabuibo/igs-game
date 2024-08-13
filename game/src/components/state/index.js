import secondsToMinutesSeconds from '../../utils/secondsToMinutesSeconds'
import styles from './state.module.css'

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

    return (
        <div className="mb-3">
            <GameStateItem className={`text-center ${styles.group}`} value={userResult?.group?.name} />
            <GameStateItem className={styles.timer} label="TIME" value={secondsToMinutesSeconds(gameState?.currentTimeLeft ?? 0)} />
            <GameStateItem className={styles.score} label="SCORE" value={userResult?.totalScore ?? 0} />
        </div>
    )
}
export default GameState