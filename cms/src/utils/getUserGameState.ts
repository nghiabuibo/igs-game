import getContestGroup from "./getContestGroup"
import gradeToGroup from "./gradeToGroup"

interface Strapi {
    [key: string]: any
}

async function getUserGameState(socket) {
    const { user, group } = socket
    if (!user || !group) return

    const groupID = group.id
    const contestGroup = await getContestGroup(groupID)
    return contestGroup?.state
}

export default getUserGameState