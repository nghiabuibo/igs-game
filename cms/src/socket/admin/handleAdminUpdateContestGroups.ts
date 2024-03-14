function handleAdminUpdateContestGroups({ strapi, io }, socket, newContestGroups) {
    try {
        strapi.gameData.contestSettings.contestGroups = newContestGroups
        io.raw({ event: 'contest-setting:update' })
        strapi.entityService.update('api::contest-setting.contest-setting', 1, {
            data: {
                contestGroups: newContestGroups
            }
        })
    } catch (err) {
        console.log(err)
    }
}

export default handleAdminUpdateContestGroups