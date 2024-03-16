import gradeToGroup from "../utils/gradeToGroup";
import getContestGroup from "./getContestGroup";

interface Strapi {
    [key: string]: any
}

async function getUserResult(userID) {
    // const user = await strapi.entityService.findOne('plugin::users-permissions.user', userID)
    const [user] = (strapi as Strapi).gameData.users.filter(user => user.id === userID)

    if (!user) return

    // convert user grade to group and get group contest data from setting
    const group = await gradeToGroup(user.grade)
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

    const [existedResult] = (strapi as Strapi).gameData.results.filter(result => {
        return result.contest?.id === contestID
        && result.group?.id === groupID
        && result.user?.id === userID
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