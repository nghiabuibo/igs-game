import syncGameData from "../../utils/syncGameData"

async function handleAdminSyncGameData({ strapi, io }, socket) {
    try {
        await syncGameData(strapi)
        io.raw({ event: 'admin:syncedGameData' })
    } catch (err) {
        console.log(err)
    }
}

export default handleAdminSyncGameData