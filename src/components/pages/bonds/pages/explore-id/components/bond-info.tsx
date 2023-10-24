import Image from "next/image";
import Link from "next/link";
import {Tokens} from "@/components/pages/bonds/pages/issue/type";
import {BondInfoDetailed, TokenInfo} from "@/modules/web3/type";
import {format, formatLargeNumber} from "@/modules/utils/numbers";
import {getExplorerAddress, shorten} from "@/modules/web3/utils/address";
import CopySVG from "../../../../../../../public/svg/copy";
import {toast} from "react-toastify";
import {URLS} from "@/modules/utils/urls";
import RoundProgress from "@/components/pages/bonds/utils/bond/round-progress";
import InterestSVG from "../../../../../../../public/svg/interest";
import InvestmentSVG from "../../../../../../../public/svg/investment";
import InfoSVG from "../../../../../../../public/svg/info";
import Loading from "@/components/utils/loading";
import SecuritySVG from "../../../../../../../public/svg/security";
import {getExplorerToken} from "@/modules/web3/utils/token";
import {toBN} from "@/modules/web3/util";
import {CHAIN_INFO} from "@/modules/web3/constants";
import {formatTime} from "@/modules/utils/dates";
import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";
import PieChart from "@/components/pages/bonds/utils/bond/pie-chart";
import ClockSVG from "../../../../../../../public/svg/clock";
import {useEffect, useState} from "react";
import {shortenString} from "@/modules/utils/string";
import axios from "axios";
import {loadPostcssImport} from "tailwindcss/src/oxide/cli/build/deps";

const BondTokens = {
    Interest: "interest",
    Investment: "investment"
}

export default function BondDetails({info, tokens}: { info: BondInfoDetailed, tokens: Tokens }) {

    return <>
        <div className='flex flex-col items-center gap-4 bg-d-1 p-5 rounded-xl min-w-600'>
            <h2 className="mb-4 text-3xl font-medium">Bond Details</h2>
            <BondIssuerInfo info={info}/>
            <Line/>
            <GeneralInfo info={info} tokens={tokens}/>
            <Line/>
            <Security info={info} tokens={tokens}/>
        </div>
    </>
}

function BondIssuerInfo({info}: { info: BondInfoDetailed }) {


    const [isClosed, setClosed] = useState(false);
    const openOrClose = () => setClosed(!isClosed);

    return <>
        <div className='flex flex-col gap-4 w-full'>
            <div className='flex justify-between items-center w-full'>
                <span className='text-xl'>Contract information:</span>
                <button className='cursor-pointer text-3xl text-g hover:text-white'
                        onClick={openOrClose}>{isClosed ? "+" : "-"}</button>
            </div>
            {!isClosed && <BondIssuerInfoDetails info={info}/>}
        </div>
    </>
}

function BondIssuerInfoDetails({info}: { info: BondInfoDetailed }) {
    const account = useSelector((item: RootState) => item.account);
    const {chainId} = account;
    const bondAddress = getExplorerAddress(chainId, info._id);
    const explorerAddress = getExplorerAddress(chainId, info.issuer);
    const chainIcon = `/svg/chains/${info.chainId}.svg`
    const chainInfo = CHAIN_INFO[info.chainId]

    async function copyAddress(address: string) {
        return navigator.clipboard.writeText(address)
            .then(() => toast("Address successfully copied to your clipboard."))
            .catch(() => toast.error("An error has occurred"))
    }


    return <>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 w-full md:text-base text-xs p-4 py-1">
            <div className="flex items-center justify-between gap-2 w-full">
                <span>Bond contract:</span>
                <div className='flex items-center gap-2'>
                    <Link href={bondAddress} target="_blank">
                        <span className="text-g text-sm">{shorten(info._id)}</span>
                    </Link>
                    <CopySVG onClick={() => copyAddress(info._id)}/>
                </div>
            </div>
            <div className="flex items-center justify-between gap-2 w-full">
                <span>Type:</span>
                <div className='flex items-center gap-2'>
                    <Link href={URLS.FAQ_WAB} target="_blank">
                        <span className="text-g text-sm">ZCB(Zero Coupon Bond)</span>
                    </Link>
                </div>
            </div>
            <div className="flex items-center justify-between gap-2 w-full">
                <span>Issuer:</span>
                <div className='flex items-center gap-2'>
                    <Link href={explorerAddress} target="_blank">
                        <span className="text-g text-sm">{shorten(info.issuer, 9)}</span>
                    </Link>
                    <CopySVG onClick={() => copyAddress(info.issuer)}/>
                </div>
            </div>
            <div className="flex items-center justify-between gap-2 w-full">
                <span>Chain:</span>
                <div className='flex items-center gap-2'>
                    <Image src={chainIcon} alt={chainInfo.chainName} width={24} height={24}/>
                    <span className="text-g text-sm">{chainInfo.chainName}</span>
                </div>
            </div>
        </div>
    </>
}

