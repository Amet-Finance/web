import {useEffect, useState} from "react";
import Loading from "@/components/utils/loading";
import Styles from "@/components/pages/bonds/main/components/index.module.css";
import Link from "next/link";
import {formatTime} from "@/modules/utils/dates";
import {BondInfo} from "@/components/pages/bonds/pages/issue/type";
import {getWeb3Instance} from "@/modules/web3";
import * as CloudAPI from "@/modules/cloud-api";
import VerifiedSVG from "../../../../../../public/svg/verified";
import WarningSVG from "../../../../../../public/svg/warning";

const {toBN} = getWeb3Instance().utils;

export default function BondsShowcase() {

    const [bonds, setBonds] = useState({
        isLoading: false,
        data: [] as any
    })

    useEffect(() => {
        setBonds({
            ...bonds,
            isLoading: true
        });


        CloudAPI.getBonds()
            .then(res => {
                setBonds({
                    data: res,
                    isLoading: false
                })
            })
    }, [])


    return <>
        <div className={Styles.bondsContainer}>
            <h1>Explore bonds</h1>
            <p>Some bonds info goes here</p>
            {bonds.isLoading ? <Loading/> : <BondsScreen bonds={bonds}/>}
        </div>
    </>
}

function BondsScreen({bonds}: any) {
    return <div className={Styles.bonds}>
        {bonds.data.map((item: any, index: number) => <Bond item={item} key={index}/>)}
        <ShowMore/>
    </div>
}

function Bond({item}: { item: BondInfo }) {
    const {
        total,
        purchased,
        redeemed,
        investmentTokenInfo,
        interestTokenInfo,
        investmentTokenAmount,
        interestTokenAmount
    } = item;

    const response: any = {
        total,
        purchased,
    }

    const progress = (Number(purchased) * 100) / Number(total);
    if (investmentTokenInfo) {
        const amount = investmentTokenAmount || ""
        const decimals = investmentTokenInfo.decimals || ""
        response.investment = {
            currency: investmentTokenInfo.symbol,
            amount: toBN(amount).div(toBN(10).pow(toBN(decimals))).toString()
        }
    }
    if (interestTokenInfo) {
        const amount = interestTokenAmount || ""
        const decimals = interestTokenInfo.decimals || ""
        response.interest = {
            currency: interestTokenInfo.symbol,
            amount: toBN(amount).div(toBN(10).pow(toBN(decimals))).toString()
        }
    }

    return <>
        <Link href={`/bonds/explore/${item._id}`}>
            <div className={Styles.bond}>
                <span>Total/Purchased/Redeemed: {response.total}/{item.purchased}/{item.redeemed}</span>
                <div className={Styles.section}>
                    <span>Investment: {response.investment.amount} {response.investment.currency} </span>
                    {investmentTokenInfo?.verified ? <VerifiedSVG/> : <WarningSVG/>}
                </div>
                <div className={Styles.section}>
                    <span>Interest: {response.interest.amount} {response.interest.currency}</span>
                    {interestTokenInfo?.verified ? <VerifiedSVG/> : <WarningSVG/>}
                </div>
                <span>Redeem Lock period: {formatTime(Number(item.redeemLockPeriod))}</span>
                <span>Issuer: {item.issuer}</span>
                <div className='progress'/>
            </div>
        </Link>
        <style jsx>{`
          .progress {
            height: 2px;
            width: ${progress}%;
            background-color: #00b76f;
          }
        `}</style>
    </>
}

function ShowMore() {
    return <>
        <Link href={`/bonds/explore`}>
            <div className={Styles.showMore}>
                <span>Show more</span>
            </div>
        </Link>
    </>
}