import { jwtDecode } from "jwt-decode";
import getUserResult from "../utils/getUserResult";
import getUserContest from "../utils/getUserContest";
import getUserGameState from "../utils/getUserGameState";
import vnToEn from "../utils/vnToEn";
import gradeToGroup from "../utils/gradeToGroup";
import { pushUpdateQueue } from "../queue";

interface decodedToken {
    id: number,
    iat: number,
    exp: number
}

interface answer {
    timestamp: number,
    __component: string,
    gamePackID: number,
    questionID: number,
    answer: any,
    timeLeft: number,
    score: number,
    isCorrected: boolean,
}

async function handleGameAnswer({ strapi, io }, socket, answer) {
    try {
        const answerObj = <answer>{}
        answerObj.answer = answer
        answerObj.timestamp = Date.now()
        answerObj.timeLeft = 0
        answerObj.score = 0
        answerObj.isCorrected = false

        // get user current contest
        const userContest = await getUserContest(socket, true)

        // get user current game state
        const userGameState = await getUserGameState(socket)
        answerObj.timeLeft = userGameState.currentTimeLeft

        // get user current result
        const userResult = await getUserResult(socket)
        const userAnswers: any = userResult.answers ?? []

        // add answer data
        const gamePacks = userContest ? userContest.gamePacks : []
        const currentGamePack = gamePacks[userGameState?.currentGamePack]
        const currentQuestion = currentGamePack?.questions[userGameState?.currentQuestion]
        answerObj.__component = currentGamePack.__component
        answerObj.gamePackID = currentGamePack.id
        answerObj.questionID = currentQuestion.id

        // validate answer
        if (userGameState.currentStatus !== 'playing') {
            socket.emit('socket:error', { message: `Game is ${userGameState.currentStatus}!` })
            return
        }

        if (userGameState.currentTimeLeft <= 0) {
            socket.emit('socket:error', { message: `Time's up!` })
            return
        }

        const existedAnswer = userAnswers.find(answer => {
            if (currentQuestion.allowMultipleAnswers) {
                return answer.__component === answerObj.__component
                    && answer.gamePackID === answerObj.gamePackID
                    && answer.questionID === answerObj.questionID
                    && answer.answer === answerObj.answer
            }

            return answer.__component === answerObj.__component
                && answer.gamePackID === answerObj.gamePackID
                && answer.questionID === answerObj.questionID
        })

        if (existedAnswer) {
            socket.emit('socket:error', { message: 'Question already answered!' })
            return
        }

        // validate found words - word find game
        if (currentQuestion.foundWords && currentQuestion.foundWords.length && currentQuestion.foundWords.includes(answerObj.answer)) {
            socket.emit('socket:error', { message: 'Word found!' })
            return
        }

        // score answers
        // let getAnswer
        // switch (currentGamePack.__component) {
        //     case 'game-packs.quiz-packs':
        //         [getAnswer] = currentQuestion.answers.filter(answer => answer.id === answerObj.answer)
        //         break;
        // }

        const getAnswer = currentQuestion.answers.find(answer => {
            if (currentQuestion.answerType === 'input' || currentQuestion.answerType === 'matching') {
                // convert vn chars to en, remove spaces and convert to lower case to compare answer
                return vnToEn(answer.text).replace(/\s/g, '').toLowerCase() === vnToEn(answerObj.answer).replace(/\s/g, '').toLowerCase()
            }

            return answer.id === answerObj.answer
        })

        if (getAnswer?.isCorrected) {
            let score = currentQuestion.maxScore
            if (currentQuestion.timeLimit && currentQuestion.isRelativeScore) {
                score = Math.round(score * (answerObj.timeLeft / currentQuestion.timeLimit))
            }
            if (score < 0) score = 0
            if (score > currentQuestion.maxScore) score = currentQuestion.maxScore

            answerObj.score = score
            answerObj.isCorrected = true
        }

        // update result answers and score
        userAnswers.push(answerObj)
        const totalScore = userAnswers.reduce((total, answer) => total + answer.score, 0)
        const totalCorrected = userAnswers.filter(answer => answer.isCorrected).length

        userResult.answers = userAnswers
        userResult.totalScore = totalScore
        userResult.totalCorrected = totalCorrected

        strapi.$io.raw({
            event: 'result:update',
            data: {
                id: userResult.id,
                attributes: userResult
            },
            rooms: [socket.group.code]
        })
        // send to queue db update
        pushUpdateQueue('api::result.result', userResult.id, {
            data: {
                answers: userAnswers,
                totalScore,
                totalCorrected
            }
        })
    } catch (err) {
        console.log(err)
    }
}

export default handleGameAnswer