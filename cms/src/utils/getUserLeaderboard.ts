import getContestGroup from "./getContestGroup"
import getLeaderboard from "./getLeaderboard"
import gradeToGroup from "./gradeToGroup"

interface Strapi {
    [key: string]: any
}

async function getUserLeaderboard(socket) {
    const { user, group } = socket
    if (!user || !group) return

    const groupID = group.id
    const contestGroup = await getContestGroup(groupID)

    if (!contestGroup) return

    const leaderboard = getLeaderboard(contestGroup)
    return leaderboard
}

export default getUserLeaderboard