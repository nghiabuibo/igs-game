import igsLogo from '../assets/imgs/igs-logo.png'
import eventLogo from '../assets/imgs/event-logo.png'
import styles from './Logo.module.css'

function Logo() {
    return (
        <div className='container'>
            <div className='row align-items-center pt-5 mb-5'>
                <div className="col-6 text-end">
                    <img src={igsLogo} className={`${styles.logo}`} alt='iSmart Logo' />
                </div>
                <div className="col-6 text-start">
                    <img src={eventLogo} className={`${styles.logo2}`} alt='Arena Logo' />
                </div>
            </div>
        </div>
    )
}

export default Logo