import {useEffect, useState} from "react";
import {getBonds} from "@/components/pages/bonds/main/module";
import Loading from "@/components/utils/loading";
import Styles from "@/components/pages/bonds/main/components/index.module.css";
import Link from "next/link";
import {formatTime} from "@/modules/utils/dates";
import {BondInfo} from "@/components/pages/bonds/pages/issue/type";
import {getWeb3Instance} from "@/modules/web3";

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

        const timer = setTimeout(() => {
            getBonds()
                .then(res => {
                    setBonds({
                        data: res,
                        isLoading: false
                    })
                })
        }, 1000);
        return () => clearTimeout(timer);
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
        current,
        investmentTokenInfo,
        interestTokenInfo,
        investmentTokenAmount,
        interestTokenAmount
    } = item;

    const response: any = {
        total,
        current,

    }

    const progress = (Number(current) * 100) / Number(total);
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
                <span>Total/Current: {response.total}/{item.current}</span>
                <span>Investment: {response.investment.amount} {response.investment.currency}</span>
                <span>Redemption: {response.interest.amount} {response.interest.currency}</span>
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
            <div className={Styles.bond}>
                <span>Show more</span>
            </div>
        </Link>
    </>
}