function Line() {
    return <div className="h-px w-full bg-g5"/>
}


function GeneralInfo({info, tokens}: { info: BondInfoDetailed, tokens: Tokens }) {


    const [isClosed, setClosed] = useState(false);
    const openOrClose = () => setClosed(!isClosed)


    return <>
        <div className='flex flex-col gap-4 w-full'>
            <div className='flex justify-between items-center w-full'>
                <span className='text-xl'>General Information:</span>
                <button className='cursor-pointer text-3xl text-g hover:text-white'
                        onClick={openOrClose}>{isClosed ? "+" : "-"}</button>
            </div>
            {!isClosed && <GeneralInfoDetails info={info} tokens={tokens}/>}
        </div>
    </>
}

function GeneralInfoDetails({info, tokens}: { info: BondInfoDetailed, tokens: Tokens }) {
    const {total, purchased, redeemed, redeemLockPeriod, investmentToken, interestToken} = info;

    const investmentTokenInfo = tokens[investmentToken]
    const interestTokenInfo = tokens[interestToken]
    const isLoading = !investmentTokenInfo || !interestTokenInfo

    if (isLoading) {
        return <div className="flex items-center justify-center w-full"><Loading percent={-50}/></div>
    }

    return <>
        <div className='flex gap-2 items-center justify-between w-full p-4 py-1'>
            <div className='flex flex-col gap-0.5 w-full'>
                <TokenInfo type={BondTokens.Investment} token={investmentTokenInfo} info={info}/>
                <TokenInfo type={BondTokens.Interest} token={interestTokenInfo} info={info}/>
                <div className='flex items-center justify-between md:gap-20 sm:gap-4 px-0 py-1'>
                    <div className='flex items-center gap-1'>
                        <ClockSVG/>
                        <span className='text-g'>Period:</span>
                    </div>
                    <span
                        className='text-sm font-bold'>{formatTime(Number(redeemLockPeriod), true, true)}</span>
                </div>
            </div>
            <PieChart total={total} purchased={purchased} redeemed={redeemed}/>
        </div>
    </>
}

function TokenInfo({type, token, info}: { type: string, token: TokenInfo, info: BondInfoDetailed }) {
    const {chainId} = info

    const isInterest = type === BondTokens.Interest
    const Icon = isInterest ? <InterestSVG/> : <InvestmentSVG/>;
    const tokenUrl = getExplorerToken(chainId, token.contractAddress);
    const hasBalance = typeof token.balanceClean !== "undefined"
    const title = isInterest ? "Interest" : "Investment"

    const infoSection = {
        title: isInterest ? "Explore the interest terms for this bond. Find out how the interest is calculated, the token you'll receive, and other details" : "Learn about the investment requirements for this bond. Discover how much you need to invest, which token to use, and more",
        url: URLS.FAQ
    }

    const TotalAmount = () => {
        if (!token?.decimals) {
            return 0;
        }

        const amount = (isInterest ?
            toBN(info.interestTokenAmount).div(toBN(10).pow(toBN(token.decimals))) :
            toBN(info.investmentTokenAmount).div(toBN(10).pow(toBN(token.decimals)))).toNumber()

        const className = isInterest ? "text-green-500" : ""

        return <>
            <Link href={tokenUrl} target="_blank">
                <div className='flex justify-end gap-2 items-center w-full cursor-pointer'>
                    <div className='flex gap-0.5 items-center'>
                        <span className={className + " text-sm font-bold"}
                              title={format(amount)}>{formatLargeNumber(amount)}</span>
                        <span className={className + " text-sm font-bold"}>{shortenString(token?.symbol, 4)}</span>
                    </div>
                    <div className='flex justify-end'>
                        <TokenImage src={token.icon} alt={token.name}/>
                    </div>
                </div>
            </Link>
        </>
    }

    return <>
        <div className='flex items-center justify-between px-0 py-1 w-full'>
            <div className='flex items-center gap-1'>
                {Icon}
                <span className='text-g'>{title}:</span>
            </div>
            <TotalAmount/>
        </div>
    </>
}

