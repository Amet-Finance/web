import BondDetails from "@/components/pages/bonds/pages/explore-id/components/bond-info";
import BondActions from "@/components/pages/bonds/pages/explore-id/components/bond-actions";
import {useEffect, useState} from "react";
import {getTokenInfo} from "@/modules/web3/tokens";
import {useSelector} from "react-redux";
import {getInfo} from "@/modules/web3/zcb";
import {TokenInfo} from "@/modules/web3/type";
import {RootState} from "@/store/redux/type";

export default function ExploreId({props}: any) {
    const [info, setInfo] = useState(props);
    const [tokens, setTokens] = useState({} as { [key: string]: TokenInfo });

    const account = useSelector((item: RootState) => item.account);
    const {address} = account


    useEffect(() => {
        const interval = setInterval(() => {
            getInfo(props._id)
                .then(response => setInfo({...response}))
                .catch(error => console.error(error));
        }, 3000)

        return () => {
            clearInterval(interval)
        }

    }, [address])

    useEffect(() => {
        const tokenContracts = [...Array.from(new Set([info.investmentToken, info.interestToken]))]

        const promises: Promise<TokenInfo | undefined>[] = []
        tokenContracts.forEach(contractAddress => {
            const promise = getTokenInfo(contractAddress, address)
            promises.push(promise)
        })

        Promise.all(promises).then(response => {
            const tokensTmp = response.reduce((acc, item) => {
                if (item) {
                    acc[item.contractAddress] = item;
                }
                return acc;
            }, {} as any)

            setTokens(tokensTmp)
        })
    }, [address, info.investmentToken, info.interestToken])


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