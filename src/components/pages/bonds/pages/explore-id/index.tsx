import BondDetails from "@/components/pages/bonds/pages/explore-id/components/bond-info";
import BondActions from "@/components/pages/bonds/pages/explore-id/components/bond-actions";
import {useEffect, useState} from "react";
import {getTokenInfo} from "@/modules/web3/tokens";
import {useSelector} from "react-redux";
import {getInfo} from "@/modules/web3/zcb";
import {BondInfoDetailed, TokenInfo} from "@/modules/web3/type";
import {RootState} from "@/store/redux/type";
import {BondInfo} from "@/components/pages/bonds/pages/issue/type";
import AmetLoadingFull from "@/components/utils/amet-loading-full";

export default function ExploreId({_id, chainId}: { _id: string, chainId: string }) {
    const [info, setInfo] = useState({} as BondInfoDetailed);
    const [tokens, setTokens] = useState({} as { [key: string]: TokenInfo });
    const [isLoading, setLoading] = useState(true);

    const account = useSelector((item: RootState) => item.account);
    const {address} = account

    useEffect(() => {

        setLoading(true);
        getInfo(_id, chainId)
            .then(response => {
                setInfo({...response})
                setLoading(false)
            })
            .catch(error => console.error(error))

        const interval = setInterval(() => {
            getInfo(_id, chainId)
                .then(response => setInfo({...response}))
                .catch(error => console.error(error));
        }, 3000)

        return () => {
            clearInterval(interval)
        }

    }, [_id])


    useEffect(() => {
        const tokenContracts = [...Array.from(new Set([info.investmentToken, info.interestToken]))]

        const promises: Promise<TokenInfo | undefined>[] = []
        tokenContracts.forEach(contractAddress => {
            const promise = getTokenInfo(contractAddress, address)
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
    }, [address, info.investmentToken, info.interestToken])

    if (isLoading) {
        return <AmetLoadingFull/>
    }


    return <>
        <div className='flex items-center justify-center'>
            <div
                className="flex gap-4 min-h-screen xl:p-16 lg1:p-8 sm:flex-col sm:items-center lg1:flex-row lg1:items-start">
                <BondDetails info={info} tokens={tokens}/>
                <BondActions info={info} tokens={tokens}/>
            </div>
        </div>
    </>
}