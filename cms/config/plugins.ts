import handleAdminGetContestGroups from "../src/socket/admin/handleAdminGetContestGroups";
import handleAdminUpdateContestGroups from "../src/socket/admin/handleAdminUpdateContestGroups";
import handleAdminSyncGameData from "../src/socket/admin/handleAdminSyncGameData";
import handleGameAnswer from "../src/socket/handleGameAnswer";
import handleGetGamePacks from "../src/socket/handleGetGamePacks";
import handleGetGameState from "../src/socket/handleGetGameState";
import handleGetLeaderboard from "../src/socket/handleGetLeaderboard";
import handleUserConnection from "../src/socket/handleUserConnection";

export default ({ env }) => ({
    io: {
        enabled: true,
        config: {
            contentTypes: [],
            events: [
                {
                    name: 'admin:getContestGroups',
                    handler: handleAdminGetContestGroups
                },
                {
                    name: 'admin:updateContestGroups',
                    handler: handleAdminUpdateContestGroups
                },
                {
                    name: 'admin:syncGameData',
                    handler: handleAdminSyncGameData
                },
                {
                    name: 'user:connection',
                    handler: handleUserConnection
                },
                {
                    name: 'game:answer',
                    handler: handleGameAnswer
                },
                {
                    name: 'game:getGamePacks',
                    handler: handleGetGamePacks
                },
                {
                    name: 'game:getGameState',
                    handler: handleGetGameState
                },
                {
                    name: 'game:getLeaderboard',
                    handler: handleGetLeaderboard
                }
            ],
            socket: {
                serverOptions: {
                    cors: { origin: '*' }
                }
            }
        }
    }
})