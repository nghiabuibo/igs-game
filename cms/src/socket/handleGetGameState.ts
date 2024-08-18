import { jwtDecode } from "jwt-decode";
import getUserGameState from "../utils/getUserGameState";

interface decodedToken {
    id: number,
    iat: number,
    exp: number
}

async function handleGetGameState({ strapi, io }, socket) {
    try {
        const userGameState = await getUserGameState(socket)

        socket.emit('game:updateGameState', userGameState)
    } catch (err) {
        console.log(err)
    }
}

export default handleGetGameState