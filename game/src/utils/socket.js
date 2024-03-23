import { io } from "socket.io-client"

const socket = io(process.env.REACT_APP_SOCKET_URL, {
    autoConnect: false,
    path: `${process.env.REACT_APP_SOCKET_PATH || ''}/socket.io`
})

export default socket