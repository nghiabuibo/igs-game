import { useEffect, useState } from "react";
import Authentication from "./views/Authentication";
import Games from "./views/Games";
import { useParams } from "react-router-dom";
import axios from "axios";
import handleRequestError from "./utils/handleRequestError";
import BGM from "./components/bgm";

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

  return (
    !accessToken || !group
      ?
      <Authentication group={group} setAccessToken={setAccessToken} />
      :
      <>
        <Games accessToken={accessToken} setAccessToken={setAccessToken} />
        <BGM />
      </>
  );
}

export default App;
