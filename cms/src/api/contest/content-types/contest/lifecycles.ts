
export default {
    async afterCreate(event) {
        const { result } = event
        await strapi.services['api::contest.contest'].generateWordFindPuzzle(result.id)
    },
    async afterUpdate(event) {
        const { result } = event
        await strapi.services['api::contest.contest'].generateWordFindPuzzle(result.id)
    },
};