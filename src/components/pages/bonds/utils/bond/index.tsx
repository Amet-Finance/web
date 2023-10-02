import Image from "next/image";
import Styles from "./index.module.css"
import {getIcon} from "@/modules/utils/images";
import {BondGeneral} from "@/components/pages/bonds/pages/issue/type";
import InvestmentSVG from "../../../../../../public/svg/investment";
import {getWeb3Instance} from "@/modules/web3";
import VerifiedSVG from "../../../../../../public/svg/verified";
import InterestSVG from "../../../../../../public/svg/interest";
import ClockSVG from "../../../../../../public/svg/clock";
import {formatTime} from "@/modules/utils/dates";
import Link from "next/link";
import {getExplorerAddress, shorten} from "@/modules/web3/utils/address";
import CopySVG from "../../../../../../public/svg/copy";
import {toast} from "react-toastify";
import RoundProgressBar from "@/components/pages/bonds/utils/bond/round-progress";
import {useState} from "react";
import WarningSVG from "../../../../../../public/svg/warning";
import InfoSVG from "../../../../../../public/svg/info";
import {InfoDetails} from "@/components/pages/bonds/utils/bond/constants";
import {Router, useRouter} from "next/router";

const {toBN} = getWeb3Instance().utils;

export default function Bond({info}: { info: BondGeneral }) {


    const [investment, setInvestment] = useState({
        isVerified: true
    })
    const [interest, setInterest] = useState({
        isVerified: true
    })

    const {
        _id,
        total,
        purchased,
        redeemed,
        interestTokenInfo,
        investmentTokenAmount,
        interestTokenAmount,
        investmentTokenInfo,
        investmentToken,
        interestToken,
        redeemLockPeriod,
        issuer
    } = info;

    const router = useRouter();
    const interestIcon = getIcon(interestToken)
    const investmentIcon = getIcon(investmentToken)

    const title = `${interestTokenInfo.symbol}-${investmentTokenInfo.symbol}`
    const response: any = {
        total,
        purchased,
    }

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

    const isWarning = !interest.isVerified || !investment.isVerified
    const bondUrl = `${window.location.origin}/bonds/explore/${_id}`

    const copyWholeURl = () => {
        return navigator.clipboard.writeText(bondUrl)
            .then(() => toast("URL successfully copied to your clipboard."))
            .catch(() => toast.error("An error has occurred"))
    }

    const stopPropagation = (event: any) => event.stopPropagation()

    return <>
        <Link className={Styles.container} href={bondUrl}>

            <div className={Styles.section}>
                <div className={Styles.section}>
                    <div className={Styles.icons}>
                        <div className={Styles.icon}>
                            <Img src={investmentIcon}
                                 alt={investmentTokenInfo.symbol}
                                 type='investment'
                                 setter={setInvestment}/>
                        </div>
                        <div className={Styles.iconInterest}>
                            <div className={Styles.icon}>
                                <Img src={interestIcon}
                                     alt={interestTokenInfo.symbol}
                                     type='interest'
                                     setter={setInterest}/>
                            </div>
                        </div>
                    </div>
                    <div className={Styles.sectionC}>
                        <div className={Styles.sectionClose}>
                            <span className={Styles.title}>{title}</span>
                            <span className={Styles.type}>ZCB</span>
                        </div>
                        {Boolean(isWarning) && <>
                            <div className={Styles.warning}>
                                <span>Warning: Please proceed with caution</span>
                            </div>
                        </>}
                    </div>
                </div>
                <div className={Styles.externals}>
                    <CopySVG onClick={copyWholeURl}/>
                    <ThreeDotsSVG url={bondUrl}/>
                </div>
            </div>
            <div className={Styles.boxes}>
                <div className={Styles.box}>
                    <div className={Styles.info}>
                        <InfoSVG info={InfoDetails.Investment}/>
                    </div>
                    <InvestmentSVG/>
                    <span className={Styles.gray}>Investment:</span>
                    <div className={Styles.amountSection}>
                        <span>{response.investment.amount} {response.investment.currency} </span>
                        {Boolean(investment.isVerified) ? <VerifiedSVG/> : <WarningSVG/>}
                    </div>
                </div>
                <div className={Styles.box}>
                    <div className={Styles.info}>
                        <InfoSVG info={InfoDetails.Interest}/>
                    </div>
                    <InterestSVG/>
                    <span className={Styles.gray}>Interest:</span>
                    <div className={Styles.amountSection}>
                        <span>{response.interest.amount} {response.interest.currency} </span>
                        {Boolean(interest.isVerified) ? <VerifiedSVG/> : <WarningSVG/>}
                    </div>
                </div>
                <div className={Styles.box}>
                    <div className={Styles.info}>
                        <InfoSVG info={InfoDetails.RedeemLockPeriod}/>
                    </div>
                    <ClockSVG/>
                    <span className={Styles.gray}>RLP:</span>
                    <span>{formatTime(Number(redeemLockPeriod), true)}</span>
                </div>
                <RoundProgressBar total={total} purchased={purchased} redeemed={redeemed}/>
            </div>
            <div className={Styles.section}>
                <div className={Styles.section}>
                    <p className={Styles.gray}>Issuer: <Link href={getExplorerAddress(issuer)} onClick={stopPropagation}
                                                             target="_blank">
                        <u>{shorten(issuer, 5)}</u>
                    </Link></p>
                </div>
                {/*<div className={Styles.section}>*/}
                {/*    <span>Issued at</span>*/}
                {/*</div>*/}
            </div>
        </Link>
    </>
}

