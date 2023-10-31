import BondActions from "@/components/pages/bonds/pages/explore-id/components/bond-actions";
import {useEffect, useState} from "react";
import {getTokenInfo} from "@/modules/web3/tokens";
import {useSelector} from "react-redux";
import * as Web3ZCB from "@/modules/web3/zcb";
import {BondInfoDetailed, TokenInfo} from "@/modules/web3/type";
import {RootState} from "@/store/redux/type";
import AmetLoadingFull from "@/components/utils/amet-loading-full";
import BondDetails from "@/components/pages/bonds/pages/explore-id/components/bond-info";
import {Chain, useAccount, useNetwork} from "wagmi";

export default function ExploreId({_id, chainId}: { _id: string, chainId: string }) {
    const {address} = useAccount()
    const {chain} = useNetwork();

    const [bondInfo, setBondInfo] = useState({} as BondInfoDetailed);

    const [tokens, setTokens] = useState({} as { [key: string]: TokenInfo });
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const interval = getBondInfo(chain, _id, setLoading, setBondInfo)
        return () => {
            clearInterval(interval)
        }
    }, [address, chainId, _id, chain])

    useEffect(() => {
        if (!chain) return;
        const tokenContracts = [...Array.from(new Set([bondInfo.investmentToken, bondInfo.interestToken]))]

        const promises: Promise<TokenInfo | undefined>[] = []
        tokenContracts.forEach(contractAddress => {
            const promise = getTokenInfo(chain, contractAddress, address)
            promises.push(promise)
        })

        Promise.all(promises)
            .then(response => {
                const tokensTmp = response.reduce((acc, item) => {
                    if (item) {
                        acc[item.contractAddress] = item;
                    }
                    return acc;
                }, {} as any)

                setTokens(tokensTmp)
            })
    }, [address, bondInfo.investmentToken, bondInfo.interestToken, chain])

    if (isLoading) {
        return <AmetLoadingFull/>
    }

    return <>
        <div className='flex items-center justify-center'>
            <div
                className="flex gap-4 min-h-screen xl:p-16 lg1:p-8 sm:flex-col sm:items-center lg1:flex-row lg1:items-start">
                <BondDetails info={bondInfo} tokens={tokens}/>
                <BondActions info={bondInfo} tokens={tokens}/>
            </div>
        </div>
    </>
}

function getBondInfo(chain: Chain | undefined, _id: string, setLoading: any, setBondInfo: any) {
    if (!chain) {
        return;
    }
    setLoading(true);
    Web3ZCB.getBondInfo(chain, _id)
        .then(response => {
            setBondInfo({...response})
            setLoading(false)
        })
        .catch(error => console.error(error))

    return setInterval(() => {
        Web3ZCB.getBondInfo(chain, _id)
            .then(response => setBondInfo({...response}))
            .catch(error => console.error(error));
    }, 3000);
}
