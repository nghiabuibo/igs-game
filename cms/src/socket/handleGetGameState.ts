import { jwtDecode } from "jwt-decode";
import getUserGameState from "../utils/getUserGameState";

interface decodedToken {
    id: number,
    iat: number,
    exp: number
}

async function handleGetGameState({ strapi, io }, socket) {
    try {
        const { token } = socket.handshake.auth
        const decoded = jwtDecode<decodedToken>(token)
        const { id: userID } = decoded

        const userGameState = await getUserGameState(userID)

        socket.emit('game:updateGameState', userGameState)
    } catch (err) {
        console.log(err)
    }
}

export default handleGetGameState