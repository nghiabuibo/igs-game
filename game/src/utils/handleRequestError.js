import { toast } from 'react-toastify';

function handleRequestError(err) {
    console.log(err)
    const message = err.response?.data?.error?.message ?? err.message
    toast.error(message, { theme: 'colored' })
}

export default handleRequestError