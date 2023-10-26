import Image from "next/image";
import Styles from "./index.module.css"
import {getIcon} from "@/modules/utils/images";
import {BondGeneral} from "@/components/pages/bonds/pages/issue/type";
import InvestmentSVG from "../../../../../../public/svg/investment";
import InterestSVG from "../../../../../../public/svg/interest";
import ClockSVG from "../../../../../../public/svg/clock";
import {formatTime, shortTime} from "@/modules/utils/dates";
import Link from "next/link";
import {getExplorerAddress, shorten} from "@/modules/web3/utils/address";
import {useEffect, useState} from "react";
import {stopPropagation} from "@/modules/utils/events";
import {toBN} from "@/modules/web3/util";
import PieChart from "@/components/pages/bonds/utils/bond/pie-chart";
import Loading from "@/components/utils/loading";
import axios from "axios";
import {formatLargeNumber} from "@/modules/utils/numbers";
import {shortenString} from "@/modules/utils/string";


export default function Bond({info}: { info: BondGeneral }) {
    const bondUrl = `${window.location.origin}/bonds/explore/${info._id}?chainId=${info.chainId}`
    if (!info.investmentTokenInfo || !info.interestTokenInfo) {
        return null;
    }

    return <>
        <Link href={bondUrl}>
            <div
                className="flex flex-col justify-center
                rounded-md px-5 py-3 gap-3 cursor-pointer
                 bg-b3 border border-w1 hover:border-w2

                 ">
                <BondHeader bondInfo={info}/>
                <BondDetails bondInfo={info}/>
                <BondFooter bondInfo={info}/>
            </div>
        </Link>
    </>
}

function BondHeader({bondInfo}: { bondInfo: BondGeneral }) {
    const {
        chainId,
        interestTokenInfo,
        investmentTokenInfo,
        investmentToken,
        interestToken,
    } = bondInfo;

    const [investment, setInvestment] = useState({
        isVerified: true
    })
    const [interest, setInterest] = useState({
        isVerified: true
    })

    const interestIcon = getIcon(chainId, interestToken)
    const investmentIcon = getIcon(chainId, investmentToken)

    const title = `${interestTokenInfo?.symbol}-${investmentTokenInfo?.symbol}`


    const isWarning = !interest.isVerified || !investment.isVerified // todo update here
    return <>

        <div className="flex justify-between items-center gap-10 w-full">
            <div className="flex justify-between items-center w-full">
                <div className="relative flex items-center">
                    <div className="flex justify-center items-center rounded-full">
                        <TokenImage src={investmentIcon}
                             alt={investmentTokenInfo?.symbol}
                             handler={[investment, setInvestment]}/>
                    </div>
                    <div className="translate-x-[-30%] bg-black rounded-full px-0.5">
                        <div className="flex justify-center items-center">
                            <TokenImage src={interestIcon}
                                 alt={interestTokenInfo.symbol}
                                 handler={[interest, setInterest]}/>
                        </div>
                    </div>
                </div>
                <div className="relative flex flex-col w-full">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">{title}</span>
                        <span className={Styles.type}>ZCB</span>
                    </div>
                    {Boolean(isWarning) &&
                        <span className='text-red-700 text-xs text-start absolute top-full left-0 w-full'>Warning: Please proceed with caution.</span>
                    }
                </div>
            </div>
        </div>
    </>
}

function BondDetails({bondInfo}: { bondInfo: BondGeneral }) {


    const {
        total,
        purchased,
        redeemed,
        interestTokenInfo,
        investmentTokenAmount,
        interestTokenAmount,
        investmentTokenInfo,
        redeemLockPeriod,
    } = bondInfo;

    const response: any = {}

    if (investmentTokenInfo) {
        const isFake = investmentTokenInfo.isFake;
        const amount = investmentTokenAmount || ""
        const decimals = investmentTokenInfo.decimals || ""
        response.investment = {
            currency: isFake ? "?" : shortenString(investmentTokenInfo.symbol, 5),
            amount: isFake ? "?" : formatLargeNumber(Number(toBN(amount).div(toBN(10).pow(toBN(decimals))).toString()))
        }
    }
    if (interestTokenInfo) {
        const isFake = investmentTokenInfo.isFake;
        const amount = interestTokenAmount || ""
        const decimals = interestTokenInfo.decimals || ""

        const price = isFake ? "?" : toBN(amount).div(toBN(10).pow(toBN(decimals))).toString()
        response.interest = {
            currency: isFake ? "?" : shortenString(interestTokenInfo.symbol, 5),
            amount: isFake ? "?" : formatLargeNumber(Number(toBN(amount).div(toBN(10).pow(toBN(decimals))).toString()))
        }
    }

    const SectionContainer = ({children}: any) => {
        return <>
            <div className='flex items-center justify-between md:gap-20 sm:gap-4 px-0 py-1'>
                {children}
            </div>
        </>
    }

    return <>
        <div className='flex md:gap-12 sm:gap-4 justify-between items-center text-sm'>
            <div className='flex flex-col py-2 rounded-md'>
                <SectionContainer>
                    <div className='flex items-center gap-1'>
                        <InvestmentSVG/>
                        <span className='text-g'>Investment:</span>
                    </div>
                    <div className='flex gap-1 items-center'>
                        <span className='text-sm font-bold'>{response.investment.amount}</span>
                        <span className='text-sm font-bold'>{response.investment.currency}</span>
                    </div>
                </SectionContainer>
                <SectionContainer>
                    <div className='flex items-center gap-1'>
                        <InterestSVG/>
                        <span className='text-g whitespace-nowrap'>Total Return:</span>
                    </div>
                    <div className='flex gap-1 items-center'>
                        <span className='text-sm text-green-500 font-bold'>{response.interest.amount}</span>
                        <span className='text-sm text-green-500 font-bold'>{response.interest.currency}</span>
                    </div>
                </SectionContainer>
                <SectionContainer>
                    <div className='flex items-center gap-1'>
                        <ClockSVG/>
                        <span className='text-g whitespace-nowrap'>Lock Period:</span>
                    </div>
                    <span className='text-sm font-bold'>{formatTime(Number(redeemLockPeriod), true, true)}</span>
                </SectionContainer>
            </div>
            <PieChart total={total} redeemed={redeemed} purchased={purchased}/>
        </div>
    </>
}

