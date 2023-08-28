import Styles from "./index.module.css";
import Image from "next/image";
import {CHAIN_INFO, DEFAULT_CHAIN_ID} from "@/modules/web3/constants";
import Link from "next/link";
import {formatTime} from "@/modules/utils/dates";
import {BondInfo} from "@/components/pages/bonds/pages/issue/type";
import {TokenInfo} from "@/modules/web3/type";
import {getWeb3Instance} from "@/modules/web3";

export default function BondInfo({info, tokens}: any) {

    return <>
        <div className={Styles.bondInfo}>
            <BondIssuerInfo info={info}/>
            <TotalInfo info={info}/>
            <BondLockInfo info={info}/>
            <BondTokensInfo info={info} tokens={tokens}/>
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

function BondTokensInfo({info, tokens}: { info: BondInfo, tokens: { [key: string]: TokenInfo } }) {
    const {
        investmentToken,
        investmentTokenAmount,
        interestToken,
        interestTokenAmount
    } = info;

    const investmentTokenInfo = investmentToken ? tokens[investmentToken] : undefined;
    const interestTokenInfo = interestToken ? tokens[interestToken] : undefined;

    const investmentDetails = {
        tokenInfo: investmentTokenInfo,
        tokenAddress: investmentToken,
        title: "Investment token",
        amount: investmentTokenAmount
    }

    const interestDetails = {
        tokenInfo: interestTokenInfo,
        tokenAddress: interestToken,
        title: "Interest token",
        amount: interestTokenAmount
    }

    return <>
        <div className={Styles.tokenSection}>
            <Token details={investmentDetails}/>
            <Token details={interestDetails}/>
        </div>
    </>
}

function Token({details}: {
    details: {
        tokenInfo: TokenInfo | undefined,
        tokenAddress: string | undefined,
        amount: number | undefined,
        title: string
    }
}) {
    const web3 = getWeb3Instance()
    const {toBN} = web3.utils;

    const {tokenInfo, amount, title, tokenAddress} = details;
    if (typeof tokenInfo?.decimals === "undefined") {
        return null;
    }

    const tokenUrl = `${CHAIN_INFO[DEFAULT_CHAIN_ID].explorer}/token/${tokenAddress}`;
    const icon = tokenInfo?.icon || ""
    const name = tokenInfo?.name || ""
    const symbol = tokenInfo?.symbol || ""

    const price = toBN(amount || 0).div(toBN(10).pow(toBN(tokenInfo?.decimals)))

    return <>
        <Link href={tokenUrl} target="_blank">
            <div className={Styles.tokenContainer}>
                <p>{title}</p>
                <div className={Styles.tokenInfo}>
                    <Image src={icon} width={40} height={40} alt={name}/>
                    <p>{name}</p>
                </div>
                <p>Price: {price.toString()} {symbol}</p>
            </div>
        </Link>
    </>
}