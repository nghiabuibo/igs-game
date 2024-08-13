import Logo from "./views/Logo"
import mainImg from "./assets/imgs/main-img.png"
import { useEffect, useState } from "react"
import handleRequestError from "./utils/handleRequestError"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import styles from "./GroupSelect.module.css"

function GroupSelect() {
    const [groups, setGroups] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const getGroups = async () => {
            const apiUrl = process.env.REACT_APP_API_URL
            const endpoint = '/groups'
            const response = await axios.get(apiUrl + endpoint).catch(handleRequestError)
            if (!response?.data?.data?.length) return

            setGroups(response.data.data)
        }
        getGroups()
    }, [])

    const renderGroupSelect = groups.map(group => {
        return (
            <button className={styles.groupSelectBtn} onClick={() => navigate(group.attributes?.code)} key={group.id}>{group.attributes?.name}</button>
        )
    })

    return (
        <>
            <Logo />
            <div className="text-center p-3">
                <div className="my-5">
                    <img src={mainImg} className="img-fluid" alt="IGS Open Week 2024" />
                </div>
                <div className="d-flex flex-column align-items-center pt-5">
                    {renderGroupSelect}
                </div>
            </div>
        </>
    )
}

export default GroupSelect