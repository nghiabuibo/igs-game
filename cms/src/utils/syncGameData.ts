async function syncGameData(strapi) {
    // sync contests
    const contestPopulate = 'gamePacks.questions.illustration, gamePacks.questions.answers.media, gamePacks.coverImage'
    const contests = await strapi.entityService.findMany('api::contest.contest', { populate: contestPopulate }) ?? []

    // sync groups
    const groups = await strapi.entityService.findMany('api::group.group') ?? []

    // sync results
    const resultPopulate = 'contest, group, user'
    const results = await strapi.entityService.findMany('api::result.result', { populate: resultPopulate }) ?? []

    // sync users
    const users = await strapi.entityService.findMany('plugin::users-permissions.user') ?? []

    // sync contest settings
    const contestSettingPopulate = ['contestGroups.group', 'contestGroups.contest.titleImage', 'contestGroups.state', 'contestGroups.contest.gamePacks.questions']
    const contestSettings = await strapi.entityService.findMany('api::contest-setting.contest-setting', { populate: contestSettingPopulate }) ?? []

    strapi.gameData = {
        contests,
        groups,
        results,
        users,
        contestSettings
    }
}

export default syncGameData