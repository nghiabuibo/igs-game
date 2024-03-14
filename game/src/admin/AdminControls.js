import { useEffect, useState } from "react"
import socket from "../utils/socket"
import handleRequestError from "../utils/handleRequestError"
import Logo from "../views/Logo"
import { toast } from "react-toastify"

function AdminControls(props) {
    const { adminToken, setAdminToken } = props
    const [contestGroups, setContestGroups] = useState([])
    const [time, setTime] = useState(null)
    const defaultGameStatusGameChange = 'paused'
    const defaultGameStatusQuestionChange = 'playing'
    const defaultGameStatusAttemptChange = 'waiting'

    // handle socket authen
    useEffect(() => {
        socket.auth = {
            strategy: 'apiToken',
            token: adminToken
        }
        socket.connect()

        return () => {
            socket.disconnect()
        }
    }, [adminToken])

    useEffect(() => {
        socket.on('connect_error', (err) => {
            handleRequestError(err)
            localStorage.setItem('admin_token', '')
            setAdminToken('')
        })

        return () => {
            socket.off('connect_error')
        }
    }, [setAdminToken])

    useEffect(() => {
        socket.on('connect', () => {
            socket.emit('admin:getContestGroups')
        })

        socket.on('admin:updatedContestGroups', setContestGroups)

        socket.on('admin:syncedGameData', () => {
            toast.success('Game data synced!', { theme: 'colored' })
            socket.emit('admin:getContestGroups')
        })

        socket.on('contest-setting:update', () => {
            socket.emit('admin:getContestGroups')
        })

        socket.on('contest-setting:timerUpdate', () => {
            socket.emit('admin:getContestGroups')
        })

        return () => {
            socket.off('connect')
            socket.off('admin:updatedContestGroups')
            socket.off('admin:syncedGameData')
            socket.off('contest-setting:update')
            socket.off('contest-setting:timerUpdate')
        }
    }, [])

    const handleChangeGame = (contestGroupID, action) => {
        const newContestGroups = [...contestGroups]
        for (const i in newContestGroups) {
            const newContestGroup = newContestGroups[i]
            if (newContestGroup.id !== contestGroupID) continue;

            let value = newContestGroup.state.currentGamePack
            switch (action) {
                case 'prev':
                    value -= 1
                    if (value < 0) {
                        value = 0
                    } else {
                        // only change game status if game changed
                        newContestGroup.state.currentStatus = defaultGameStatusGameChange
                    }
                    break;
                case 'next':
                    value += 1
                    // restrict max game
                    if (value > newContestGroup.contest.gamePacks.length - 1) {
                        value = newContestGroup.contest.gamePacks.length - 1
                    } else {
                        // only change game status if game changed
                        newContestGroup.state.currentStatus = defaultGameStatusGameChange
                    }
                    break;
                default:
                    break;
            }
            newContestGroup.state.currentGamePack = value
            newContestGroup.state.currentQuestion = 0
            newContestGroup.state.currentTimeLeft = newContestGroup.contest.gamePacks[value]?.questions?.[0]?.timeLimit ?? null
            break;
        }
        socket.emit('admin:updateContestGroups', newContestGroups)
    }

    const handleChangeQuestion = (contestGroupID, action) => {
        const newContestGroups = [...contestGroups]
        for (const i in newContestGroups) {
            const newContestGroup = newContestGroups[i]
            if (newContestGroup.id !== contestGroupID) continue;

            const currentGamePack = newContestGroup.state.currentGamePack
            let value = newContestGroup.state.currentQuestion
            switch (action) {
                case 'prev':
                    value -= 1
                    if (value < 0) {
                        value = 0
                    } else {
                        // only change game status if question changed
                        newContestGroup.state.currentStatus = defaultGameStatusQuestionChange
                    }
                    break;
                case 'next':
                    value += 1
                    // restrict max question
                    const questionLength = newContestGroup.contest.gamePacks[currentGamePack]?.questions?.length
                    if (value > questionLength - 1) {
                        value = questionLength - 1
                    } else {
                        // only change game status if question changed
                        newContestGroup.state.currentStatus = defaultGameStatusQuestionChange
                    }
                    break;
                default:
                    break;
            }
            newContestGroup.state.currentQuestion = value
            newContestGroup.state.currentTimeLeft = newContestGroup.contest.gamePacks[currentGamePack]?.questions?.[value]?.timeLimit ?? null
            break;
        }
        socket.emit('admin:updateContestGroups', newContestGroups)
    }

    const handleChangeAttempt = (contestGroupID, action) => {
        const newContestGroups = [...contestGroups]
        for (const i in newContestGroups) {
            const newContestGroup = newContestGroups[i]
            if (newContestGroup.id !== contestGroupID) continue;

            let value = newContestGroup.state.currentAttempt
            switch (action) {
                case 'prev':
                    value -= 1
                    if (value < 1) {
                        value = 1
                    } else {
                        // only change game status if attempt changed
                        newContestGroup.state.currentStatus = defaultGameStatusAttemptChange
                    }
                    break;
                case 'next':
                    value += 1
                    // only change game status if attempt changed
                    newContestGroup.state.currentStatus = defaultGameStatusAttemptChange
                    break;
                default:
                    break;
            }
            newContestGroup.state.currentAttempt = value
            newContestGroup.state.currentQuestion = 0
            newContestGroup.state.currentGamePack = 0
            newContestGroup.state.currentTimeLeft = newContestGroup.contest.gamePacks[0]?.questions?.[0]?.timeLimit ?? null
            break;
        }
        socket.emit('admin:updateContestGroups', newContestGroups)
    }

    const handleChangeTime = (contestGroupID) => {
        const newContestGroups = [...contestGroups]
        for (const i in newContestGroups) {
            const newContestGroup = newContestGroups[i]
            if (newContestGroup.id !== contestGroupID) continue;

            newContestGroup.state.currentTimeLeft = time
            break;
        }
        socket.emit('admin:updateContestGroups', newContestGroups)
    }

    const handleChangeStatus = (contestGroupID, action) => {
        const newContestGroups = [...contestGroups]
        for (const i in newContestGroups) {
            const newContestGroup = newContestGroups[i]
            if (newContestGroup.id !== contestGroupID) continue;

            newContestGroup.state.currentStatus = action
            break;
        }
        socket.emit('admin:updateContestGroups', newContestGroups)
    }

    const handleSyncGameData = () => {
        socket.emit('admin:syncGameData')
    }

    const renderControls = contestGroups.map(contestGroup => {
        return (
            <table key={contestGroup.id} className="table table-bordered text-center mb-5">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Contest</th>
                        <th>Group</th>
                        <th>Current Game</th>
                        <th>Current Question</th>
                        <th>Current Attempt</th>
                        <th>Current Time Left</th>
                        <th>Current Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{contestGroup.id}</td>
                        <td>{contestGroup.contest?.name}</td>
                        <td>{`${contestGroup.group?.name} (Grade: ${contestGroup.group?.grades})`}</td>
                        <td>
                            {contestGroup.state?.currentGamePack + 1}
                            <br /><br />
                            <button className="btn btn-primary me-2 mb-2" onClick={() => handleChangeGame(contestGroup.id, 'prev')}>Back</button>
                            <button className="btn btn-primary me-2 mb-2" onClick={() => handleChangeGame(contestGroup.id, 'next')}>Next</button>
                        </td>
                        <td>
                            {contestGroup.state?.currentQuestion + 1}
                            <br /><br />
                            <button className="btn btn-primary me-2 mb-2" onClick={() => handleChangeQuestion(contestGroup.id, 'prev')}>Back</button>
                            <button className="btn btn-primary me-2 mb-2" onClick={() => handleChangeQuestion(contestGroup.id, 'next')}>Next</button>
                        </td>
                        <td>
                            {contestGroup.state?.currentAttempt}
                            <br /><br />
                            <button className="btn btn-primary me-2 mb-2" onClick={() => handleChangeAttempt(contestGroup.id, 'prev')}>Back</button>
                            <button className="btn btn-primary me-2 mb-2" onClick={() => handleChangeAttempt(contestGroup.id, 'next')}>Next</button>
                        </td>
                        <td>
                            {contestGroup.state?.currentTimeLeft}
                            <br /><br />
                            <div className="d-md-flex gap-2 align-items-center">
                                <input className="form-control mb-2" style={{ minWidth: '100px' }} type="number" name="time" onChange={(e) => setTime(e.target.value)} />
                                <button className="btn btn-primary flex-shrink-0 mb-2" onClick={() => handleChangeTime(contestGroup.id)}>Set Time</button>
                            </div>
                        </td>
                        <td>
                            {contestGroup.state?.currentStatus}
                            <br /><br />
                            <button className="btn btn-secondary me-2 mb-2" onClick={() => handleChangeStatus(contestGroup.id, 'waiting')}>Wait</button>
                            <button className="btn btn-success me-2 mb-2" onClick={() => handleChangeStatus(contestGroup.id, 'playing')}>Start</button>
                            <button className="btn btn-secondary me-2 mb-2" onClick={() => handleChangeStatus(contestGroup.id, 'paused')}>Pause</button>
                            <button className="btn btn-danger me-2 mb-2" onClick={() => handleChangeStatus(contestGroup.id, 'ended')}>End</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    })

    return (
        <>
            <Logo />
            <div className="container overflow-auto">
                {renderControls}
                <div className="text-center">
                    <button className="btn btn-primary" onClick={handleSyncGameData}>Sync Game Data</button>
                </div>
            </div>
        </>

    )
}

export default AdminControls