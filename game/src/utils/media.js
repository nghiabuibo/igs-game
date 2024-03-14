function getMediaUrl(mediaObj) {
    if (!mediaObj?.url) return
    
    const url = mediaObj.url.includes('http') ? mediaObj.url : process.env.REACT_APP_CMS_URL + mediaObj.url
    return url
}

export {
    getMediaUrl
}