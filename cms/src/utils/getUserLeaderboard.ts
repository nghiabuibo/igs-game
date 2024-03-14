import getContestGroup from "./getContestGroup"
import getLeaderboard from "./getLeaderboard"
import gradeToGroup from "./gradeToGroup"

interface Strapi {
    [key: string]: any
}

async function getUserLeaderboard(userID) {
    // const user = await strapi.entityService.findOne('plugin::users-permissions.user', userID)
    const [user] = (strapi as Strapi).gameData.users.filter(user => user.id === userID)

    if (!user) return

    const group = await gradeToGroup(user.grade)
    const groupID = group.id
    const contestGroup = await getContestGroup(groupID)

    if (!contestGroup) return

    const leaderboard = getLeaderboard(contestGroup)
    return leaderboard
}

export default getUserLeaderboard