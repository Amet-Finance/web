import BondActions from "@/components/pages/bonds/pages/explore-id/components/bond-actions";
import {useEffect, useState} from "react";
import * as Web3ZCB from "@/modules/web3/zcb";
import {BondDescription, BondInfoDetailed} from "@/modules/web3/type";
import BondDetails from "@/components/pages/bonds/pages/explore-id/components/bond-info";
import {useAccount} from "wagmi";
import {getChain} from "@/modules/utils/wallet-connect";
import CloudAPI from "@/modules/cloud-api";
import {TokensResponse} from "@/modules/cloud-api/type";
import {nop} from "@/modules/utils/function";

export default function ExploreId({bondInfoTmp, bondDescription}: {
    bondInfoTmp: BondInfoDetailed,
    bondDescription: BondDescription
}) {
    const {address} = useAccount()

    const [bondInfo, setBondInfo] = useState(bondInfoTmp as BondInfoDetailed);
    const {_id, investmentToken, chainId, interestToken} = bondInfo

    const [tokens, setTokens] = useState({} as TokensResponse);

    useEffect(() => {
        const interval = getBondInfo([bondInfo, setBondInfo])
        return () => clearInterval(interval)
    }, [address, chainId, _id, chainId])


    useEffect(() => {
        const contractAddresses = [...Array.from(new Set([bondInfo.investmentToken, bondInfo.interestToken]))].filter(item => Boolean(item))
        const params = {chainId, contractAddresses}

        if (contractAddresses.length) {
            CloudAPI.getTokens({params})
                .then(response => setTokens(response))
                .catch(nop)
        }

    }, [address, _id, investmentToken, interestToken, chainId])


    return <>
        <div className='flex items-center justify-center md:w-auto sm:w-full'>
            <div
                className="flex gap-4 min-h-screen xl:p-16 lg1:p-8 sm:pb-12 sm:pt-8 sm:flex-col sm:items-center lg1:flex-row lg1:items-start md:w-auto sm:w-full">
                <BondDetails info={bondInfo} tokens={tokens} bondDescription={bondDescription}/>
                <BondActions info={bondInfo} tokens={tokens} bondDescription={bondDescription}/>
            </div>
        </div>
    </>
}

function getBondInfo(bondHandler: any) {
    const [bondInfo, setBondInfo] = bondHandler
    const chain = getChain(bondInfo.chainId)
    if (!chain || !bondInfo._id) return undefined;

    return setInterval(() => {
        Web3ZCB.getBondInfo(chain, bondInfo._id)
            .then(response => setBondInfo({...response}))
            .catch(error => console.error(error));
    }, 3000);
}
