import Styles from './index.module.css'
import {useEffect, useState} from "react";
import * as CloudAPI from '../../../../../modules/cloud-api'
import {format} from "@/modules/utils/numbers";

export default function Statistics() {

    const [statistics, setStatistics] = useState({
        totalPurchased: 0,
        totalRedeemed: 0
    })

    useEffect(() => {
        CloudAPI.getStats()
            .then(response => response ? setStatistics(response) : "")
    }, [])

    return <>
        <div className={Styles.stats}>
            <div className={Styles.stat}>
                <h1>Purchased:</h1>
                <h1>${format(statistics.totalPurchased)}</h1>
            </div>
            <div className={Styles.stat}>
                <h1>Redeemed:</h1>
                <h1>${format(statistics.totalRedeemed)}</h1>
            </div>
        </div>
    </>
}