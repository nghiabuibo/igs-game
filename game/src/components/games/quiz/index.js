import styles from './quiz.module.css'
import { useEffect, useState } from 'react'
import { getMediaUrl } from '../../../utils/media'
import Markdown from 'react-markdown'

function Quiz(props) {
    const { gamePack, question, userResult, gameState, handleAnswer } = props
    const { answers } = question
    const [inputAnswer, setInputAnswer] = useState('')

    // reset question input if question changed
    useEffect(() => {
        setInputAnswer('')
    }, [question?.id])

    const handleInputAnswerSubmit = (e) => {
        e.preventDefault()
        handleAnswer(inputAnswer)
    }

    let renderAnswer
    switch (question.answerType) {
        case 'select':
            renderAnswer = answers.map(answer => {
                let isSelected, isCorrected, isInCorrected, correctedAnswer
                const [userSelected] = userResult?.answers?.filter(userAnswer => {
                    return userAnswer.__component === gamePack.__component
                        && userAnswer.gamePackID === gamePack.id
                        && userAnswer.questionID === question.id
                        && userAnswer.answer === answer.id
                }) ?? []
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
            let isSubmittable = true
            let isCorrected, isInCorrected
            const userSubmmittedAll = userResult?.answers?.filter(userAnswer => {
                return userAnswer.__component === gamePack.__component
                    && userAnswer.gamePackID === gamePack.id
                    && userAnswer.questionID === question.id
            }) ?? []
            const userSubmmittedCorrected = userSubmmittedAll.filter(userSubmmitted => userSubmmitted.isCorrected)
            const [userSubmmitted] = userSubmmittedCorrected.length ? userSubmmittedCorrected : userSubmmittedAll

            if (
                (userSubmmitted && !question.allowMultipleAnswers)
                || (userSubmmitted && question.allowMultipleAnswers && userSubmmitted.isCorrected)
            ) {
                isSubmittable = false
                if (!inputAnswer) {
                    setInputAnswer(userSubmmitted.answer)
                }
            }

            if (!gameState?.currentTimeLeft) isSubmittable = false

            // only show result when time's up
            if (!gameState?.currentTimeLeft && userSubmmitted?.isCorrected) isCorrected = true
            if (!gameState?.currentTimeLeft && !userSubmmitted?.isCorrected) isInCorrected = true

            renderAnswer =
                <>
                    {
                        !gameState?.currentTimeLeft && isInCorrected && answers?.length &&
                        <div className={styles.answer}>{answers.filter(answer => answer.isCorrected)[0]?.text}</div>
                    }
                    <form onSubmit={handleInputAnswerSubmit} className={styles.answerInputWrapper}>
                        <input type='text' className={`${styles.answerInput} ${userSubmmitted ? styles.selected : ''} ${isCorrected ? styles.corrected : ''} ${isInCorrected ? styles.inCorrected : ''}`} value={inputAnswer} onChange={(e) => setInputAnswer(e.target.value)} required={true} disabled={!isSubmittable} />
                        <button type='submit' className={styles.answerInputSubmit} disabled={!isSubmittable}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#fff">
                                <path d="M83.4 226.6L304 256 83.4 285.4 0 480H64L512 256 64 32H0L83.4 226.6z" />
                            </svg>
                        </button>
                    </form>
                </>
            break;

        default:
            break;
    }

    console.log(gamePack, question)

    return (
        <div className={`p-lg-4 ${styles.quizWrapper}`}>
            <div className={styles.quizContent}>
                <div className={`text-center mt-3 mt-lg-0`}>
                    <div className={`text-white fw-bold fs-4 mb-3 d-inline-block ${styles.questionNumber}`}>
                        {`Question ${gameState.currentQuestion + 1}/${gamePack.questions.length}`}
                    </div>

                    {
                        question.title &&
                        <div className={`text-white fs-2 p-3 mb-3 ${styles.questionTitle}`}>
                            <Markdown>{question.title}</Markdown>
                        </div>
                    }

                    {
                        question.illustration &&
                        <>
                            {
                                question.illustration.mime?.includes('image') &&
                                <img className={`mb-3 img-fluid rounded-3`} src={getMediaUrl(question.illustration)} alt="Illustration" />
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