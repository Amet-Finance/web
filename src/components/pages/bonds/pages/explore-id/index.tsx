import Styles from "./index.module.css";
import BondInfo from "@/components/pages/bonds/pages/explore-id/components/bond-info";
import BondActions from "@/components/pages/bonds/pages/explore-id/components/bond-actions";
import {useEffect, useState} from "react";
import {getTokenInfo} from "@/modules/web3/tokens";
import {useSelector} from "react-redux";
import {Account} from "@/store/redux/account/type";

export default function Explore({props}: any) {
    const [info, setInfo] = useState(props);
    const account: Account = useSelector((item: any) => item.account);
    const {address} = account


    useEffect(() => {
        if (address) {

            const investmentTokenInfo = getTokenInfo(info.investmentToken, address);
            const interestTokenInfo = getTokenInfo(info.interestToken, address);
            Promise.all([investmentTokenInfo, interestTokenInfo])
                .then(res => {
                    setInfo({
                        ...info,
                        investmentTokenInfo: res[0],
                        interestTokenInfo: res[1]
                    })
                })
        }
    }, [address])


    return <>
        <div className={Styles.container}>
            <BondInfo info={info}/>
            <BondActions info={info}/>
        </div>
    </>
}