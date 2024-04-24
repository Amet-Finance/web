import {toast} from "react-toastify";
import {useWeb3Modal} from "@web3modal/wagmi/react";
import {useEffect, useState} from "react";
import ModalStore from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";
import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";
import {ContractBalance} from "@/modules/api/type";
import {useAccount} from "wagmi";

const ONE_DAY = 24 * 60 * 60 * 1000

function useAccountExtended() {
    const account = useSelector((item: RootState) => item.account)
    const {open} = useConnectWallet()
    const {address} = useAccount()

    return {
        ...account,
        open,
        address,
        isConnected: Boolean(address)
    }
}

function useConnectWallet() {
    const {open} = useWeb3Modal();
    const [showModal, setShowModal] = useState(true);

    useEffect(() => {
        const result = localStorage.getItem(ModalTypes.AcceptTermsConditions);
        if (result) {
            const parsedResult = JSON.parse(result);
            const acceptedDate = new Date(parsedResult.date);

            // Validation for connection should stay one day
            if (!isFinite(acceptedDate.getTime()) ||  Date.now() - ONE_DAY > acceptedDate.getTime()) {
                setShowModal(true)
            } else {
                setShowModal(false)
            }
        }
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
            localStorage.setItem(ModalTypes.AcceptTermsConditions, JSON.stringify({
                date: new Date(),
                accepted: true
            }))
        }
    }
}

function useBalances({contractAddress}: { contractAddress?: string }) {
    const balances = useSelector((item: RootState) => item.account).balances;
    const contractBalances: ContractBalance[] = (contractAddress ? balances[contractAddress.toLowerCase()] : []) || [];
    const hasBalance = Object.values(balances || {}).some(item => item.some(balance => balance.balance > 0))

    return {
        balances,
        contractBalances,
        hasBalance
    }
}

async function copyToClipboard(text: string, type: string) {
    return navigator.clipboard.writeText(text)
        .then(() => toast(`${type} was successfully copied to your clipboard.`))
        .catch(() => toast.error("An error has occurred."))
}

export {
    useAccountExtended,
    useConnectWallet,
    useBalances,
    copyToClipboard
}
