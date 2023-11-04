import Styles from './index.module.css'
import {useEffect, useState} from "react";
import {format} from "@/modules/utils/numbers";
import Loading from "@/components/utils/loading";
import * as CloudApi from "@/modules/cloud-api";
import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";
import {useNetwork} from "wagmi";
import {defaultChain} from "@/modules/utils/wallet-connect";

const Keys: { [key: string]: any } = {
    issued: {
        name: "Total Issued",
        value: (val: any) => format(val)
    },
    volumeUSD: {
        name: "Volume USD",
        value: (val: any) => `$${format(val)}`
    },
    purchased: {
        name: "Total Purchased",
        value: (val: any) => format(val)
    },
    redeemed: {
        name: "Total Redeemed",
        value: (val: any) => format(val)
    }
}

export default function Statistics() {

    const {chain} = useNetwork();
    const chainId = chain?.id || defaultChain.id

    const [isLoading, setLoading] = useState(false);
    const [statistics, setStatistics] = useState({
        issued: 0,
        volumeUSD: 0,
        purchased: 0,
        redeemed: 0
    } as { [key: string]: number })

    const statisticsKeys = Object.keys(Keys)

    useEffect(() => {
        setLoading(true);
        CloudApi.getStats({chainId})
            .then(response => {
                if (response) {
                    setStatistics(response)
                }
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
            })
    }, [chainId])

    return <>
        <div className={Styles.stats}>
            {

                statisticsKeys.map((name: any, index: number) =>
                    <Stat
                        name={name}
                        value={statistics[name]}
                        isLast={statisticsKeys.length - index - 1 == 0}
                        isLoading={isLoading}
                        key={name}/>)
            }
        </div>
    </>
}

function Stat({name, value, isLast, isLoading}: any) {
    const item = Keys[name];

    return <>
        <div className={Styles.stat}>
            {isLoading ?
                <Loading/>
                :
                <>
                    <span className={Styles.statMain}>{item?.value(value)}</span>
                    <span className={Styles.gray}>{item?.name}</span>
                </>
            }
        </div>
        {!Boolean(isLast) && <div className={Styles.verticalLine}/>}
    </>
}
