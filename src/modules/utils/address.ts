import {toast} from "react-toastify";

async function copyAddress(address: string) {
    return navigator.clipboard.writeText(address)
        .then(() => toast("Address was successfully copied to your clipboard."))
        .catch(() => toast.error("An error has occurred."))
}

export {
    copyAddress
}