function Security({info, tokens}: { info: BondInfoDetailed, tokens: Tokens }) {
    const [isClosed, setClosed] = useState(false);
    const openOrClose = () => setClosed(!isClosed)


    return <>
        <div className='flex flex-col gap-4 w-full'>
            <div className='flex justify-between items-center w-full'>
                <span className='text-xl'>Security Details:</span>
                <span className='cursor-pointer text-3xl text-g hover:text-white'
                      onClick={openOrClose}>{isClosed ? "+" : "-"}</span>
            </div>
            {!isClosed && <SecurityDetails info={info} tokens={tokens}/>}
        </div>
    </>
}

function SecurityDetails({info, tokens}: { info: BondInfoDetailed, tokens: Tokens }) {

    const {
        interestToken,
        purchased,
        redeemed,
        interestTokenBalance,
        interestTokenAmount,
        investmentToken,
        investmentTokenAmount
    } = info;


    const interestTokenInfo = tokens[interestToken];
    const investmentTokenInfo = tokens[investmentToken];

    const isInterestNotFetched = !interestTokenInfo || interestTokenInfo.unidentified
    const isInvestmentNotFetched = !investmentTokenInfo || investmentTokenInfo.unidentified

    if (isInterestNotFetched || isInvestmentNotFetched) {
        return <div className='flex justify-center items-center w-full'><Loading percent={-50}/></div>;
    }

    const decimals = interestTokenInfo.decimals || 18

    const purchasePrice = toBN(investmentTokenAmount).div(toBN(10).pow(toBN(investmentTokenInfo.decimals)))
    const redeemPrice = toBN(interestTokenAmount).div(toBN(10).pow(toBN(interestTokenInfo.decimals)))

    const totalPurchased = purchased * purchasePrice.toNumber();
    const totalRedeemed = redeemed * redeemPrice.toNumber();

    const notRedeemed = toBN(info.total - info.redeemed).mul(toBN(info.interestTokenAmount));
    const totalNeededAmount = notRedeemed.div(toBN(10).pow(toBN(decimals)))
    const interestBalance = toBN(interestTokenBalance).div(toBN(10).pow(toBN(decimals)))

    let redeemedPercentage = interestBalance.toNumber() * 100 / totalNeededAmount.toNumber();
    redeemedPercentage = isFinite(redeemedPercentage) ? redeemedPercentage : 0

    const percentageClass = () => {
        if (redeemedPercentage === 0) {
            return "text-red-500"
        } else if (redeemedPercentage <= 25) {
            return "text-orange-700"
        } else if (redeemedPercentage <= 50) {
            return "text-orange-500"
        } else if (redeemedPercentage <= 75) {
            return "text-yellow-500"
        } else if (redeemedPercentage <= 100) {
            return "text-green-500"
        }else {
            return "text-green-500"
        }
    }

    return <>
        <div className='grid md:grid-cols-2 gap-x-8 gap-y-2 w-full md:text-base text-xs p-4 py-1'>
            <div className='flex items-center justify-between w-full'>
                <span className='text-g'>Secured Percentage:</span>
                <span className={percentageClass() + " text-sm font-bold"}>{redeemedPercentage.toFixed(2)}%</span>
            </div>
            <div className='flex items-center justify-between w-full'>
                <span className='text-g'>Issuer Score:</span>
                <span className='text-sm font-bold'>SOON</span>
            </div>
            <div className='flex items-center justify-between w-full'>
                <span className='text-g'>Total Purchased:</span>
                <span
                    className='text-sm font-bold'>{formatLargeNumber(totalPurchased)} {investmentTokenInfo.symbol}</span>
            </div>
            <div className='flex items-center justify-between w-full'>
                <span className='text-g'>Total Redeemed:</span>
                <span className='text-sm font-bold'>{formatLargeNumber(totalRedeemed)} {interestTokenInfo.symbol}</span>
            </div>

        </div>
    </>
}


function TokenImage({src, alt, handler}: any) {

    const [isVerified, setVerified] = useState(true);
    const [isLoading, setLoading] = useState(true)
    const [srcC, setSrcC] = useState(src)

    const handleError = () => setVerified(false)


    useEffect(() => {
        axios.get(src)
            .then(() => handleSuccess())
            .catch(() => handleError())
            .finally(() => setLoading(false))
    }, [src]);

    const handleSuccess = () => setVerified(true)

    // if (isLoading) {
    //     return <Loading percent={50}/>
    // }

    return <>{
        isVerified ?
            <Image src={srcC} alt={alt} width={26} height={26} onError={handleError} onLoad={handleSuccess}/> :
            <Image src="/svg/question.svg" alt={alt} width={26} height={26}/>}</>
}