function Img({src, alt, type, setter}: any) {
    const [srcC, setSrcC] = useState(src)

    return <>
        <Image src={srcC} alt={alt} width={32} height={32} onError={() => {
            setSrcC('/svg/question.svg');
            setter({
                isVerified: false
            })
        }}/>
    </>
}

function ThreeDotsSVG({url}: { url: string }) {
    const urls = {
        twitter: `https://twitter.com/share?text=Check out these exciting on-chain bonds on Amet Finance! 💰 &url=${url}&hashtags=DeFi,InvestmentOpportunities`
    }

    return <>
        <div className={Styles.threeDot}>
            <svg width="16" height="3" viewBox="0 0 16 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="14.5044" cy="1.48612" rx="1.48612" ry="1.49562" transform="rotate(90 14.5044 1.48612)"
                         fill="white"/>
                <ellipse cx="7.85008" cy="1.51389" rx="1.48612" ry="1.49562" transform="rotate(90 7.85008 1.51389)"
                         fill="white"/>
                <ellipse cx="1.49657" cy="1.48612" rx="1.48612" ry="1.49562" transform="rotate(90 1.49657 1.48612)"
                         fill="white"/>
            </svg>
            <div className={Styles.threeDotBar}>
                <Link className={Styles.sectionClose} href={urls.twitter} onClick={event => event.stopPropagation()}
                      target="_blank">
                    <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.5552 9.41704C9.8396 9.41704 9.19484 9.70671 8.74735 10.1675L4.72237 7.83089C4.82983 7.57304 4.88943 7.29298 4.88943 7C4.88943 6.70691 4.82983 6.42685 4.72237 6.16911L8.74735 3.8324C9.19484 4.29318 9.8396 4.58296 10.5552 4.58296C11.9033 4.58296 13 3.55501 13 2.29143C13 1.02785 11.9033 0 10.5552 0C9.20715 0 8.11046 1.02795 8.11046 2.29153C8.11046 2.58452 8.17017 2.86458 8.27751 3.12242L4.25265 5.45903C3.80516 4.99825 3.1604 4.70847 2.44477 4.70847C1.09669 4.70847 0 5.73653 0 7C0 8.26358 1.09669 9.29153 2.44477 9.29153C3.1604 9.29153 3.80516 9.00186 4.25265 8.54097L8.27751 10.8776C8.17017 11.1354 8.11046 11.4155 8.11046 11.7086C8.11046 12.972 9.20715 14 10.5552 14C11.9033 14 13 12.972 13 11.7086C13 10.445 11.9033 9.41704 10.5552 9.41704ZM9.00192 2.29153C9.00192 1.48874 9.69875 0.835587 10.5552 0.835587C11.4117 0.835587 12.1085 1.48874 12.1085 2.29153C12.1085 3.09433 11.4117 3.74748 10.5552 3.74748C9.69875 3.74748 9.00192 3.09433 9.00192 2.29153ZM2.44477 8.45595C1.58818 8.45595 0.891349 7.8028 0.891349 7C0.891349 6.19721 1.58818 5.54405 2.44477 5.54405C3.30125 5.54405 3.99797 6.19721 3.99797 7C3.99797 7.8028 3.30125 8.45595 2.44477 8.45595ZM9.00192 11.7085C9.00192 10.9057 9.69875 10.2525 10.5552 10.2525C11.4117 10.2525 12.1085 10.9057 12.1085 11.7085C12.1085 12.5113 11.4117 13.1644 10.5552 13.1644C9.69875 13.1644 9.00192 12.5113 9.00192 11.7085Z"
                            fill="#8F9190"/>
                    </svg>
                    <span>Share</span>
                </Link>
            </div>
        </div>
    </>
}