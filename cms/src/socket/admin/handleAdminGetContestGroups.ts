import getContestGroups from "../../utils/getContestGroups"

async function handleAdminGetContestGroups({ strapi, io }, socket) {
    try {
        const contestGroups = await getContestGroups(true)
        contestGroups.forEach(contestGroup => {
            socket.join(contestGroup.group.code)
        });
        socket.emit('admin:updatedContestGroups', contestGroups)
    } catch (err) {
        console.log(err)
    }
}

export default handleAdminGetContestGroups