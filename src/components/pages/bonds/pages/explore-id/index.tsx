import BondActions from "@/components/pages/bonds/pages/explore-id/components/bond-actions";
import {useEffect, useState} from "react";
import * as Web3ZCB from "@/modules/web3/zcb";
import {BondInfoDetailed} from "@/modules/web3/type";
import BondDetails from "@/components/pages/bonds/pages/explore-id/components/bond-info";
import {useAccount} from "wagmi";
import {getChain} from "@/modules/utils/wallet-connect";
import CloudAPI from "@/modules/cloud-api";
import {TokensResponse} from "@/modules/cloud-api/type";
import {nop} from "@/modules/utils/function";

export default function ExploreId({bondInfoTmp}: { bondInfoTmp: BondInfoDetailed }) {
    const {address} = useAccount()

    const [bondInfo, setBondInfo] = useState(bondInfoTmp as BondInfoDetailed);
    const {_id, investmentToken, chainId, interestToken} = bondInfo

    const [tokens, setTokens] = useState({} as TokensResponse);

    useEffect(() => {
        const interval = getBondInfo([bondInfo, setBondInfo])
        return () => {
            clearInterval(interval)
        }
    }, [address, chainId, _id, chainId])


    useEffect(() => {

        const contractAddresses = [...Array.from(new Set([bondInfo.investmentToken, bondInfo.interestToken]))]
        const params = {
            chainId,
            contractAddresses
        }

        CloudAPI.getTokens({params})
            .then(response => {
                setTokens(response)
            })
            .catch(nop)

    }, [address, _id, investmentToken, interestToken, chainId])


    return <>
        <div className='flex items-center justify-center'>
            <div
                className="flex gap-4 min-h-screen xl:p-16 lg1:p-8 sm:pb-12 sm:pt-8 sm:flex-col sm:items-center lg1:flex-row lg1:items-start">
                <BondDetails info={bondInfo} tokens={tokens}/>
                <BondActions info={bondInfo} tokens={tokens}/>
            </div>
        </div>
    </>
}

function getBondInfo(bondHandler: any) {
    const [bondInfo, setBondInfo] = bondHandler
    const chain = getChain(bondInfo.chainId)
    if (!chain) {
        return;
    }

    return setInterval(() => {
        Web3ZCB.getBondInfo(chain, bondInfo._id)
            .then(response => setBondInfo({...response}))
            .catch(error => console.error(error));
    }, 3000);
}
