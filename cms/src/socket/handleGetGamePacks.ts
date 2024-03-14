import { jwtDecode } from "jwt-decode";
import getUserContest from "../utils/getUserContest";

interface decodedToken {
    id: number,
    iat: number,
    exp: number
}

async function handleGetGamePacks({ strapi, io }, socket) {
    try {
        const { token } = socket.handshake.auth
        const decoded = jwtDecode<decodedToken>(token)
        const { id: userID } = decoded
        
        const userContest = await getUserContest(userID)
        const gamePacks = userContest ? userContest.gamePacks : []

        socket.emit('game:updateGamePacks', gamePacks)
    } catch (err) {
        console.log(err)
    }
}

export default handleGetGamePacks