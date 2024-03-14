import { useEffect, useState } from "react"
import AdminAuthen from "./AdminAuthen"
import AdminControls from "./AdminControls"

function Admin() {
    const [adminToken, setAdminToken] = useState('')

    useEffect(() => {
        const localAdminToken = localStorage.getItem('admin_token')

        if (!localAdminToken) return

        setAdminToken(localAdminToken)
    }, [])

    return (
        !adminToken
            ?
            <AdminAuthen setAdminToken={setAdminToken} />
            :
            <AdminControls adminToken={adminToken} setAdminToken={setAdminToken} />

    )
}

export default Admin