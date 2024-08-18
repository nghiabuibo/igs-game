import styles from './quiz.module.css'
import { Fragment, useEffect, useState } from 'react'
import { getMediaUrl } from '../../../utils/media'
import Markdown from 'react-markdown'
import shuffleArray from '../../../utils/shuffleArray'
import reactStringReplace from 'react-string-replace'

function Quiz(props) {
    const MATCHING_DELIMITER = '_'
    const { gamePack, question, userResult, gameState, handleAnswer } = props
    const { answers } = question
    const [firstCorrectedAnswer] = answers?.filter(answer => answer.isCorrected)
    const [inputAnswer, setInputAnswer] = useState('')
    const [matchingAnswers, setMatchingAnswers] = useState([])

    const userSubmittedAll = userResult?.answers?.filter(userAnswer => {
        return userAnswer.__component === gamePack.__component
            && userAnswer.gamePackID === gamePack.id
            && userAnswer.questionID === question.id
    }) ?? []
    const userSubmittedCorrected = userSubmittedAll.sort((a, b) => b.timestamp - a.timestamp).filter(userSubmitted => userSubmitted.isCorrected)
    const [userSubmitted] = userSubmittedCorrected.length ? userSubmittedCorrected : userSubmittedAll

    const getQuestionState = (userSubmitted, question, gameState) => {
        let isSubmittable = true
        let isCorrected, isInCorrected

        if (
            (userSubmitted && !question.allowMultipleAnswers)
            || (userSubmitted && question.allowMultipleAnswers && userSubmitted.isCorrected)
        ) {
            isSubmittable = false
        }

        if (!gameState?.currentTimeLeft) isSubmittable = false

        // only show result when time's up
        if (!gameState?.currentTimeLeft && userSubmitted?.isCorrected) isCorrected = true
        if (!gameState?.currentTimeLeft && !userSubmitted?.isCorrected) isInCorrected = true

        return [isSubmittable, isCorrected, isInCorrected]
    }

    const [isSubmittable, isCorrected, isInCorrected] = getQuestionState(userSubmitted, question, gameState)

    // reset question input if question changed
    useEffect(() => {
        // for input quiz
        if (question.answerType === 'input') {
            if (userSubmitted?.answer) {
                setInputAnswer(userSubmitted?.answer)
            } else {
                setInputAnswer('')
            }
        }

        // for matching quiz
        if (question.answerType === 'matching') {
            if (userSubmitted?.answer) {
                const matchingUserAnswersMap = userSubmitted?.answer.split(MATCHING_DELIMITER).map((text, index) => ({
                    originIndex: index,
                    order: index + 1,
                    text
                }))
                // const matchingUserAnswersMapShuffle = shuffleArray(matchingUserAnswersMap)
                setMatchingAnswers(matchingUserAnswersMap)
            } else {
                const answerArr = firstCorrectedAnswer?.text?.split(MATCHING_DELIMITER)
                if (!answerArr || !answerArr.length) {
                    setMatchingAnswers([])
                    return
                }

                const answerArrRand = shuffleArray(answerArr)
                const matchingAnswersMap = answerArrRand.map((text, index) => ({
                    originIndex: index,
                    order: 0,
                    text
                }))
                setMatchingAnswers(matchingAnswersMap)
            }
        }
    }, [question?.id, question?.answerType, userSubmitted?.answer, firstCorrectedAnswer?.text])

    const handleInputAnswerSubmit = (e) => {
        e.preventDefault()
        handleAnswer(inputAnswer)
    }

    const handleMatchingAnswerSelect = (index) => {
        const matchingAnswersClone = [...matchingAnswers]
        const maxOrder = matchingAnswers.reduce((max, answer) => Math.max(max, answer.order), -Infinity) + 1
        matchingAnswersClone[index] = {
            ...matchingAnswersClone[index],
            order: matchingAnswersClone[index].order > 0 ? 0 : maxOrder
        }
        setMatchingAnswers(matchingAnswersClone)
    }

    const handleMatchingAnswerReset = () => {
        const matchingAnswersClone = [...matchingAnswers]
        for (const answer of matchingAnswersClone) {
            answer.order = 0
        }
        setMatchingAnswers(matchingAnswersClone)
    }

    const handleMatchingAnswerSubmit = () => {
        if (matchingAnswers.some(answer => answer.order <= 0)) return
        const answerJoined = [...matchingAnswers].sort((a, b) => a.order - b.order).map(answer => answer.text).join(MATCHING_DELIMITER)
        handleAnswer(answerJoined)
    }

    let renderQuestionTitle
    let renderAnswer
    switch (question.answerType) {
        case 'select':
            renderQuestionTitle = <Markdown>{question?.title}</Markdown>

            renderAnswer = answers.map(answer => {
                let isSelected, isCorrected, isInCorrected, correctedAnswer
                const userSelected = userResult?.answers?.find(userAnswer => {
                    return userAnswer.__component === gamePack.__component
                        && userAnswer.gamePackID === gamePack.id
                        && userAnswer.questionID === question.id
                        && userAnswer.answer === answer.id
                })
                if (userSelected) isSelected = true

                // only show result when time's up
                if (!gameState?.currentTimeLeft && userSelected?.isCorrected) isCorrected = true
                if (!gameState?.currentTimeLeft && userSelected && !userSelected?.isCorrected) isInCorrected = true
                if (!gameState?.currentTimeLeft && gameState?.correctedAnswers?.some(correctedAnswer => correctedAnswer.id === answer.id)) correctedAnswer = true

                let classCol = 6
                switch (question.col) {
                    case 1:
                        classCol = 12
                        break;
                    case 2:
                        classCol = 6
                        break;
                    case 3:
                        classCol = 4
                        break;
                    case 4:
                        classCol = 3
                        break;
                    case 6:
                        classCol = 2
                        break;

                    default:
                        break;
                }

                return (
                    <div className={`col-md-${classCol}`} key={answer.id}>
                        <button
                            className={`w-100 h-100 ${styles.answerBtn} ${isSelected ? styles.selected : ''} ${isCorrected ? styles.corrected : ''} ${isInCorrected ? styles.inCorrected : ''} ${correctedAnswer ? styles.corrected : ''}`}
                            key={answer.id}
                            onClick={() => handleAnswer(answer.id)}
                        >
                            {answer.text}

                            {
                                answer.media?.url &&
                                <img src={process.env.REACT_APP_CMS_URL + answer.media.url} className={`img-fluid mt-2`} alt='Answer Media' />
                            }
                        </button>
                    </div>
                )
            })
            break;

        case 'input':
            renderQuestionTitle = <Markdown>{question?.title}</Markdown>

            renderAnswer =
                <>
                    {
                        !gameState?.currentTimeLeft && isInCorrected &&
                        <div className={styles.answer}>{answers?.find(answer => answer.isCorrected)?.text}</div>
                    }
                    <form onSubmit={handleInputAnswerSubmit} className={styles.answerInputWrapper}>
                        <input
                            type='text'
                            className={`${styles.answerInput} ${userSubmittedAll.some(userSubmitted => userSubmitted.answer === inputAnswer) ? styles.selected : ''} ${isCorrected ? styles.corrected : ''} ${isInCorrected ? styles.inCorrected : ''}`}
                            value={inputAnswer}
                            onChange={(e) => setInputAnswer(e.target.value)}
                            required={true}
                            disabled={!isSubmittable} />
                        <button type='submit' className={styles.answerInputSubmit} disabled={!isSubmittable}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#5aaaff">
                                <path d="M83.4 226.6L304 256 83.4 285.4 0 480H64L512 256 64 32H0L83.4 226.6z" />
                            </svg>
                        </button>
                    </form>
                </>
            break;

        case 'matching':
            const matchingAnswersClone = [...matchingAnswers]

            const matchingAnswerFillInput = <div className='d-inline-flex px-3'>
                {
                    matchingAnswersClone?.length && matchingAnswersClone
                        .sort((a, b) => {
                            if (a.order === 0 && b.order === 0) {
                                return 0; // If both have order 0, maintain the order
                            } else if (a.order === 0) {
                                return 1; // Move items with order 0 to the end
                            } else if (b.order === 0) {
                                return -1; // Move items with order 0 to the end
                            } else {
                                return a.order - b.order; // Otherwise, sort normally
                            }
                        })
                        .map((answer) => {
                            return (
                                <span
                                    key={answer.originIndex}
                                    className={`d-inline-block mx-1 ${styles.matchingAnswer}`}
                                    onClick={() => {
                                        if (answer.order > 0 && isSubmittable) handleMatchingAnswerSelect(answer.originIndex)
                                    }}
                                >{answer.order > 0 && answer.text}</span>
                            )
                        })
                }
            </div>

            renderQuestionTitle = reactStringReplace(question?.title, '[]', () => (
                matchingAnswerFillInput
            )).map((part, index) => {
                if (typeof part === 'string') {
                    return <Markdown key={index} components={{ p: 'span' }}>{part}</Markdown>
                }
                return <Fragment key={index}>{part}</Fragment>
            })

            renderAnswer = matchingAnswers?.map((matchingAnswer) => {
                return (
                    <div
                        className={`${styles.matchingAnswerSelect} ${isCorrected ? styles.corrected : ''} ${isInCorrected ? styles.inCorrected : ''} ${matchingAnswer.order ? styles.selected : ''}`}
                        key={matchingAnswer.originIndex}
                        onClick={() => {
                            if (isSubmittable) handleMatchingAnswerSelect(matchingAnswer.originIndex)
                        }}
                    >{matchingAnswer.text}</div>
                )
            })

            // wrapper
            renderAnswer = <>
                {
                    !gameState?.currentTimeLeft && isInCorrected &&
                    <div className={styles.answer}>{answers?.find(answer => answer.isCorrected)?.text.split(MATCHING_DELIMITER).join('')}</div>
                }
                <div className={`d-flex align-items-center justify-content-center flex-wrap gap-3`}>
                    {renderAnswer}
                </div>

                <div className='d-flex gap-2'>
                    <button
                        className={`${styles.matchingAnswerReset} ${!isSubmittable ? styles.disabled : ''}`}
                        onClick={() => {
                            if (isSubmittable) handleMatchingAnswerReset()
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill='#fff'>
                            <path d="M48.5 224H40c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H48.5z" />
                        </svg>
                    </button>
                    <button
                        className={`${styles.matchingAnswerSubmit} ${!isSubmittable ? styles.disabled : ''}`}
                        onClick={() => {
                            if (isSubmittable) handleMatchingAnswerSubmit()
                        }}>Submit
                    </button>
                </div>

            </>
            break;

        default:
            break;
    }

    return (
        <div className={`p-lg-4 ${styles.quizWrapper}`}>
            <div className={styles.quizContent}>
                <div className={`text-center mt-3 mt-lg-0`}>
                    <div className={`text-white fw-bold fs-4 mb-3 d-inline-block ${styles.questionNumber}`}>
                        {`Question ${gameState.currentQuestion + 1}/${gamePack.questions.length}`}
                    </div>

                    {
                        renderQuestionTitle &&
                        <div className={`fs-2 p-3 mb-3 ${styles.questionTitle}`}>
                            {renderQuestionTitle}
                        </div>
                    }

                    {
                        question.illustration &&
                        <>
                            {
                                question.illustration.mime?.includes('image') &&
                                <img className={`mb-3 img-fluid ${styles.quizImg}`} src={getMediaUrl(question.illustration)} alt="Illustration" />
                            }

                            {
                                question.illustration.mime?.includes('audio') &&
                                <audio className={`mb-3 w-100`} src={getMediaUrl(question.illustration)} controls={true} autoPlay={true}></audio>
                            }
                        </>
                    }
                </div>

                <div className='row g-3 mt-5 mb-3'>
                    {renderAnswer}
                </div>
            </div>
        </div>
    )
}

export default Quiz