import {toast} from "react-toastify";
import {useWeb3Modal} from "@web3modal/wagmi/react";
import {useEffect, useState} from "react";
import ModalStore from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";

function useConnectWallet() {
    const {open} = useWeb3Modal();
    const [showModal, setShowModal] = useState(true);

    useEffect(() => {
        const result = localStorage.getItem(ModalTypes.AcceptTermsConditions);
        if (Boolean(result)) setShowModal(false)
    }, [])

    return {
        open: () => {
            if (showModal) {
                return ModalStore.openModal(ModalTypes.AcceptTermsConditions)
            } else {
                return open()
            }
        },
        setAccepted: () => {
            setShowModal(false);
            localStorage.setItem(ModalTypes.AcceptTermsConditions, JSON.stringify(true))
        }
    }
}

async function copyToClipboard(text: string, type: string) {
    return navigator.clipboard.writeText(text)
        .then(() => toast(`${type} was successfully copied to your clipboard.`))
        .catch(() => toast.error("An error has occurred."))
}

export {
    useConnectWallet,
    copyToClipboard
}
