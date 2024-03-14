import styles from './CoverImage.module.css'

function CoverImage(props) {
    const { src } = props
    return (
        <>
            <div className={styles.coverBg}></div>
            <img src={src} className={styles.coverImage} alt='Cover' />
        </>
    )
}

export default CoverImage