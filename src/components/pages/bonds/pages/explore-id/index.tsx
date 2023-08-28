import Styles from "./index.module.css";
import BondInfo from "@/components/pages/bonds/pages/explore-id/components/bond-info";
import BondActions from "@/components/pages/bonds/pages/explore-id/components/bond-actions";
import {useEffect, useState} from "react";
import {getTokenInfo} from "@/modules/web3/tokens";
import {useSelector} from "react-redux";
import {Account} from "@/store/redux/account/type";
import {getInfo} from "@/modules/web3/zcb";
import {TokenInfo} from "@/modules/web3/type";

export default function ExploreId({props}: any) {
    const [info, setInfo] = useState(props);
    const [tokens, setTokens] = useState({} as TokenInfo);

    const account: Account = useSelector((item: any) => item.account);
    const {address} = account


    useEffect(() => {
        const interval = setInterval(() => {
            getInfo(props._id)
                .then(response => setInfo({...response, _id: props._id}))
                .catch(error => console.error(error));
        }, 3000)

        return () => {
            clearInterval(interval)
        }

    }, [address])

    useEffect(() => {
        const investmentTokenInfo = getTokenInfo(info.investmentToken, address);
        const interestTokenInfo = getTokenInfo(info.interestToken, address);
        Promise.all([investmentTokenInfo, interestTokenInfo])
            .then(res => {
                setTokens({
                    [info.investmentToken]: res[0],
                    [info.interestToken]: res[1]
                })
            })
    }, [address, info.investmentToken, info.interestToken])


    return <>
        <div className={Styles.container}>
            <BondInfo info={info} tokens={tokens}/>
            <BondActions info={info} tokens={tokens}/>
        </div>
    </>
}