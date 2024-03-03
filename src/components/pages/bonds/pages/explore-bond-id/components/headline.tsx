import {useEffect, useState} from "react";
import RefreshSVG from "../../../../../../../public/svg/utils/refresh";
import CopySVG from "../../../../../../../public/svg/utils/copy";
import {useAccount} from "wagmi";
import {useWeb3Modal} from "@web3modal/wagmi/react";
import {toast} from "react-toastify";

export default function HeadlineContainer({refreshHandler, refreshLoader}: {
    refreshHandler: any[],
    refreshLoader: boolean
}) {
    const [refreshDate, setUpdateIndex] = refreshHandler
    const [secondsPassed, setSecondsPassed] = useState(0);
    const {address} = useAccount();
    const {open} = useWeb3Modal();

    function refresh() {
        setUpdateIndex(Math.random() * 10)
    }

    function copyReferralCode() {
        if (!address) {
            return open();
        }

        const url = `${location.href.toLowerCase()}?ref=${address.toLowerCase()}`
        navigator.clipboard.writeText(url)
            .then(() => toast("Referral url was successfully copied to your clipboard."))
            .catch(() => toast.error("An error has occurred."))
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if(refreshDate) setSecondsPassed(Math.round((Date.now() - refreshDate.getTime()) / 1000))
        }, 500)
        return () => clearInterval(interval)
    }, [refreshDate]);

    return <>
        <div className='flex justify-between'>
            <div className='flex  items-center gap-2 bg-white px-4 py-1.5 rounded-md cursor-pointer'
                 onClick={copyReferralCode}>
                <CopySVG/>
                <span className='text-neutral-600 text-sm'>Copy Your Referral URL!</span>
            </div>
            <div className='flex items-center gap-2 px-2'>
                <span className='text-neutral-600 text-xs'>Refreshed {secondsPassed}s ago</span>
                <RefreshSVG isSmall={true} onClick={refresh} isLoading={refreshLoader}/>
            </div>
        </div>
    </>
}
