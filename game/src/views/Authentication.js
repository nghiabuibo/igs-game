import { useState } from "react"
import axios from "axios"
import handleRequestError from "../utils/handleRequestError"

import styles from './Authentication.module.css'

import Logo from "./Logo";

function Authentication(props) {
    const { setAccessToken, group } = props
    const [authInfo, setAuthInfo] = useState({
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        const apiUrl = process.env.REACT_APP_API_URL
        const endpoint = '/contest/register'
        const response = await axios.post(apiUrl + endpoint, { data: authInfo }).catch(handleRequestError)

        if (!response) return;

        if (!response?.data?.accessToken) {
            handleRequestError(response?.data ?? { message: 'Authentication error!' })
            return
        }

        localStorage.setItem('access_token', response.data.accessToken)
        setAccessToken(response.data.accessToken)
    }

    const renderGradeOptions = group?.attributes?.grades?.split(',').map(grade => {
        return (
            <option key={grade} value={grade}>Khối {parseInt(grade) === 0 ? 'K' : grade}</option>
        )
    })

    return (
        <>
            <Logo />
            <div className={`d-flex align-items-center justify-content-center ${styles.wrapper}`}>
                <form onSubmit={handleSubmit} className={`d-flex flex-column gap-4 ${styles.registerForm}`} autoComplete="off">
                    <div>
                        <input type="text" name="name" value={authInfo.name} placeholder="Họ và tên" onChange={handleChange} required={true} />
                    </div>
                    <div>
                        <input type="tel" name="phone" value={authInfo.phone} placeholder="Số điện thoại" onChange={handleChange} required={true} minLength={10} />
                    </div>
                    <div>
                        <input type="email" name="email" value={authInfo.email} placeholder="Email" onChange={handleChange} required={true} />
                    </div>
                    <div>
                        <select name="grade" value={authInfo.grade} onChange={handleChange} required={true} >
                            <option value="">Khối lớp</option>
                            {renderGradeOptions}
                        </select>
                    </div>
                    <div>
                        <button type="submit">Bắt đầu</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Authentication