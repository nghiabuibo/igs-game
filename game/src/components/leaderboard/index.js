import styles from './leaderboard.module.css'

function Leaderboard(props) {
    const { leaderboard } = props

    const renderLeaderboard = leaderboard.leaderboard?.map((result, index) => {
        if (index >= 10) return false

        return (
            <tr key={result.id}>
                <td className='text-center'>{index + 1}</td>
                <td>{result.user?.name}</td>
                <td className='text-center'>{result.totalCorrected ?? 0}</td>
                <td className='text-center'>{result.totalScore ?? 0}</td>
            </tr>
        )
    })

    return (
        leaderboard &&
        <div className={styles.leaderboardWrapper}>
            {/* <p>{leaderboard.contest?.name}</p>
            <p>{leaderboard.group?.name}</p> */}
            <h4 className='fw-bold text-white text-center mt-2 mb-3'>LEADERBOARD</h4>

            <table className={styles.leaderboardTable}>
                <thead>
                    <tr>
                        <th className='text-center'>#</th>
                        <th>Name</th>
                        <th className='text-center'>✓</th>
                        <th className='text-center'>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        renderLeaderboard ??
                        <tr>
                            <td className="text-center" colSpan={4}>No Leaderboard Data!</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Leaderboard