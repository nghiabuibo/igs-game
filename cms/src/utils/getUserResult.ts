import gradeToGroup from "../utils/gradeToGroup";
import getContestGroup from "./getContestGroup";

interface Strapi {
    [key: string]: any
}

async function getUserResult(socket) {
    const { user, group } = socket
    if (!user || !group) return

    const userID = user.id
    const groupID = group.id
    const contestGroup = await getContestGroup(groupID)

    // check if user has contest result, create new if not
    // return game data and user result
    const contestID = contestGroup?.contest?.id

    if (!contestID) return

    // const [existedResult] = await strapi.entityService.findMany('api::result.result', {
    //     filters: {
    //         $and: [
    //             { contest: { id: contestID } },
    //             { group: { id: groupID } },
    //             { user: { id: userID } }
    //         ],
    //     }
    // })

    const existedResult = socket.resultIndex
        ? (strapi as Strapi).gameData.results[socket.resultIndex]
        : (strapi as Strapi).gameData.results.find((result, index) => {
            if (result.contest?.id === contestID && result.group?.id === groupID && result.user?.id === userID) {
                socket.resultIndex = index
                return true
            }

            return false
        })

    if (existedResult) return existedResult

    const newResult = await strapi.entityService.create('api::result.result', {
        data: {
            contest: contestID,
            group: groupID,
            attempt: contestGroup.state?.currentAttempt,
            user: userID
        },
        populate: 'contest, group, user'
    });

    (strapi as Strapi).gameData.results.push(newResult)

    return newResult
}

export default getUserResult