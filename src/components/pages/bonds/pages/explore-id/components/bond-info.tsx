import Image from "next/image";
import Link from "next/link";
import {divBigNumberForUI, format, formatLargeNumber} from "@/modules/utils/numbers";
import CopySVG from "../../../../../../../public/svg/copy";
import {URLS} from "@/modules/utils/urls";
import InterestSVG from "../../../../../../../public/svg/interest";
import InvestmentSVG from "../../../../../../../public/svg/investment";
import {getExplorer, shorten} from "@/modules/web3/util";
import {formatTime} from "@/modules/utils/dates";
import PieChart from "@/components/pages/bonds/utils/bond/pie-chart";
import ClockSVG from "../../../../../../../public/svg/clock";
import {useEffect, useState} from "react";
import {shortenString} from "@/modules/utils/string";
import {copyAddress} from "@/modules/utils/address";
import {getChain, getChainIcon} from "@/modules/utils/wallet-connect";
import {DetailedBondResponse, TokenResponse} from "@/modules/cloud-api/type";
import makeBlockie from "ethereum-blockies-base64";
import WarningSVG from "../../../../../../../public/svg/warning";
import InfoBox from "@/components/utils/info-box";
import RefreshSVG from "../../../../../../../public/svg/utils/refresh";

const LOCAL_CONFIG_KEY = 'amet-finance-bond-details'

const BondTokens = {
    Interest: "interest",
    Investment: "investment"
}

export default function BondDetails({bondInfo, loadingHandler, refreshHandler}: {
    bondInfo: DetailedBondResponse,
    loadingHandler: any[],
    refreshHandler: any[]
}) {

    const {description} = bondInfo;


    return <>
        <div className='flex flex-col items-center gap-4 bg-d-1 p-5 rounded-xl md:min-w-600 sm:w-full'>
            <div className='relative flex justify-center w-full mb-4'>
                <RefreshTimer bondInfo={bondInfo} loadingHandler={loadingHandler} refreshHandler={refreshHandler}/>
                <h2 className="text-3xl font-medium">Bond Details</h2>
            </div>
            {
                Boolean(description.details) && <>
                    <Description bondInfo={bondInfo}/>
                    <Line/>
                </>
            }
            <BondIssuerInfo bondInfo={bondInfo}/>
            <Line/>
            <GeneralInfo bondInfo={bondInfo}/>
            <Line/>
            <Security bondInfo={bondInfo}/>
        </div>
    </>
}

function RefreshTimer({bondInfo, loadingHandler, refreshHandler}: {
    bondInfo: DetailedBondResponse,
    loadingHandler: any[],
    refreshHandler: any[]
}) {
    const {lastUpdated} = bondInfo;
    const [isLoading, setLoading] = loadingHandler;
    const [refresh, setRefresh] = refreshHandler;
    const [timePassedInSec, setTimePassedInSec] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => setTimePassedInSec((Date.now() - lastUpdated) / 1000), 500)
        return () => clearInterval(interval);
    }, [refresh, isLoading, lastUpdated]);

    if (!timePassedInSec) {
        return <span/>;
    }

    return <>
        <div className='absolute left-0 top-0 flex items-center gap-1.5'>
            <RefreshSVG isSmall={true} isLoading={isLoading} onClick={() => setRefresh(Math.random())}/>
            {!isLoading && <span className='text-xs text-g'>{formatTime(timePassedInSec, true)}</span>}
        </div>
    </>
}

function Description({bondInfo}: { bondInfo: DetailedBondResponse }) {

    const key = "description"
    const [isClosed, setClosed] = useState(false);
    const openOrClose = () => {
        setClosed(!isClosed);
        updateLocalConfig(key, !isClosed);
    }

    useEffect(() => {
        if (typeof localStorage !== "undefined") {
            const config = getLocalConfig();
            setClosed(Boolean(config[key]))
        }
    }, [])

    return <>
        <div className='flex flex-col gap-4 w-full'>
            <div className='flex justify-between items-center w-full cursor-pointer' onClick={openOrClose}>
                <span className='text-xl'>Description:</span>
                <button className='cursor-pointer text-3xl text-g hover:text-white'>{isClosed ? "+" : "-"}</button>
            </div>
            {!isClosed && <DescriptionDetails bondInfo={bondInfo}/>}
        </div>
    </>
}

