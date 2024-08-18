import { jwtDecode } from "jwt-decode";
import getUserLeaderboard from "../utils/getUserLeaderboard";

interface decodedToken {
    id: number,
    iat: number,
    exp: number
}

async function handleGetLeaderboard({ strapi, io }, socket) {
    try {
        const leaderboard = await getUserLeaderboard(socket)

        socket.emit('game:updateLeaderboard', leaderboard)
    } catch (err) {
        console.log(err)
    }
}

export default handleGetLeaderboard