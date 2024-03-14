import getContestGroups from "./utils/getContestGroups";
import isDeepEqualArray from "./utils/isDeepEqualArray";
import syncGameData from "./utils/syncGameData";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // sync game data when starting server
    await syncGameData(strapi)

    // set contest groups game time countdown
    setInterval(async () => {
      const contestGroups = await getContestGroups()

      const clonedContestGroups = JSON.parse(JSON.stringify(contestGroups))
      const updatedContestGroups = clonedContestGroups.map(contestGroup => {
        const updatedContestGroup = { ...contestGroup }
        if (updatedContestGroup.state.currentStatus === 'playing') {
          updatedContestGroup.state.currentTimeLeft--
        }
        if (updatedContestGroup.state.currentTimeLeft <= 0) {
          updatedContestGroup.state.currentTimeLeft = 0
        }
        return updatedContestGroup
      })

      // only update timer if there are changes
      if (isDeepEqualArray(contestGroups, updatedContestGroups)) return
      strapi.gameData.contestSettings.contestGroups = updatedContestGroups

      try {
        // const schema = strapi.entityService
        strapi.$io.raw({ event: 'contest-setting:timerUpdate' })
        strapi.entityService.update('api::contest-setting.contest-setting', 1, {
          data: { contestGroups: updatedContestGroups }
        })
      } catch (err) {
        console.log(err)
      }
    }, 1000)
  },
};
