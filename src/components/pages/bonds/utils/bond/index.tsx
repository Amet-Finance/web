import Image from "next/image";
import Styles from "./index.module.css"
import {BondGeneral} from "@/components/pages/bonds/pages/issue/type";
import InvestmentSVG from "../../../../../../public/svg/investment";
import InterestSVG from "../../../../../../public/svg/interest";
import ClockSVG from "../../../../../../public/svg/clock";
import {formatTime, shortTime} from "@/modules/utils/dates";
import Link from "next/link";
import {stopPropagation} from "@/modules/utils/events";
import {shorten, toBN} from "@/modules/web3/util";
import PieChart from "@/components/pages/bonds/utils/bond/pie-chart";
import {divBigNumber, divBigNumberForUI, formatLargeNumber} from "@/modules/utils/numbers";
import {shortenString} from "@/modules/utils/string";
import makeBlockie from "ethereum-blockies-base64";
import WarningSVG from "../../../../../../public/svg/warning";


export default function Bond({info}: { info: BondGeneral }) {
    const {total, purchased} = info;
    const bondUrl = `${window.location.origin}/bonds/explore/${info._id}?chainId=${info.chainId}`
    if (!info.investmentTokenInfo || !info.interestTokenInfo) {
        return null;
    }

    const isSold = total - purchased === 0

    return <>
        <Link href={bondUrl}>
            <div
                className="relative flex flex-col justify-center
                rounded-md px-5 py-3 gap-2 cursor-pointer
                 bg-b3 border border-w1 hover:border-w2
                 group
                 ">
                <BondHeader bondInfo={info}/>
                <BondDetails bondInfo={info}/>
                <BondFooter bondInfo={info}/>
                {isSold && <>
                    <div
                        className='group-hover:opacity-100 opacity-0  absolute w-full h-full bg-bt9-5 top-0 left-0 rounded-md soldOut flex gap-2 justify-center items-center flex-col z-50'>
                        <span className='font-bold text-5xl'>SOLD OUT</span>
                        <span className='text-sm text-g'>Explore Bond Details!</span>
                    </div>
                </>}
            </div>
        </Link>
    </>
}

function BondHeader({bondInfo}: { bondInfo: BondGeneral }) {

    const {
        interestTokenInfo,
        investmentTokenInfo,
    } = bondInfo;


    const title = `${interestTokenInfo?.symbol}-${investmentTokenInfo?.symbol}`
    const investmentIcon = investmentTokenInfo.icon || makeBlockie(investmentTokenInfo._id);
    const interestIcon = interestTokenInfo.icon || makeBlockie(interestTokenInfo._id);

    const isWarning = !interestTokenInfo?.isVerified || !interestTokenInfo?.isVerified // todo update here
    return <>

        <div className="flex justify-between items-center gap-10 w-full">
            <div className="flex justify-between items-center w-full">
                <div className="relative flex items-center">
                    <div className="flex justify-center items-center rounded-full">
                        <Image src={investmentIcon} alt={investmentTokenInfo.name} width={26} height={26}
                               className='rounded-full'/>
                    </div>
                    <div className="translate-x-[-30%] bg-black rounded-full px-0.5">
                        <div className="flex justify-center items-center">
                            <Image src={interestIcon} alt={interestTokenInfo.name} width={26} height={26}
                                   className='rounded-full'/>
                        </div>
                    </div>
                </div>
                <div className="relative flex flex-col w-full">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">{title}</span>
                        <span className={Styles.type}>ZCB</span>
                    </div>
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
        response.investment = {
            currency: shortenString(investmentTokenInfo.symbol || "X", 5),
            amount: divBigNumberForUI(investmentTokenAmount, investmentTokenInfo?.decimals)
        }
    }
    if (interestTokenInfo) {
        response.interest = {
            currency: shortenString(interestTokenInfo.symbol || "X", 5),
            amount: divBigNumberForUI(interestTokenAmount, interestTokenInfo?.decimals)
        }
    }

    const SectionContainer = ({children}: any) => {
        return <>
            <div className='flex items-center justify-between md:gap-12 sm:gap-4 px-0 py-1'>
                {children}
            </div>
        </>
    }

    return <>
        <div className='flex md:gap-12 sm:gap-4 justify-between items-center text-sm'>
            <div className='flex flex-col py-2 rounded-md w-full'>
                <SectionContainer>
                    <div className='flex items-center gap-1.5'>
                        <InvestmentSVG/>
                        <span>Investment:</span>
                    </div>
                    <div className='flex gap-1 items-center'>
                        {!investmentTokenInfo.isVerified && <WarningSVG/>}
                        <span className='text-sm font-bold'>{response.investment.amount}</span>
                        <span className='text-sm font-bold'>{response.investment.currency}</span>
                    </div>
                </SectionContainer>
                <SectionContainer>
                    <div className='flex items-center gap-1.5'>
                        <InterestSVG/>
                        <span className='whitespace-nowrap'>Total Return:</span>
                    </div>
                    <div className='flex gap-1 items-center'>
                        {!interestTokenInfo.isVerified && <WarningSVG/>}
                        <span className='text-sm text-green-500 font-bold'>{response.interest.amount}</span>
                        <span className='text-sm text-green-500 font-bold'>{response.interest.currency}</span>
                    </div>
                </SectionContainer>
                <SectionContainer>
                    <div className='flex items-center gap-1.5'>
                        <ClockSVG/>
                        <span className='whitespace-nowrap'>Lock Period:</span>
                    </div>
                    <span
                        className='text-sm font-bold whitespace-nowrap'>{formatTime(Number(redeemLockPeriod), true, true)}</span>
                </SectionContainer>
            </div>
            <PieChart total={total} redeemed={redeemed} purchased={purchased}/>
        </div>
    </>
}

function BondFooter({bondInfo}: { bondInfo: BondGeneral }) {

    const {issuer, issuanceDate, chainId} = bondInfo;
    const addressExplorer = `/address/${issuer}`

    return <>
        <div className="flex items-center justify-between">
            <div className='flex gap-2 items-center'>
                <span className='text-xs text-g'>Issuer: </span>
                <Link href={addressExplorer} onClick={stopPropagation} target="_blank">
                    <u className='text-xs'>{shorten(issuer, 5)}</u>
                </Link>
            </div>
            <div className={Styles.section} title={new Date(issuanceDate * 1000).toString()}>
                <span className="text-xs text-g2">{shortTime(issuanceDate * 1000)}</span>
            </div>
        </div>
    </>
}
