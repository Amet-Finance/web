import Image from "next/image";
import Link from "next/link";
import {Tokens} from "@/components/pages/bonds/pages/issue/type";
import {BondInfoDetailed, TokenInfo} from "@/modules/web3/type";
import {getWeb3Instance} from "@/modules/web3";
import {format} from "@/modules/utils/numbers";
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

const BondTokens = {
    Interest: "interest",
    Investment: "investment"
}

export default function BondDetails({info, tokens}: { info: BondInfoDetailed, tokens: Tokens }) {

    const {total, purchased, redeemed, investmentToken, interestToken} = info

    const investmentTokenInfo = tokens[investmentToken]
    const interestTokenInfo = tokens[interestToken]

    return <>
        <div className='flex flex-col items-center gap-4 bg-d-1 p-5 rounded-xl'>
            <h2 className="mb-4 text-3xl">Bond Details</h2>
            <BondIssuerInfo info={info}/>
            <Line/>
            <Description/>
            <div className="grid grid-cols-2 gap-3">
                <Box><SecurityDetails info={info} tokens={tokens}/></Box>
                <Box><RoundProgress total={total} purchased={purchased} redeemed={redeemed} isHorizontal={true}/></Box>
                <Box><TokenInfo type={BondTokens.Investment} token={investmentTokenInfo} info={info}/></Box>
                <Box><TokenInfo type={BondTokens.Interest} token={interestTokenInfo} info={info}/></Box>
            </div>
        </div>
    </>
}

function BondIssuerInfo({info}: any) {
    const bondAddress = getExplorerAddress(info._id);
    const explorerAddress = getExplorerAddress(info.issuer);

    const copyAddress = (address: string) => {
        return navigator.clipboard.writeText(address)
            .then(() => toast("Address successfully copied to your clipboard."))
            .catch(() => toast.error("An error has occurred"))
    }

    return <>
        <div className="grid md:grid-cols-2 gap-x-8 w-full md:text-base text-xs">
            <div className="flex items-center justify-between gap-2 w-full">
                <span>Bond contract:</span>
                <div className='flex items-center gap-2'>
                    <Link href={bondAddress} target="_blank">
                        <span className="text-g">{shorten(info._id)}</span>
                    </Link>
                    <CopySVG onClick={() => copyAddress(info._id)}/>
                </div>
            </div>
            <div className="flex items-center justify-between gap-2 w-full">
                <span>Type:</span>
                <div className='flex items-center gap-2'>
                    <Link href={URLS.FAQ_WAB} target="_blank">
                        <span className="text-g">ZCB(Zero Coupon Bond)</span>
                    </Link>
                </div>
            </div>
            <div className="flex items-center justify-between gap-2 w-full">
                <span>Issuer:</span>
                <div className='flex items-center gap-2'>
                    <Link href={explorerAddress} target="_blank">
                        <span className="text-g">{shorten(info.issuer, 9)}</span>
                    </Link>
                    <CopySVG onClick={() => copyAddress(info.issuer)}/>
                </div>
            </div>
        </div>
    </>
}

function Line() {
    return <div className="h-px w-full bg-g5"/>
}

function Description() {
    return <>
        <div className="flex justify-between items-center w-full">
            <h3>Description</h3>
            <h3>+</h3>
        </div>
    </>
}

function Box({children}: any) {
    return <>
        <div className="md:py-4 md:px-8 md:text-base py-2 px-4 rounded-lg border border-solid border-w1 bg-b1 text-xs">
            {children}
        </div>
    </>
}

function TokenInfo({type, token, info}: { type: string, token: TokenInfo, info: BondInfoDetailed }) {

    if (!token) {
        return <div className="flex items-center justify-center w-full"><Loading/></div>;
    }

    const isInterest = type === BondTokens.Interest
    const tokenUrl = getExplorerToken(token.contractAddress);
    const Icon = isInterest ? <InterestSVG/> : <InvestmentSVG/>
    const title = isInterest ? "Interest" : "Investment"
    const hasBalance = typeof token.balanceClean !== "undefined"

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

        const className = isInterest ? "text-gl-1" : "text-rl-1"

        return <>
            <b className={className}>{format(amount)}</b>
        </>
    }

    return <>
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center gap-2 w-full">
                <div className="flex items-center gap-2">
                    {Icon}
                    <span>{title}</span>
                </div>
                <InfoSVG info={infoSection}/>
            </div>
            <Line/>
            <div className="flex justify-between items-center gap-2 w-full">
                <div className="flex items-center gap-2">
                    <Link href={tokenUrl} target="_blank">
                        <Image src={token.icon} width={32} height={32} alt={token.name}/>
                    </Link>
                    <div className="flex flex-col">
                        <span>{token.name}</span>
                        {
                            Boolean(hasBalance) &&
                            <span
                                className="text-g text-xs">Balance: {format(Number(token.balanceClean))} {token.symbol}</span>}
                    </div>
                </div>
                <TotalAmount/>
            </div>
        </div>
    </>
}

function SecurityDetails({tokens, info}: { info: BondInfoDetailed, tokens: Tokens }) {
    const {interestToken, interestTokenBalance} = info;


    if (!tokens[interestToken] || tokens[interestToken].unidentified) {
        return null;
    }

    const decimals = tokens[interestToken].decimals || 18

    const notRedeemed = toBN(info.total - info.redeemed).mul(toBN(info.interestTokenAmount));
    const totalNeededAmount = notRedeemed.div(toBN(10).pow(toBN(decimals)))
    const interestBalance = toBN(interestTokenBalance).div(toBN(10).pow(toBN(decimals)))
    const redeemedPercentage = interestBalance.toNumber() * 100 / totalNeededAmount.toNumber();

    const percentageClass = redeemedPercentage < 30 ? "text-rl-1" : "text-gl-1";

    const infoSection = {
        title: "Get insights into the security aspects of this bond. Check the secured redemption percentage, issuer score, and more to make an informed decision",
        url: URLS.FAQ // todo update this
    }

    return <>
        <div className="flex flex-col justify-between gap-6">
            <div className="flex justify-between items-center gap-2 w-full">
                <div className="flex items-center gap-2">
                    <SecuritySVG/>
                    <span>Security Details</span>
                </div>
                <InfoSVG info={infoSection}/>
            </div>
            <div className="flex flex-col gap-1">
                <div className='flex justify-between items-center gap-4'>
                    <span>Percentage Redemption:</span>
                    <b className={percentageClass}>{format(redeemedPercentage)}%</b>
                </div>
                <div className='flex justify-between items-center gap-4'>
                    <span>Issuer Score:</span>
                    <b className='text-g'>?</b>
                </div>
            </div>

        </div>
    </>
}