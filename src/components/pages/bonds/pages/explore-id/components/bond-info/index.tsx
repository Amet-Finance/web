import Styles from "./index.module.css";
import {CHAIN_INFO, DEFAULT_CHAIN_ID} from "@/modules/web3/constants";
import Link from "next/link";
import {formatTime} from "@/modules/utils/dates";
import {useEffect} from "react";

export default function BondInfo({info}: any) {


    return <>
        <div className={Styles.bondInfo}>
            <BondIssuerInfo info={info}/>
            <TotalInfo info={info}/>
            <BondLockInfo info={info}/>
            <BondTokensInfo info={info}/>
        </div>
    </>
}

function BondIssuerInfo({info}: any) {
    const bondAddress = `${CHAIN_INFO[DEFAULT_CHAIN_ID].explorer}/address/${info._id}`
    const explorerAddress = `${CHAIN_INFO[DEFAULT_CHAIN_ID].explorer}/address/${info.issuer}`

    return <>
        <div className={Styles.section}>
            <div className={Styles.sectionHorizontal}>
                <span>Bond contract:</span>
                <Link href={bondAddress} target="_blank">
                    <span className="link">{info._id}</span>
                </Link>
            </div>
            <div className={Styles.sectionHorizontal}>
                <span>Issuer:</span>
                <Link href={explorerAddress} target="_blank">
                    <span className="link">{info.issuer}</span>
                </Link>
            </div>
        </div>
    </>
}

function TotalInfo({info}: any) {


    return <>
        <div className={Styles.section}>
            <div className={Styles.sectionHorizontal}>
                <span>Total Bonds issued:</span>
                <span>{info.total}</span>
            </div>
            <div className={Styles.sectionHorizontal}>
                <span>Bonds left to be sold:</span>
                <span>{info.total - info.current}</span>
            </div>
        </div>
    </>
}

function BondLockInfo({info}: any) {
    return <>
        <div className={Styles.section}>
            <div className={Styles.sectionHorizontal}>
                <span>Redeem lock period:</span>
                <span>{formatTime(Number(info.redeemLockPeriod))}</span>
            </div>
        </div>
    </>
}

function BondTokensInfo({info}: any) {
    useEffect(() => {
        console.log(info)

    }, [])
    return <></>
}