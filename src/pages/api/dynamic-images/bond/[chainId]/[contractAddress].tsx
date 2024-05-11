import {ImageResponse} from "@vercel/og";
import {NextRequest, NextResponse} from "next/server";
import GraphqlAPI from "@/modules/api/graphql";
import CalculatorController from "@/components/pages/bonds/utils/calculator";
import {tColor} from "@/components/pages/bonds/utils/colors";
import {formatLargeNumber} from "@/modules/utils/numbers";
import makeBlockie from "ethereum-blockies-base64";
import {shortenString} from "@/modules/utils/string";
import {formatTime} from "@/modules/utils/dates";
import {constants} from 'amet-utils'
import {URLS} from "@/modules/utils/urls";

export const config = {
    runtime: "edge"
}

export default async function DynamicImageBond(req: NextRequest) {

    const defaultOgImageUrl = `${URLS.BaseUrlHttps}/meta/og-image.jpg`

    const contractAddress = req.nextUrl.searchParams.get("contractAddress")
    const chainId = req.nextUrl.searchParams.get("chainId")
    if (!contractAddress || !chainId) return NextResponse.redirect(defaultOgImageUrl);

    const bondData = await GraphqlAPI.getContractExtended({contractAddress: contractAddress, chainId: Number(chainId)})
    if (!bondData) return NextResponse.redirect(defaultOgImageUrl);

    const {contractInfo} = bondData;
    const {
        maturityPeriodInBlocks,
        purchase,
        payout,
        owner,
        issuanceDate
    } = contractInfo;

    const payoutSymbolShort = shortenString(payout.symbol, 5)
    const purchaseSymbolShort = shortenString(purchase.symbol, 5)

    const maturityPeriodClean = (constants.CHAIN_BLOCK_TIMES[chainId] || 1) * maturityPeriodInBlocks
    const maturityInTime = formatTime(maturityPeriodClean, true, true, true)

    const issuanceDateInFormat = new Date(issuanceDate);
    const issuanceDateClean = `${issuanceDateInFormat.toLocaleDateString("en-GB")}`.replace(/\//g, '.');

    const ownerShorten = shorten(owner, 5);

    function ImageElement() {
        return (
            <div tw="relative flex flex-col text-white bg-black" style={{
                width: "1200px",
                height: "630px",
                backgroundImage: `url(${URLS.BaseUrlHttps}/pngs/dynamic-bond-background.png)`,
            }}>
                <div tw="flex flex-col justify-between w-full p-8 h-full">
                    <div tw="flex justify-between w-full">
                        <div tw='flex flex-col items-start'>
                            <span tw='text-4xl font-semibold'>{payout.name}</span>
                            <span tw='text-xl text-neutral-500'>{purchase.symbol} - {payout.symbol}</span>
                        </div>

                    </div>

                    <div tw="flex flex-col w-full">
                        <div tw='flex justify-between items-stretch whitespace-nowrap w-full py-8'>
                            <DetailContainer
                                value={`${formatLargeNumber(purchase.amountClean, true, 3)} ${purchaseSymbolShort}`}
                                title={`Purchase`}/>
                            <DetailContainer
                                value={`${formatLargeNumber(payout.amountClean, true, 3)} ${payoutSymbolShort}`}
                                title="Payout"/>
                            <DetailContainer
                                value={maturityInTime}
                                title="Period"/>
                        </div>
                        <div tw='flex justify-between w-full'>
                            <span tw='text-neutral-400 text-mm'>Issuer: {ownerShorten}</span>
                            <span tw='text-neutral-400 text-mm'>{issuanceDateClean}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    return new ImageResponse(<ImageElement/>, {})
}

function DetailContainer({value, title, valueClass}: Readonly<{ value: string, title: string, valueClass?: string }>) {
    return (
        <div tw='flex flex-col items-center'>
            <span tw={`${valueClass} text-2xl font-bold`}>{value}</span>
            <span tw='text-mm text-neutral-500'>{title}</span>
        </div>
    )
}


function shorten(address: string | any, length = 6) {
    if (!address || address.length <= length) {
        return address;
    }

    const start = address.substring(0, length);
    const end = address.substring(address.length - length);

    return `${start}...${end}`;
}
