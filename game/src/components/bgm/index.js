import axios from "axios"
import { useEffect, useRef, useState } from "react"
import handleRequestError from "../../utils/handleRequestError"

import styles from './bgm.module.css'

import volumeSVG from '../../assets/svgs/volume.svg';
import volumeSlashSVG from '../../assets/svgs/volume-slash.svg';

function BGM() {
    const [bgmUrl, setBgmUrl] = useState()
    const [bgmVolume, setBgmVolume] = useState(1)
    const bgmRef = useRef(null)
    const [volumeBtn, setVolumeBtn] = useState(volumeSVG)

    useEffect(() => {
        const getBGM = async () => {
            const apiUrl = process.env.REACT_APP_API_URL
            const endpoint = '/contest-setting?populate=bgm'
            const response = await axios.get(apiUrl + endpoint).catch(handleRequestError)

            setBgmUrl(response?.data?.data?.attributes?.bgm?.data?.attributes?.url)
            setBgmVolume(response?.data?.data?.attributes?.bgmVolume || 1)
        }
        getBGM()
    }, [])

    useEffect(() => {
        if (!bgmRef?.current) return;
        bgmRef.current.volume = bgmVolume
    }, [bgmVolume])

    const handleTogglePaused = () => {
        if (bgmRef.current.paused) {
            bgmRef.current.play()
            setVolumeBtn(volumeSVG)
            return
        }

        bgmRef.current.pause()
        setVolumeBtn(volumeSlashSVG)
    }

    return (
        bgmUrl &&
        <>
            <audio ref={bgmRef} id="audio" src={process.env.REACT_APP_CMS_URL + bgmUrl} loop autoPlay>
            </audio>

            <div className={styles.togglePaused} onClick={handleTogglePaused}>
                <img src={volumeBtn} alt='Toggle Paused' />
            </div>
        </>
    )
}

export default BGM