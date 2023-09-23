import Styles from "./index.module.css";
import Image from "next/image";
import Link from "next/link";
import {formatTime} from "@/modules/utils/dates";
import {BondInfo} from "@/components/pages/bonds/pages/issue/type";
import {BondInfoDetailed, TokenInfo} from "@/modules/web3/type";
import {getWeb3Instance} from "@/modules/web3";
import {format} from "@/modules/utils/numbers";
import {getExplorerAddress} from "@/modules/web3/utils/address";
import {getExplorerToken} from "@/modules/web3/utils/token";

export default function BondInfo({info, tokens}: any) {

    return <>
        <div className={Styles.bondInfo}>
            <BondIssuerInfo info={info}/>
            <TotalInfo info={info} tokens={tokens}/>
            <BondLockInfo info={info}/>
            <BondTokensInfo info={info} tokens={tokens}/>
        </div>
    </>
}

function BondIssuerInfo({info}: any) {
    const bondAddress = getExplorerAddress(info._id);
    const explorerAddress = getExplorerAddress(info.issuer);

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

function TotalInfo({info, tokens}: { info: BondInfoDetailed, tokens: { [key: string]: TokenInfo } }) {

    const {interestToken, interestTokenBalance} = info;

    const {toBN} = getWeb3Instance().utils
    const left = Number(info.total) - Number(info.purchased);

    const decimals = tokens[interestToken]?.decimals || 18

    const notRedeemed = toBN(info.total - info.redeemed).mul(toBN(info.interestTokenAmount));
    const totalNeededAmount = notRedeemed.div(toBN(10).pow(toBN(decimals)))
    const interestBalance = toBN(interestTokenBalance).div(toBN(10).pow(toBN(decimals)))
    const redeemedPercentage = interestBalance.toNumber() * 100 / totalNeededAmount.toNumber();

    return <>
        <div className={Styles.section}>
            <div className={Styles.sectionHorizontal}>
                <span>Total Bonds issued:</span>
                <span>{info.total}</span>
            </div>
            <div className={Styles.sectionHorizontal}>
                <span>Total Purchased:</span>
                <span>{info.purchased}</span>
            </div>
            <div className={Styles.sectionHorizontal}>
                <span>Total Redeemed:</span>
                <span>{info.redeemed}</span>
            </div>
            <div className={Styles.sectionHorizontal}>
                <span>Bonds left:</span>
                <span>{left}</span>
            </div>

            <div className={Styles.sectionHorizontal}>
                <span>Bonds redemption secured percentage:</span>
                {/*todo add amount as well*/}
                <span className='secured'>{format(+redeemedPercentage.toFixed(2))}%</span>
            </div>
        </div>
        <style jsx>{`
          .secured {
            color: ${getColor(redeemedPercentage)};
          }

        `}</style>
    </>
}

function getColor(percent: number) {

    // if(percent > )
    percent = Math.min(100, Math.max(0, percent));

    // Calculate the red and green components based on the percentage
    const red = 255 * (1 - percent / 100);
    const green = 255 * (percent / 100);

    // Convert the red and green values to hexadecimal format
    const redHex = Math.round(red).toString(16).padStart(2, '0');
    const greenHex = Math.round(green).toString(16).padStart(2, '0');

    // Combine the red and green components to create the color
    const color = `#${redHex}${greenHex}00`;

    return color;
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

    const tokenUrl = getExplorerToken(tokenAddress)
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