import {useEffect, useState} from "react";
import RefreshSVG from "../../../../../../../public/svg/utils/refresh";
import CopySVG from "../../../../../../../public/svg/utils/copy";
import {useAccount} from "wagmi";
import {copyReferralCode} from "@/components/pages/bonds/pages/explore-bond-id/utils";
import {ContractCoreDetails} from "@/modules/api/contract-type";

export default function HeadlineContainer({contractInfo, refreshHandler, refreshLoader}: {
    refreshHandler: any[],
    refreshLoader: boolean,
    contractInfo: ContractCoreDetails
}) {
    const [refreshDate, setUpdateIndex] = refreshHandler
    const [secondsPassed, setSecondsPassed] = useState(0);
    const {address} = useAccount();

    function refresh() {
        setUpdateIndex(Math.random() * 10)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (refreshDate) setSecondsPassed(Math.round((Date.now() - refreshDate.getTime()) / 1000))
        }, 500)
        return () => clearInterval(interval)
    }, [refreshDate]);

    // todo fix this, fetch from blockchain
    return (
        <div className='flex justify-between'>
            <button className='flex items-center gap-2 px-4 py-1.5 rounded-md cursor-pointer bg-green-500 text-white hover:scale-105'
                    onClick={copyReferralCode.bind(null, address)}>
                <CopySVG color="#fff"/>
                <span className='text-sm md:flex hidden font-medium'>Copy Your Referral Link & Earn {contractInfo.referrerRewardRate}%!</span>
            </button>
            <div className='flex items-center gap-2 px-2'>
                <span className='text-neutral-600 text-xs'>Refreshed {secondsPassed}s ago</span>
                <RefreshSVG isSmall={true} onClick={refresh} isLoading={refreshLoader}/>
            </div>
        </div>
    )
}