function DescriptionDetails({bondInfo}: { bondInfo: DetailedBondResponse }) {
    // console.log(bondDescription.details?.description.toString())

    const {description} = bondInfo;

    const formattedText = description.details?.description?.split('\n').map((line, index) => (
        <div key={index}>
            {line}
            <br/>
        </div>
    ));

    return <>
        <div className='flex flex-col gap-2 max-w-xl'>
            <h1 className='text-2xl font-bold'>{description.details?.title}</h1>
            <div className="text-g text-sm">
                {formattedText}
            </div>
        </div>
    </>
}

function BondIssuerInfo({bondInfo}: { bondInfo: DetailedBondResponse }) {

    const key = "issuer-info"
    const [isClosed, setClosed] = useState(false);
    const openOrClose = () => {
        setClosed(!isClosed);
        updateLocalConfig(key, !isClosed);
    }

    useEffect(() => {
        if (typeof localStorage !== "undefined") {
            const config = getLocalConfig();
            setClosed(Boolean(config[key]))
        }
    }, [])

    return <>
        <div className='flex flex-col gap-4 w-full'>
            <div className='flex justify-between items-center w-full cursor-pointer' onClick={openOrClose}>
                <span className='text-xl'>Contract information:</span>
                <button className='cursor-pointer text-3xl text-g hover:text-white'>{isClosed ? "+" : "-"}</button>
            </div>
            {!isClosed && <BondIssuerInfoDetails bondInfo={bondInfo}/>}
        </div>
    </>
}

function BondIssuerInfoDetails({bondInfo}: { bondInfo: DetailedBondResponse }) {
    const {contractInfo} = bondInfo;
    const chain = getChain(contractInfo.chainId);

    const bondAddress = getExplorer(chain?.id, "address", contractInfo._id);
    const localAddress = `/address/${contractInfo.issuer}`
    const chainIcon = getChainIcon(chain?.id)


    return <>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 w-full md:text-base text-xs p-4 py-1">
            <div className="flex items-center justify-between gap-2 w-full">
                <span>Bond contract:</span>
                <div className='flex items-center gap-2'>
                    <Link href={bondAddress} target="_blank">
                        <span className="text-g text-sm">{shorten(contractInfo._id)}</span>
                    </Link>
                    <CopySVG onClick={() => copyAddress(contractInfo._id)}/>
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
                        <span className="text-g text-sm">{shorten(contractInfo.issuer, 9)}</span>
                    </Link>
                    <CopySVG onClick={() => copyAddress(contractInfo.issuer)}/>
                </div>
            </div>
            <div className="flex items-center justify-between gap-2 w-full">
                <span>Chain:</span>
                <div className='flex items-center gap-2'>
                    <Image src={chainIcon} alt={chain?.name || ""} width={24} height={24}/>
                    <span className="text-g text-sm text-end w-min whitespace-nowrap">{chain?.name}</span>
                </div>
            </div>
        </div>
    </>
}

function Line() {
    return <div className="h-px w-full bg-g5"/>
}


function GeneralInfo({bondInfo}: { bondInfo: DetailedBondResponse }) {

    const key = "general-info"
    const [isClosed, setClosed] = useState(false);
    const openOrClose = () => {
        setClosed(!isClosed);
        updateLocalConfig(key, !isClosed);
    }

    useEffect(() => {
        if (typeof localStorage !== "undefined") {
            const config = getLocalConfig();
            setClosed(Boolean(config[key]))
        }
    }, [])
    return <>
        <div className='flex flex-col gap-4 w-full'>
            <div className='flex justify-between items-center w-full cursor-pointer' onClick={openOrClose}>
                <span className='text-xl'>General Information:</span>
                <button className='cursor-pointer text-3xl text-g hover:text-white'>{isClosed ? "+" : "-"}</button>
            </div>
            {!isClosed && <GeneralInfoDetails bondInfo={bondInfo}/>}
        </div>
    </>
}

