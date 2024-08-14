import { useState } from "react"
import axios from "axios"
import handleRequestError from "../utils/handleRequestError"
import mainImg from "../assets/imgs/main-img.png"

import styles from './Authentication.module.css'

import Logo from "./Logo";
import formatSearchString from "../utils/formatSearchString"
import { toast } from "react-toastify"

function Authentication(props) {
    const { handleLogin, group } = props
    const [isLoading, setIsLoading] = useState(false)
    const [authInfo, setAuthInfo] = useState({
        contestantID: '',
        name: '',
        phone: '',
        email: '',
        grade: ''
    })

    const handleChange = (e) => {
        setAuthInfo(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const validateInfo = async () => {
        setIsLoading(true)

        const googleApiUrl = 'https://sheets.googleapis.com/v4/spreadsheets/'
        const params = `/values/${encodeURIComponent(process.env.REACT_APP_GOOGLE_SHEET_NAME)}!${process.env.REACT_APP_GOOGLE_SHEET_RANGE}?key=`
        const googleSpreadsheetId = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID
        const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY
        const endpoint = googleApiUrl + googleSpreadsheetId + params + googleApiKey
        const response = await axios.get(endpoint).catch(handleRequestError)

        setIsLoading(false)

        if (!response?.data?.values?.length) return;

        const contestantMap = {
            id: 11,
            name: 3,
            phone: 5,
            email: 6,
            grade: 9
        }
        const [foundContestant] = response.data.values.filter(contestant => {
            const contestantName = contestant[contestantMap.name]
            const contestantID = contestant[contestantMap.id]
            return formatSearchString(contestantID) === formatSearchString(authInfo.contestantID)
                && formatSearchString(contestantName) === formatSearchString(authInfo.name)
        })

        if (!foundContestant) {
            toast.error('Contestant not found!', { theme: 'colored' })
            return;
        }

        // remap grade K
        if (foundContestant[contestantMap.grade] === 'K') foundContestant[contestantMap.grade] = '0'

        setAuthInfo({
            contestantID: foundContestant[contestantMap.id],
            name: foundContestant[contestantMap.name],
            phone: foundContestant[contestantMap.phone],
            email: foundContestant[contestantMap.email],
            grade: foundContestant[contestantMap.grade]
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!authInfo.phone) {
            validateInfo()
            return
        }

        setIsLoading(true)

        const apiUrl = process.env.REACT_APP_API_URL
        const endpoint = '/contest/register'
        const response = await axios.post(apiUrl + endpoint, { data: authInfo }).catch(handleRequestError)

        setIsLoading(false)

        if (!response) return;

        if (!response?.data?.accessToken) {
            handleRequestError(response?.data ?? { message: 'Authentication error!' })
            return
        }

        handleLogin(response.data.accessToken)
    }

    const renderGradeOptions = group?.attributes?.grades?.split(',').map(grade => {
        return (
            <option key={grade} value={grade}>Grade {parseInt(grade) === 0 ? 'K' : grade}</option>
        )
    })

    return (
        <>
            <Logo />
            <div className="my-5 text-center">
                <img src={mainImg} className="img-fluid" alt="IGS Open Week 2024" />
            </div>
            <div className={`d-flex align-items-center justify-content-center ${styles.wrapper}`}>
                <form onSubmit={handleSubmit} className={`d-flex flex-column gap-4 ${styles.registerForm}`} autoComplete="off">
                    <div>
                        <input type="text" name="contestantID" value={authInfo.contestantID} placeholder="Contestant ID" onChange={handleChange} required={true} readOnly={authInfo.phone ? true : false} />
                    </div>
                    <div>
                        <input type="text" name="name" value={authInfo.name} placeholder="Full Name" onChange={handleChange} required={true} readOnly={authInfo.phone ? true : false} />
                    </div>
                    {
                        authInfo.phone &&
                        <>
                            <div>
                                <input type="tel" name="phone" value={authInfo.phone} placeholder="Phone number" onChange={handleChange} required={true} minLength={10} readOnly={true} />
                            </div>
                            <div>
                                <input type="email" name="email" value={authInfo.email} placeholder="Email" onChange={handleChange} required={true} readOnly={true} />
                            </div>
                            <div>
                                <select name="grade" value={authInfo.grade} onChange={handleChange} required={true} >
                                    <option value="">Grade</option>
                                    {renderGradeOptions}
                                </select>
                            </div>
                        </>
                    }
                    <div>
                        <button type="submit" disabled={isLoading} className={isLoading ? styles.disabled : ''}>
                            {authInfo.phone ? 'CONFIRM AND START' : 'CONTINUE'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Authentication