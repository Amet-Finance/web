import {toast} from "react-toastify";

async function copyToClipboard(text: string, type: string) {
    return navigator.clipboard.writeText(text)
        .then(() => toast(`${type} was successfully copied to your clipboard.`))
        .catch(() => toast.error("An error has occurred."))
}

export {
    copyToClipboard
}
