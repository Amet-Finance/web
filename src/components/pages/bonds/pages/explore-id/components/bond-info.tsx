import Image from "next/image";
import Link from "next/link";
import {BondInfoDetailed} from "@/modules/web3/type";
import {divBigNumber, divBigNumberForUI, format, formatLargeNumber} from "@/modules/utils/numbers";
import CopySVG from "../../../../../../../public/svg/copy";
import {URLS} from "@/modules/utils/urls";
import InterestSVG from "../../../../../../../public/svg/interest";
import InvestmentSVG from "../../../../../../../public/svg/investment";
import Loading from "@/components/utils/loading";
import {getExplorer, shorten, toBN} from "@/modules/web3/util";
import {formatTime} from "@/modules/utils/dates";
import PieChart from "@/components/pages/bonds/utils/bond/pie-chart";
import ClockSVG from "../../../../../../../public/svg/clock";
import {useState} from "react";
import {shortenString} from "@/modules/utils/string";
import {copyAddress} from "@/modules/utils/address";
import {getChain, getChainIcon} from "@/modules/utils/wallet-connect";
import {TokenResponse, TokensResponse} from "@/modules/cloud-api/type";
import makeBlockie from "ethereum-blockies-base64";
import VerifiedSVG from "../../../../../../../public/svg/verified";
import WarningSVG from "../../../../../../../public/svg/warning";
import InfoBox from "@/components/utils/info-box";


const BondTokens = {
    Interest: "interest",
    Investment: "investment"
}

export default function BondDetails({info, tokens}: { info: BondInfoDetailed, tokens: TokensResponse }) {

    return <>
        <div className='flex flex-col items-center gap-4 bg-d-1 p-5 rounded-xl md:min-w-600 sm:w-full'>
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
    const chain = getChain(info.chainId);

    const bondAddress = getExplorer(chain?.id, "address", info._id);
    const localAddress = `/address/${info.issuer}`
    const chainIcon = getChainIcon(chain?.id)


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
                    <Link href={localAddress} target="_blank">
                        <span className="text-g text-sm">{shorten(info.issuer, 9)}</span>
                    </Link>
                    <CopySVG onClick={() => copyAddress(info.issuer)}/>
                </div>
            </div>
            <div className="flex items-center justify-between gap-2 w-full">
                <span>Chain:</span>
                <div className='flex items-center gap-2'>
                    <Image src={chainIcon} alt={chain?.name || ""} width={24} height={24}/>
                    <span className="text-g text-sm">{chain?.name}</span>
                </div>
            </div>
        </div>
    </>
}

function Line() {
    return <div className="h-px w-full bg-g5"/>
}


