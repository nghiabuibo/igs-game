import { getMediaUrl } from '../utils/media'
import CoverImage from './CoverImage'
import Logo from './Logo'
import styles from './Waiting.module.css'

function Waiting(props) {
    const { gameState, currentGamePack, leaderboard } = props

    return (
        gameState.currentStatus === 'waiting' || !currentGamePack?.coverImage
            ?
            <>
                <Logo />
                <div className="col-12">
                    <div className={`m-auto d-flex align-items-center justify-content-center text-uppercase mt-2 mb-3 ${styles.titleWrapper}`}>
                        {currentGamePack?.name}
                    </div>
                    <div className={`fw-bold ${styles.playerCount}`}>{leaderboard?.leaderboard?.length ?? 0}</div>
                    <div className={`text-uppercase text-center fw-bold text-white ${styles.player}`}>PLAYERS ARE READY!</div>
                </div>
            </>
            :
            <CoverImage src={getMediaUrl(currentGamePack.coverImage)} />

    )
}

export default Waiting