import Styles from './index.module.css'
import {useEffect, useState} from "react";
import {format} from "@/modules/utils/numbers";
import Loading from "@/components/utils/loading";
import * as CloudApi from "@/modules/cloud-api";

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


    const [isLoading, setLoading] = useState(false);
    const [statistics, setStatistics] = useState({
        issued: 0,
        volumeUSD: 0,
        purchased: 0,
        redeemed: 0
    } as { [key: string]: number })

    useEffect(() => {
        setLoading(true);
        CloudApi.getStats()
            .then(response => {
                if (response) {
                    setStatistics(response)
                }
                setLoading(false);
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    return <>
        <div className={Styles.stats}>
            {
                Object.keys(statistics)
                    .map((name: any) =>
                        <Stat
                            name={name}
                            value={statistics[name]}
                            isLoading={isLoading}
                            key={name}/>)
            }
        </div>
    </>
}

function Stat({name, value, isLoading}: any) {
    const item = Keys[name];

    return <>
        <div className={Styles.stat}>
            {isLoading ?
                <Loading/>
                :
                <>
                    <span className={Styles.statMain}>{item?.value(value)}</span>
                    <span className={Styles.statSec}>{item?.name}</span>
                </>
            }
        </div>
    </>
}