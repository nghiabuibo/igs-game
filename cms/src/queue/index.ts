const UPDATE_QUEUE = []
let isProcessingQueue = false

function pushUpdateQueue(uid, id, parameters) {
    UPDATE_QUEUE.push({ uid, id, parameters })
}

function startQueueProcessing(strapi) {
    setInterval(async () => {
        if (isProcessingQueue) return;

        while (UPDATE_QUEUE.length) {
            isProcessingQueue = true
            const queueItem = UPDATE_QUEUE.shift()
            try {
                await strapi.entityService.update(queueItem.uid, queueItem.id, queueItem.parameters)
            } catch (err) {
                console.log(err)
            }
        }

        isProcessingQueue = false
    }, 1000)
}

export {
    pushUpdateQueue,
    startQueueProcessing
}