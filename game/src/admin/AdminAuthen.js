import { useState } from "react"
import axios from "axios"
import handleRequestError from "../utils/handleRequestError"
import Logo from "../views/Logo"

import styles from '../views/Authentication.module.css'

function AdminAuthen(props) {
    const { setAdminToken } = props
    const [authInfo, setAuthInfo] = useState({
        email: '',
        password: '',
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
        const endpoint = '/users-permissions/api-token'
        const response = await axios.post(apiUrl + endpoint, authInfo).catch(handleRequestError)

        if (!response) return;

        if (!response?.data?.jwt) {
            handleRequestError(response?.data ?? { message: 'Authentication error!' })
            return
        }

        localStorage.setItem('admin_token', response.data.jwt)
        setAdminToken(response.data.jwt)
    }

    return (
        <>
            <Logo />
            <div className={`d-flex align-items-center justify-content-center ${styles.wrapper}`}>
            
                <form onSubmit={handleSubmit} className={`d-flex flex-column gap-4 ${styles.registerForm}`}>
                    <div>
                        <input type="text" name="email" value={authInfo.email} placeholder="Email" onChange={handleChange} />
                    </div>
                    <div>
                        <input type="password" name="password" value={authInfo.password} placeholder="Password" onChange={handleChange} />
                    </div>
                    <div>
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default AdminAuthen