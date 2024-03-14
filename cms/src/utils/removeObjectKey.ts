function removeObjectKey(obj, targetKey) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (key === targetKey) {
                delete obj[key];
            } else if (typeof obj[key] === 'object') {
                removeObjectKey(obj[key], targetKey); // Recursive call for nested objects
            }
        }
    }
    return obj
}

export default removeObjectKey