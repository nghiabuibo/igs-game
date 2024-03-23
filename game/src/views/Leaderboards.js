import Logo from "./Logo"

import styles from './Leaderboards.module.css'

function Leaderboards(props) {
    const { leaderboard, setShowTop3 } = props

    const renderLeaderboard = leaderboard?.leaderboard?.map((entry, index) => {
        if (index >= 50) return false

        return (
            <div key={entry.id} className={`d-flex align-items-center gap-3 mb-3 ${styles.leaderboardEntry}`}>
                <div className={`${styles.leaderboardRanking}`}>{index + 1}.</div>
                <div className={`${styles.leaderboardInfo}`}>
                    <div className={`${styles.leaderboardName}`}>{entry.user?.name}</div>
                    <small className={`fst-italic fw-normal ${styles.leaderboardCorrected}`}>Corrected: {entry.totalCorrected} - Score: {entry.totalScore}</small>
                </div>
            </div>
        )
    })

    return (
        <>
            <Logo />

            {
                leaderboard?.contest?.titleImage?.url &&
                <div className={`row`}>
                    <img className={`img-fluid ${styles.titleImage}`} src={process.env.REACT_APP_CMS_URL + leaderboard.contest.titleImage.url} alt="Contest Title" />
                </div>
            }

            <div className={`text-uppercase mb-5 ${styles.leaderboardWrapper}`}>

                {
                    leaderboard?.group?.name &&

                    <div className={`${styles.leaderboardGroup}`}>
                        {leaderboard?.group.name}
                    </div>
                }

                {
                    renderLeaderboard
                        ?
                        <div className={`mb-5 ${styles.leaderboardRankingWrapper}`}>
                            {renderLeaderboard}
                        </div>
                        :
                        <div className="text-center text-white mt-5">
                            <div>No leaderboard data</div>
                        </div>
                }

                <button className={styles.showTop3} onClick={() => setShowTop3(true)}>Show Top 3</button>

            </div>
        </>
    )
}

export default Leaderboards