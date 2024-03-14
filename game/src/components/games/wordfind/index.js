import { useEffect, useState } from "react"
import styles from "./wordfind.module.css"

import WordFindModule from "../../../libs/wordfind/wordfind.ts"

function WordFind(props) {
    const { question, handleAnswer } = props
    const [isSelecting, setIsSelecting] = useState(false)
    const [selected, setSelected] = useState([])
    const [orientation, setOrientation] = useState('')
    const [found, setFound] = useState([])

    const getElementData = (e) => {
        if (e.type === 'touchmove') {
            const touch = e.touches[0];
            e.target = document.elementFromPoint(touch.clientX, touch.clientY)
        }

        return {
            letter: e.target.innerText,
            x: parseInt(e.target.getAttribute('data-x')),
            y: parseInt(e.target.getAttribute('data-y'))
        }
    }

    const getOrientation = (e, selectedEl) => {
        if (!selected.length) return
        const lastSelected = selectedEl ?? selected[selected.length - 1]
        const newSelected = getElementData(e)
        if (newSelected.x === lastSelected.x + 1 && newSelected.y === lastSelected.y) return 'horizontal'
        if (newSelected.x === lastSelected.x - 1 && newSelected.y === lastSelected.y) return 'horizontalBack'
        if (newSelected.x === lastSelected.x && newSelected.y === lastSelected.y + 1) return 'vertical'
        if (newSelected.x === lastSelected.x && newSelected.y === lastSelected.y - 1) return 'verticalUp'
        if (newSelected.x === lastSelected.x + 1 && newSelected.y === lastSelected.y + 1) return 'diagonal'
        if (newSelected.x === lastSelected.x - 1 && newSelected.y === lastSelected.y + 1) return 'diagonalBack'
        if (newSelected.x === lastSelected.x + 1 && newSelected.y === lastSelected.y - 1) return 'diagonalUp'
        if (newSelected.x === lastSelected.x - 1 && newSelected.y === lastSelected.y - 1) return 'diagonalUpBack'
        return
    }

    const handleStartSelect = (e) => {
        setIsSelecting(true)
        setSelected([getElementData(e)])
    }

    const handleSelecting = (e) => {
        if (!isSelecting) return

        const newSelected = getElementData(e)
        if (!newSelected) return

        const selectedItemIndex = selected.findIndex(item => item?.x === newSelected?.x && item?.y === newSelected?.y)
        if (selectedItemIndex === 0) {
            setOrientation('')
        }

        // reset selected chars if player moved back
        if (selectedItemIndex >= 0) {
            setSelected(prevState => {
                const updateSelected = [...prevState]
                updateSelected.length = selectedItemIndex + 1
                return updateSelected
            })
            return
        }
        
        // if 3rd char is in orientation range with 1st char, reset selected
        if (selected.length === 2 && getOrientation(e, selected[0])) {
            selected.length = 1
        }
        
        // lock selecting orientation
        if (selected.length > 1 && orientation && orientation !== getOrientation(e)) return

        setOrientation(getOrientation(e))
        setSelected(prevState => {
            const updateSelected = [...prevState]
            updateSelected.push(newSelected)
            return updateSelected
        })
    }

    const clearSelected = () => {
        setIsSelecting(false)
        setOrientation('')
        setSelected([])
    }

    useEffect(() => {
        window.addEventListener('mouseup', clearSelected)
        window.addEventListener('touchend', clearSelected)

        return () => {
            window.removeEventListener('mouseup', clearSelected)
            window.removeEventListener('touchend', clearSelected)
        }
    }, [])

    // set found words display
    useEffect(() => {
        const wordfind = WordFindModule()

        const foundWordsMap = question.foundWords?.map(foundWord => {
            const [matched] = question.answers?.filter(answer => answer.id === foundWord)
            return matched.text
        })

        if (!foundWordsMap) {
            setFound([])
            return
        }

        const solved = wordfind.solve(question.puzzle, foundWordsMap)
        const foundChars = []
        solved.found.forEach(item => {
            for (let i = 0; i < item.word.length; i++) {
                const itemCloned = { ...item }
                if (item.orientation === 'horizontal') itemCloned.x += i
                if (item.orientation === 'horizontalBack') itemCloned.x -= i
                if (item.orientation === 'vertical') itemCloned.y += i
                if (item.orientation === 'verticalUp') itemCloned.y -= i
                if (item.orientation === 'diagonal') {
                    itemCloned.x += i
                    itemCloned.y += i
                }
                if (item.orientation === 'diagonalBack') {
                    itemCloned.x -= i
                    itemCloned.y += i
                }
                if (item.orientation === 'diagonalUp') {
                    itemCloned.x += i
                    itemCloned.y -= i
                }
                if (item.orientation === 'diagonalUpBack') {
                    itemCloned.x -= i
                    itemCloned.y -= i
                }

                foundChars.push(itemCloned)
            }
        })
        setFound(foundChars)
    }, [question.puzzle, question.answers, question.foundWords])

    // handle answer
    useEffect(() => {
        const word = selected.map(item => item?.letter.toLowerCase()).join('')
        const isWordFound = question.answers?.some(answer => answer.text === word)
        if (!isWordFound) return

        clearSelected()
        const [answer] = question.answers?.filter(answer => answer.text === word)

        // skip if answer incorrrect
        if (!answer) return
        
        // skip if already answered
        if (question.foundWords?.includes(answer.id)) return

        handleAnswer(answer.id)
    }, [selected, question.answers, question.foundWords, handleAnswer])

    const renderPuzzle = question?.puzzle.map((cols, y) => {
        const rows = cols.map((row, x) => {
            const isSelected = selected?.some(item => item?.x === x && item?.y === y)
            const isFound = found.some(item => item.x === x && item.y === y)
            return (
                <td
                    key={`${x}_${y}`}
                    data-x={x}
                    data-y={y}
                    className={`${isSelected ? styles.selected : ''} ${isFound ? styles.found : ''} ${styles.char}`}
                    onMouseDown={handleStartSelect}
                    onMouseEnter={handleSelecting}
                    onTouchStart={handleStartSelect}
                    onTouchMove={handleSelecting}
                >
                    {row}
                </td>
            )
        })
        return <tr key={y}>{rows}</tr>
    })

    const renderFoundwords = question.foundWords?.map(foundWord => {
        const [answerMatch] = question.answers?.filter(answer => answer.id === foundWord)
        return (
            <span key={answerMatch?.id} className={styles.foundWord}>
                {
                    answerMatch?.text
                }
            </span>
        )
    })

    return (
        <div className="row">
            <div className="col-lg-9">
                <table className={styles.wordFindWrapper}>
                    <tbody>
                        {renderPuzzle}
                    </tbody>
                </table>
            </div>
            <div className="col-lg-3">
                <h6 className="fw-bold text-white mt-5 mb-3">Các từ đã tìm được</h6>
                {renderFoundwords}
            </div>
        </div>
    )
}

export default WordFind