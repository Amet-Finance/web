import BondActions from "@/components/pages/bonds/pages/explore-id/components/bond-actions";
import {useEffect, useState} from "react";

import BondDetails from "@/components/pages/bonds/pages/explore-id/components/bond-info";
import {getChain} from "@/modules/utils/wallet-connect";
import {DetailedBondResponse} from "@/modules/cloud-api/type";
import CloudAPI from "@/modules/cloud-api";
import {toast} from "react-toastify";

export default function ExploreId({bondInfoDetailed}: { bondInfoDetailed: DetailedBondResponse }) {
    const [bondInfo, setBondInfo] = useState(bondInfoDetailed as DetailedBondResponse);
    const [refresh, setRefresh] = useState(0);
    const [isLoading, setLoading] = useState(false);


    const bondHandler = [bondInfo, setBondInfo];
    const loadingHandler = [isLoading, setLoading];
    const refreshHandler = [refresh, setRefresh];

    useEffect(() => {
        const interval = getBondInfo(bondHandler, loadingHandler, refresh)
        return () => clearInterval(interval)
    }, [refresh])


    return <>
        <div className='flex items-center justify-center md:w-auto sm:w-full min-h-screen'>
            <div className="flex flex-col gap-2 justify-center xl:px-16 lg1:px-8 sm:py-4">
                <div className='flex gap-4 lg1:flex-row sm:flex-col lg1:items-start sm:items-center md:w-auto sm:w-full'>
                    <BondDetails bondInfo={bondInfo} loadingHandler={loadingHandler} refreshHandler={refreshHandler}/>
                    <BondActions bondInfo={bondInfo} refreshHandler={refreshHandler}/>
                </div>
            </div>
        </div>
    </>
}

function getBondInfo(bondHandler: any[], loadingHandler: any[], refresh: number) {
    const [bondInfo, setBondInfo] = bondHandler;
    const [isLoading, setLoading] = loadingHandler
    const {contractInfo} = bondInfo;

    const chain = getChain(contractInfo.chainId)
    if (!chain || !contractInfo._id) return undefined;

    if (isLoading) {
        toast.error(`Already loading`)
        return;
    }

    if (refresh !== 0) {
        setLoading(true);
        CloudAPI.getBondDetailed({chainId: chain.id, _id: contractInfo._id})
            .then(response => Boolean(response) && setBondInfo({...response, lastUpdated: Date.now()}))
            .catch(error => console.error(error))
            .finally(() => setLoading(false));
    }


    return setInterval(() => {
        setLoading(true);
        CloudAPI.getBondDetailed({chainId: chain.id, _id: contractInfo._id})
            .then(response => Boolean(response) && setBondInfo({...response, lastUpdated: Date.now()}))
            .catch(error => console.error(error))
            .finally(() => setLoading(false));
    }, 30000);
}
