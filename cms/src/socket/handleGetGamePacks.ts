import { jwtDecode } from "jwt-decode";
import getUserContest from "../utils/getUserContest";

interface decodedToken {
    id: number,
    iat: number,
    exp: number
}

async function handleGetGamePacks({ strapi, io }, socket) {
    try {
        const userContest = await getUserContest(socket)
        const gamePacks = userContest ? userContest.gamePacks : []

        socket.emit('game:updateGamePacks', gamePacks)
    } catch (err) {
        console.log(err)
    }
}

export default handleGetGamePacks