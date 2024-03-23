import Logo from "./Logo"
import styles from "./Top3.module.css"

function Top3(props) {
    const { leaderboard, setShowTop3 } = props

    const renderTop3 = leaderboard?.leaderboard?.map((top, index) => {
        if (index >= 3) return false

        let order, rank
        switch (index) {
            case 0:
                order = 'order-lg-2'
                rank = 1
                break;
            case 1:
                order = 'order-lg-1'
                rank = 2
                break;
            case 2:
                order = 'order-lg-3'
                rank = 3
                break;
            default:
                break;
        }
        return (
            <div key={top.user.id} className={`col-lg-4 ${order}`}>
                <div className={`${styles.top} ${styles[`top${rank}`]}`}>
                    <div className={styles.name}>{top.user?.name}</div>
                    <div className={styles.phone}>{top.user?.phone}</div>
                    <div className={styles.score}>Corrected answers: <strong>{top.totalCorrected}</strong></div>
                    <div className={styles.score}>Total score: <strong>{top.totalScore}</strong></div>
                    <div className={styles.position}>&nbsp;</div>
                </div>
            </div>
        )
    })

    return (
        <>
            <Logo />
            <div className={`mb-5 ${styles.top3Wrapper}`}>
                <div className={styles.title}>Leaderboard</div>
                <div className="row align-items-end mb-3">
                    {renderTop3}
                </div>
                <button className={`m-auto d-block ${styles.leaderboardBack}`} onClick={() => setShowTop3(false)}>Show Leaderboard</button>
            </div>
        </>
    )
}

export default Top3