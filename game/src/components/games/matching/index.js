import { useEffect, useMemo, useState } from "react"
import styles from "./matching.module.css"
import { toast } from "react-toastify"
import { getMediaUrl } from "../../../utils/media"

const ImageCard = (props) => {
    const { content, width, isSelected, handleClick } = props

    return (
        <div role="button" className={`${styles.cardWrapper} ${isSelected ? styles.selected : ''}`} style={{ width: `${width}%` }} onClick={handleClick}>
            <div className={`${styles.cardInner}`}>
                <div className={styles.cardBack}>
                    <div className={styles.cardCover}></div>
                </div>
                <div className={`d-flex align-items-center justify-content-center ${styles.cardFront}`}>
                    {content}
                </div>
            </div>
        </div>
    )
}

function Matching(props) {
    const { gamePack, question, userResult, gameState, handleAnswer } = props
    const width = question?.col ? 100 / question?.col : 20
    const answers = question?.answers

    const userAnswers = userResult?.answers?.filter(userAnswer => {
        return userAnswer.__component === gamePack.__component
            && userAnswer.gamePackID === gamePack.id
            && userAnswer.questionID === question.id
    })

    // using string in useMemo dependency array to prevent unnecessary re-render when randomize answer position
    const answerString = JSON.stringify(answers)

    const [answerSelected, setSelected] = useState([])

    // reset current selected when time's up
    useEffect(() => {
        if (gameState?.currentTimeLeft > 0) return
        setSelected([])
    }, [gameState?.currentTimeLeft])

    // reset current selected if question changed
    useEffect(() => {
        setSelected([])
    }, [question?.id])

    const handleCardClick = (id, index) => {
        // skip if time's up
        if (gameState?.currentTimeLeft <= 0) {
            toast.error(`Time's up`, { theme: 'colored' })
            return
        }

        // skip if already selected 2
        if (answerSelected.length >= 2) return

        // skip if card is already selected
        if (answerSelected.some(selected => selected.id === id && selected.index === index)) return

        // skip if card is already in answered
        if (userAnswers?.some(userAnswer => userAnswer.answer === id)) return

        const newSelected = [...answerSelected]
        newSelected.push({
            id,
            index
        })

        if (newSelected.length >= 2) {
            const [firstSelect] = newSelected
            if (newSelected.every(selected => selected.id === firstSelect.id)) {
                handleAnswer(firstSelect.id)
            }

            // clear selected
            setTimeout(() => {
                setSelected([])
            }, 500);
        }

        setSelected(newSelected)
    }

    const answersClone = useMemo(() => {
        // make a matching pair from answer text and media
        const answerConvert = JSON.parse(answerString)
        const arr = []

        if (!answerConvert.length) return arr

        const answersClone1 = answerConvert.map(answer => {
            return {
                ...answer,
                content: <div className={styles.cardText}>{answer.text}</div>
            }
        })
        const answersClone2 = answerConvert.map(answer => {
            const src = getMediaUrl(answer.media)
            return {
                ...answer,
                content: <img src={src} className={styles.cardMedia} alt="Card Content" />
            }
        })
        arr.push(...answersClone1, ...answersClone2)
        arr.sort(() => Math.random() - 0.5)
        return arr
    }, [answerString])

    const renderAnswers = answersClone.map((answer, index) => {
        const content = answer.content
        const isSelected = answerSelected.some(selected => selected.id === answer.id && selected.index === index) || userAnswers?.some(userAnswer => userAnswer.answer === answer.id)

        return (
            <ImageCard key={index} content={content} width={width} isSelected={isSelected} handleClick={() => { handleCardClick(answer.id, index) }} />
        )
    })

    return (
        <div className={`d-flex flex-wrap my-3 my-md-0 ${styles.gameWrapper}`}>
            {renderAnswers}
        </div>
    )
}

export default Matching