function BondFooter({bondInfo}: { bondInfo: BondGeneral }) {

    const {issuer, issuanceDate, chainId} = bondInfo;

    return <>
        <div className="flex items-center justify-between">
            <p className="text-xs text-g">Issuer:&nbsp;
                <Link href={getExplorerAddress(chainId, issuer)} onClick={stopPropagation} target="_blank">
                    <u>{shorten(issuer, 5)}</u>
                </Link>
            </p>
            <div className={Styles.section} title={new Date(issuanceDate * 1000).toString()}>
                <span className="text-xs text-g2">{shortTime(issuanceDate * 1000)}</span>
            </div>
        </div>
    </>
}

function TokenImage({src, alt, handler}: any) {

    const [state, setter] = handler;
    const [isLoading, setLoading] = useState(true)
    const [srcC, setSrcC] = useState(src)

    const handleError = () => {
        setter({
            isVerified: false
        })
    }


    useEffect(() => {
        axios.get(src)
            .then(() => handleSuccess())
            .catch(() => handleError())
            .finally(() => setLoading(false))
    }, []);

    const handleSuccess = () => setter({isVerified: true})

    if (isLoading) {
        return <Loading percent={50}/>
    }

    return <>{
        state.isVerified ?
            <Image src={srcC} alt={alt} width={26} height={26} onError={handleError} onLoad={handleSuccess}/> :
            <Image src="/svg/question.svg" alt={alt} width={26} height={26}/>}</>
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
                <Link href={urls.twitter} onClick={stopPropagation} target="_blank">
                    <div className='flex items-center gap-2 w-full'>
                        <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.5552 9.41704C9.8396 9.41704 9.19484 9.70671 8.74735 10.1675L4.72237 7.83089C4.82983 7.57304 4.88943 7.29298 4.88943 7C4.88943 6.70691 4.82983 6.42685 4.72237 6.16911L8.74735 3.8324C9.19484 4.29318 9.8396 4.58296 10.5552 4.58296C11.9033 4.58296 13 3.55501 13 2.29143C13 1.02785 11.9033 0 10.5552 0C9.20715 0 8.11046 1.02795 8.11046 2.29153C8.11046 2.58452 8.17017 2.86458 8.27751 3.12242L4.25265 5.45903C3.80516 4.99825 3.1604 4.70847 2.44477 4.70847C1.09669 4.70847 0 5.73653 0 7C0 8.26358 1.09669 9.29153 2.44477 9.29153C3.1604 9.29153 3.80516 9.00186 4.25265 8.54097L8.27751 10.8776C8.17017 11.1354 8.11046 11.4155 8.11046 11.7086C8.11046 12.972 9.20715 14 10.5552 14C11.9033 14 13 12.972 13 11.7086C13 10.445 11.9033 9.41704 10.5552 9.41704ZM9.00192 2.29153C9.00192 1.48874 9.69875 0.835587 10.5552 0.835587C11.4117 0.835587 12.1085 1.48874 12.1085 2.29153C12.1085 3.09433 11.4117 3.74748 10.5552 3.74748C9.69875 3.74748 9.00192 3.09433 9.00192 2.29153ZM2.44477 8.45595C1.58818 8.45595 0.891349 7.8028 0.891349 7C0.891349 6.19721 1.58818 5.54405 2.44477 5.54405C3.30125 5.54405 3.99797 6.19721 3.99797 7C3.99797 7.8028 3.30125 8.45595 2.44477 8.45595ZM9.00192 11.7085C9.00192 10.9057 9.69875 10.2525 10.5552 10.2525C11.4117 10.2525 12.1085 10.9057 12.1085 11.7085C12.1085 12.5113 11.4117 13.1644 10.5552 13.1644C9.69875 13.1644 9.00192 12.5113 9.00192 11.7085Z"
                                fill="#8F9190"/>
                        </svg>
                        <span>Share</span>
                    </div>
                </Link>
            </div>
        </div>
    </>
}
