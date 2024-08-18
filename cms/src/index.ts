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

      const updatedContestGroups = contestGroups.map(contestGroup => {
        if (contestGroup.state.currentStatus === 'playing') {
          contestGroup.state.currentTimeLeft--
        }
        if (contestGroup.state.currentTimeLeft === 0) {
          strapi.$io.raw({
            event: 'contest-setting:timerUpdate',
            rooms: [contestGroup.group.code]
          })
        }
        if (contestGroup.state.currentTimeLeft < 0) {
          contestGroup.state.currentTimeLeft = 0
        }
        return contestGroup
      })

      strapi.gameData.contestSettings.contestGroups = updatedContestGroups

      try {
        // const schema = strapi.entityService
        strapi.entityService.update('api::contest-setting.contest-setting', 1, {
          data: { contestGroups: updatedContestGroups }
        })
      } catch (err) {
        console.log(err)
      }
    }, 1000)
  },
};