function GeneralInfo({info, tokens}: { info: BondInfoDetailed, tokens: TokensResponse }) {


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

function GeneralInfoDetails({info, tokens}: { info: BondInfoDetailed, tokens: TokensResponse }) {

    const {total, purchased, redeemed, redeemLockPeriod, investmentToken, interestToken} = info;

    const investmentTokenInfo = tokens[investmentToken.toLowerCase()]
    const interestTokenInfo = tokens[interestToken.toLowerCase()]
    const isLoading = !investmentTokenInfo || !interestTokenInfo

    if (isLoading) {
        return <div className="flex items-center justify-center w-full"><Loading percent={-50}/></div>
    }

    return <>
        <div className='flex flex-col gap-2 w-full'>
            <div className='flex md:flex-row sm:flex-col md:gap-24 sm:gap-2 items-center p-4 py-1 w-full'>
                <div className='flex flex-col gap-0.5 md:w-1/2 sm:w-full'>
                    <TokenInfo type={BondTokens.Investment} token={investmentTokenInfo} info={info}/>
                    <TokenInfo type={BondTokens.Interest} token={interestTokenInfo} info={info}/>
                    <div className='flex items-center justify-between md:gap-20 sm:gap-4 px-0 py-1'>
                        <div className='flex items-center gap-1.5'>
                            <ClockSVG/>
                            <span>Period:</span>
                        </div>
                        <span
                            className='text-sm font-bold whitespace-nowrap'>{formatTime(Number(redeemLockPeriod), true, true)}</span>
                    </div>
                </div>
                <PieChart total={total} purchased={purchased} redeemed={redeemed}/>
            </div>
        </div>
    </>
}

function TokenInfo({type, token, info}: { type: string, token: TokenResponse, info: BondInfoDetailed }) {
    const {chainId, interestToken, investmentToken} = info

    const isInterest = type === BondTokens.Interest
    const contractAddress = isInterest ? interestToken : investmentToken
    const Icon = isInterest ? <InterestSVG/> : <InvestmentSVG/>;
    const tokenUrl = getExplorer(chainId, "token", contractAddress);
    const title = isInterest ? "Total Return" : "Investment"

    const TotalAmount = () => {
        const tokenAmount = isInterest ? info.interestTokenAmount : info.investmentTokenAmount;
        const amount = divBigNumberForUI(tokenAmount, token.decimals)

        const className = isInterest ? "text-green-500" : ""
        const icon = token.icon || makeBlockie(token._id);

        return <>
            <Link href={tokenUrl} target="_blank">
                <div className='flex justify-end gap-2 items-center w-full cursor-pointer'>
                    <div className='flex gap-2 items-center'>
                        {!token.isVerified && <WarningSVG/>}
                        <div className='flex gap-0.5 items-center'>
                            <span className={className + " text-sm font-bold"}
                                  title={format(amount).toString()}>{formatLargeNumber(amount)}</span>
                            <span className={className + " text-sm font-bold"}>{shortenString(token?.symbol, 4)}</span>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <Image src={icon} alt={token.name} width={26} height={26} className='rounded-full'/>
                    </div>
                </div>
            </Link>
        </>
    }

    return <>
        <div className='flex items-center justify-between px-0 py-1 w-full'>
            <div className='flex items-center gap-1.5'>
                {Icon}
                <span>{title}:</span>
            </div>
            <TotalAmount/>
        </div>
    </>
}

function Security({info, tokens}: { info: BondInfoDetailed, tokens: TokensResponse }) {
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

function SecurityDetails({info, tokens}: { info: BondInfoDetailed, tokens: TokensResponse }) {

    const {
        total,
        interestToken,
        purchased,
        redeemed,
        interestTokenBalance,
        interestTokenAmount,
        investmentToken,
        investmentTokenAmount
    } = info;


    const isTotallyRedeemed = total - redeemed === 0
    const interestTokenInfo = tokens[interestToken.toLowerCase()];
    const investmentTokenInfo = tokens[investmentToken.toLowerCase()];

    if (!interestTokenInfo || !investmentTokenInfo) {
        return <div className='flex justify-center items-center w-full'><Loading percent={-50}/></div>;
    }

    const purchasePrice = divBigNumber(investmentTokenAmount, investmentTokenInfo.decimals);
    const redeemPrice = divBigNumber(interestTokenAmount, interestTokenInfo.decimals);

    const totalPurchased = purchased * purchasePrice.toNumber();
    const totalRedeemed = redeemed * redeemPrice.toNumber();

    const notRedeemed = toBN(info.total - info.redeemed).mul(toBN(info.interestTokenAmount));
    const totalNeededAmount = divBigNumber(notRedeemed.toString(), interestTokenInfo.decimals);
    const interestBalance = divBigNumber(interestTokenBalance, interestTokenInfo.decimals);

    let redeemedPercentage = interestBalance.toNumber() * 100 / totalNeededAmount.toNumber();
    redeemedPercentage = isTotallyRedeemed ? 100 : (Number(redeemedPercentage) || 0);

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
        } else {
            return "text-green-500"
        }
    }

    return <>
        <div className='grid md:grid-cols-2 gap-x-8 gap-y-2 w-full md:text-base text-xs p-4 py-1'>
            <div className='flex items-center justify-between w-full'>
                <span className='whitespace-nowrap'>Secured Percentage:</span>
                <span className={percentageClass() + " text-sm font-bold cursor-pointer"}
                      title={`${format(interestBalance.toNumber())} ${interestTokenInfo.symbol}`}>{redeemedPercentage.toFixed(2)}%</span>
            </div>
            <div className='flex items-center justify-between w-full'>
                <span>Issuer Score:</span>
                <span className='text-sm font-bold'>SOON</span>
            </div>
            <div className='flex items-center justify-between w-full'>
                <span>Total Purchased:</span>
                <span
                    className='text-sm font-bold'>{formatLargeNumber(totalPurchased)} {shortenString(investmentTokenInfo.symbol, 5)}</span>
            </div>
            <div className='flex items-center justify-between w-full'>
                <span>Total Redeemed:</span>
                <span
                    className='text-sm font-bold'>{formatLargeNumber(totalRedeemed)} {shortenString(interestTokenInfo.symbol, 5)}</span>
            </div>

        </div>
    </>
}


