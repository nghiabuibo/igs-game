import { useEffect, useState } from "react";
import Authentication from "./views/Authentication";
import Games from "./views/Games";
import { useParams } from "react-router-dom";
import axios from "axios";
import handleRequestError from "./utils/handleRequestError";
import BGM from "./components/bgm";

import styles from "./App.module.css";

function App() {
  const [accessToken, setAccessToken] = useState('')
  const [group, setGroup] = useState('')

  useEffect(() => {
    const localAccessToken = localStorage.getItem('access_token')

    if (!localAccessToken) return

    setAccessToken(localAccessToken)
  }, [])

  const { groupCode } = useParams()

  useEffect(() => {
    if (!groupCode) return

    const getGroup = async () => {
      const apiUrl = process.env.REACT_APP_API_URL
      const endpoint = '/groups'
      const params = {
        "filters[code][$eq]": groupCode
      }
      const response = await axios.get(apiUrl + endpoint + '?' + new URLSearchParams(params).toString()).catch(handleRequestError)
      if (!response?.data?.data?.length) return

      setGroup(response.data.data[0])
    }
    getGroup()
  }, [groupCode])

  const handleLogin = (accessToken) => {
    if (!accessToken) return;

    localStorage.setItem('access_token', accessToken)
    setAccessToken(accessToken)
  }

  const handleLogout = () => {
    localStorage.setItem('access_token', '')
    setAccessToken('')
  }

  return (
    !accessToken || !group
      ?
      <Authentication group={group} handleLogin={handleLogin} />
      :
      <>
        <Games accessToken={accessToken} handleLogout={handleLogout} />
        <BGM />
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
          </svg>
        </button>
      </>
  );
}

export default App;
