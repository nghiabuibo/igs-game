import { jwtDecode } from "jwt-decode";
import getUserResult from "../utils/getUserResult";
import getUserContest from "../utils/getUserContest";
import getUserGameState from "../utils/getUserGameState";
import getUserLeaderboard from "../utils/getUserLeaderboard";
import gradeToGroup from "../utils/gradeToGroup";

interface decodedToken {
    id: number,
    iat: number,
    exp: number
}

interface Strapi {
    [key: string]: any
}

async function handleUserConnection({ strapi, io }, socket, isSyncedGameData) {
    try {
        const { token } = socket.handshake.auth
        const decoded = jwtDecode<decodedToken>(token)
        const { id: userID } = decoded

        // const user = await strapi.entityService.findOne('plugin::users-permissions.user', userID)
        const user = (strapi as Strapi).gameData.users.find(user => user.id === userID)
        const group = await gradeToGroup(user.grade)
        socket.user = user
        socket.group = group
        socket.join(group.code)

        const userResult = await getUserResult(socket)
        const userGameState = await getUserGameState(socket)

        if (userResult?.attempt !== userGameState?.currentAttempt) {
            socket.emit('connect_error_attempt', { message: `User already joined!` })
            return
        }

        const userContest = await getUserContest(socket)
        const leaderboard = await getUserLeaderboard(socket)

        const gamePacks = userContest ? userContest.gamePacks : []

        socket.emit('game:updateGamePacks', gamePacks)
        socket.emit('game:updateGameState', userGameState)
        socket.emit('game:updateResult', userResult)
        socket.emit('game:updateLeaderboard', leaderboard)

        if (isSyncedGameData) return
        
        // broadcast newly joined user to update leaderboard
        socket.to(group.code).emit('game:userJoined')
    } catch (err) {
        console.log(err)
    }
}

export default handleUserConnection