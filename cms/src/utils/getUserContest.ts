import getContestGroup from "./getContestGroup"
import gradeToGroup from "./gradeToGroup"
import removeObjectKey from "./removeObjectKey"

interface Strapi {
    [key: string]: any
}

async function getUserContest(userID, showAnswer = false) {
    // const user = await strapi.entityService.findOne('plugin::users-permissions.user', userID)
    const [user] = (strapi as Strapi).gameData.users.filter(user => user.id === userID)

    if (!user) return

    const group = await gradeToGroup(user.grade)
    const groupID: any = group.id
    const contestGroup = await getContestGroup(groupID)
    const contestID = contestGroup?.contest?.id

    if (!contestID) return

    // const populate = 'gamePacks.questions.illustration, gamePacks.questions.answers.media, gamePacks.coverImage'
    // const contest = await strapi.entityService.findOne('api::contest.contest', contestID, { populate })
    const [contest] = (strapi as Strapi).gameData.contests.filter(contest => contest.id === contestID)

    if (!contest) return

    // process word find game data
    const gameState = contestGroup.state
    const currentGamePack = contest.gamePacks[gameState.currentGamePack]
    if (currentGamePack.__component === 'game-packs.word-find-packs' && currentGamePack.questions && currentGamePack.questions.length) {
        const currentQuestion: any = currentGamePack.questions[gameState.currentQuestion]
        if (currentQuestion.answers && currentQuestion.answers.length) {
            // get found words
            // const results = await strapi.entityService.findMany('api::result.result', {
            //     filters: {
            //         contest: contestID,
            //         group: groupID
            //     },
            //     limit: -1
            // })
            const results = (strapi as Strapi).gameData.results.filter(result => result.contest.id === contestID && result.group.id === groupID)

            const foundWords = []
            results.forEach(result => {
                const userAnswers: any = result.answers ?? []
                const userFoundWords = userAnswers
                    .filter(userAnswer => {
                        return userAnswer.__component === currentGamePack.__component
                            && userAnswer.gamePackID === currentGamePack.id
                            && userAnswer.questionID === currentQuestion.id
                    })
                    .map(userAnswer => userAnswer.answer)
                foundWords.push(...userFoundWords)
            })

            // attach to question object
            currentQuestion.foundWords = foundWords
        }
    }

    if (showAnswer || !gameState.currentTimeLeft) return contest

    const contestCloned = JSON.parse(JSON.stringify(contest))
    return removeObjectKey(contestCloned, 'isCorrected')
}

export default getUserContest