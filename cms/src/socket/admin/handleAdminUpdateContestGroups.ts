import { pushUpdateQueue } from "../../queue"

function handleAdminUpdateContestGroups({ strapi, io }, socket, newContestGroups) {
    try {
        strapi.gameData.contestSettings.contestGroups = newContestGroups
        io.raw({ event: 'contest-setting:update' })
        // send to queue db update
        pushUpdateQueue('api::contest-setting.contest-setting', 1, {
            data: {
                contestGroups: newContestGroups
            }
        })
    } catch (err) {
        console.log(err)
    }
}

export default handleAdminUpdateContestGroups