function GeneralInfoDetails({bondInfo}: { bondInfo: DetailedBondResponse }) {

    const {contractInfo} = bondInfo;
    const {
        total,
        purchased,
        redeemed,
        redeemLockPeriod,
        interestTokenInfo,
        investmentTokenInfo
    } = contractInfo;

    return <>
        <div className='flex flex-col gap-2 w-full'>
            <div className='flex md:flex-row sm:flex-col md:gap-24 sm:gap-2 items-center p-4 py-1 w-full'>
                <div className='flex flex-col gap-0.5 md:w-1/2 sm:w-full'>
                    <TokenInfo type={BondTokens.Investment} token={investmentTokenInfo} bondInfo={bondInfo}/>
                    <TokenInfo type={BondTokens.Interest} token={interestTokenInfo} bondInfo={bondInfo}/>
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

function TokenInfo({type, token, bondInfo}: { type: string, token: TokenResponse, bondInfo: DetailedBondResponse }) {
    const {contractInfo} = bondInfo;
    const {chainId, interestToken, investmentToken, interestTokenAmount, investmentTokenAmount} = contractInfo

    const isInterest = type === BondTokens.Interest
    const contractAddress = isInterest ? interestToken : investmentToken
    const Icon = isInterest ? <InterestSVG/> : <InvestmentSVG/>;
    const tokenUrl = getExplorer(chainId, "token", contractAddress);
    const title = isInterest ? "Total Return" : "Investment"

    const TotalAmount = () => {
        const tokenAmount = isInterest ? interestTokenAmount : investmentTokenAmount;
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

function Security({bondInfo}: { bondInfo: DetailedBondResponse }) {
    const key = "security"
    const [isClosed, setClosed] = useState(false);
    const openOrClose = () => {
        setClosed(!isClosed);
        updateLocalConfig(key, !isClosed);
    }

    useEffect(() => {
        if (typeof localStorage !== "undefined") {
            const config = getLocalConfig();
            setClosed(Boolean(config[key]))
        }
    }, [])
    return <>
        <div className='flex flex-col gap-4 w-full'>
            <div className='flex justify-between items-center w-full cursor-pointer' onClick={openOrClose}>
                <span className='text-xl'>Risk Metrics:</span>
                <button className='cursor-pointer text-3xl text-g hover:text-white'>{isClosed ? "+" : "-"}</button>
            </div>
            {!isClosed && <SecurityDetails bondInfo={bondInfo}/>}
        </div>
    </>
}

function SecurityDetails({bondInfo}: { bondInfo: DetailedBondResponse }) {

    const {contractInfo, description, securityDetails} = bondInfo
    const {
        total,
        redeemed,
        interestTokenInfo,
        interestTokenBalance
    } = contractInfo;

    const infoTexts = {
        securedPercentage: {
            text: "The Secured Percentage represents the portion of the total interest currency amount that is securely locked in the contract. This amount is reserved to fulfill bond obligations and repay bondholders. Click to read more."
        },
        description: {
            text: "The Description is a brief text provided by the bond issuer, offering additional insights into the purpose or details of the bond. It helps investors understand the nature of the investment."
        },
        issuerScore: {
            text: "The Issuer Score is a numerical rating, ranging from 1 to 10, assigned to the bond issuer. It is recalculated every 24 hours using a specified formula. Click to read more."
        },
        bondScore: {
            text: "The Bond Score is a numerical rating, ranging from 1 to 10, assigned to the specific bond. It considers factors like the Secured Percentage, Description presence, and potentially other criteria. Click to read more."
        },
        uniqueHolders: {
            text: "Unique Holders represent the count of distinct individuals or addresses holding the bond. Each holder is counted only once, regardless of the quantity of bonds they own."
        },
        uniqueHoldersIndex: {
            text: "The Unique Holders Index is calculated by dividing the number of Unique Holders by the total number of purchased and not redeemed bonds. It provides a ratio indicating the average number of bonds held per unique holder"
        }
    }

    const isTotallyRedeemed = total - redeemed === 0


    const bondScore = format(securityDetails.bondScore);
    const issuerScore = format(securityDetails.issuerScore);
    const uniqueHolders = format(securityDetails.uniqueHolders);
    const uniqueHoldersIndex = format(securityDetails.uniqueHoldersIndex);

    const redeemedPercentage = isTotallyRedeemed ? 100 : securityDetails.securedPercentage;
    const securedTitle = isTotallyRedeemed ? "FINISHED" : `${format(redeemedPercentage)}%`;

    const descriptionExists = Boolean(description.details?.description) || Boolean(description.details?.title)
    let descriptionTitle = descriptionExists ? "Exists" : "Missing"
    const descriptionClasses = descriptionExists ? "text-green-500" : "text-red-500"

    const percentageClass = (amount: number) => {
        if (amount === 0) {
            return "text-red-500"
        } else if (amount <= 25) {
            return "text-orange-700"
        } else if (amount <= 50) {
            return "text-orange-500"
        } else if (amount <= 75) {
            return "text-yellow-500"
        } else if (amount <= 90) {
            return "text-lime-500"
        } else if (amount <= 100) {
            return "text-green-500"
        } else {
            return "text-green-500"
        }
    }

    return <>
        <div className='grid md:grid-cols-2 gap-x-8 gap-y-2 w-full md:text-base text-xs p-4 py-1'>
            <div className='flex items-center justify-between w-full gap-2'>
                <InfoBox info={infoTexts.securedPercentage}>
                    <span className='whitespace-nowrap'>Secured Percentage:</span>
                </InfoBox>
                <span className={percentageClass(redeemedPercentage) + " text-sm font-bold cursor-pointer"}
                      title={`${format(interestTokenBalance?.balanceClean || 0)} ${interestTokenInfo.symbol}`}>{securedTitle}</span>

            </div>
            <div className='flex items-center justify-between w-full gap-2'>
                <InfoBox info={infoTexts.issuerScore}>
                    <span>Issuer Score:</span>
                </InfoBox>
                <span
                    className={percentageClass(securityDetails.issuerScore * 10) + " text-sm font-bold cursor-pointer"}>{issuerScore}</span>
            </div>
            <div className='flex items-center justify-between w-full gap-2'>
                <InfoBox info={infoTexts.description}>
                    <span>Description:</span>
                </InfoBox>
                <span className={'text-sm font-bold ' + descriptionClasses}>{descriptionTitle}</span>
            </div>
            <div className='flex items-center justify-between w-full gap-2'>
                <InfoBox info={infoTexts.bondScore}>
                    <span>Bond Score:</span>
                </InfoBox>
                <span
                    className={percentageClass(securityDetails.bondScore * 10) + " text-sm font-bold cursor-pointer"}>{bondScore}</span>
            </div>

            <div className='flex items-center justify-between w-full gap-2'>
                <InfoBox info={infoTexts.uniqueHolders}>
                    <span>Unique Holders:</span>
                </InfoBox>
                <span
                    className={percentageClass((securityDetails.uniqueHolders / contractInfo.total) * 100) + " text-sm font-bold cursor-pointer"}>{uniqueHolders}</span>
            </div>

            <div className='flex items-center justify-between w-full gap-2'>
                <InfoBox info={infoTexts.uniqueHoldersIndex}>
                    <span>Unique Holders Index:</span>
                </InfoBox>
                <span
                    className={percentageClass(securityDetails.uniqueHoldersIndex * 10) + " text-sm font-bold cursor-pointer"}>{uniqueHoldersIndex}</span>
            </div>

        </div>
    </>
}

function getLocalConfig() {
    const response = localStorage.getItem(LOCAL_CONFIG_KEY);
    return JSON.parse(response || "{}")
}

function updateLocalConfig(key: string, value: any) {
    const response = getLocalConfig()
    localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify({
        ...response,
        [key]: value
    }))
}

