import {ImageResponse} from "@vercel/og";
import {NextRequest, NextResponse} from "next/server";
import GraphqlAPI from "@/modules/api/graphql";
import {formatLargeNumber} from "@/modules/utils/numbers";
import {shortenString} from "@/modules/utils/string";
import {formatTime} from "@/modules/utils/dates";
import {URLS} from "@/modules/utils/urls";
import {CHAIN_BLOCK_TIMES} from "@/modules/web3/constants";

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

    const maturityPeriodClean = (CHAIN_BLOCK_TIMES[chainId] || 1) * maturityPeriodInBlocks
    const maturityInTime = formatTime(maturityPeriodClean, true, true, true)

    const issuanceDateInFormat = new Date(issuanceDate);
    const issuanceDateClean = `${issuanceDateInFormat.toLocaleDateString("en-GB")}`.replace(/\//g, '.');

    const ownerShorten = shorten(owner, 5);

    function ImageElement() {
        return (
            <div tw="relative flex flex-col justify-between text-white bg-black p-12" style={{
                width: "1200px",
                height: "630px",
            }}>
                <div tw='flex justify-between w-full'>
                    <div tw='flex flex-col'>
                        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 400"
                             style={{width: "130px", height: "40px"}}>
                            <path style={{fill: "#fff"}}
                                  d="M254.28,256.18c-8.74,24.29-29.84,43.53-63.29,43.53-29.57,0-54.62-15.81-64.44-43.53H66.64C71.09,284,82.49,306,99,321.84c31.56,30.42,70.85,31.41,85.42,30.7,54.26-2.64,85.85-42.19,90.55-48.29L262.7,345.47h54.22V256.18Zm7.47-143.28q8.36,21.28,16.73,42.55c-4.9-6.19-37.4-45.92-92.69-48.22-12.86-.54-56.87-.1-90,34.45-14.89,15.54-25.26,36.24-29.34,61.91h59.46c9.35-28.73,34.82-44.94,65.05-44.94,34.11,0,55.36,20,63.79,44.94h62.14V112.9Z"/>
                            <path style={{fill: "#fff"}}
                                  d="M742.72,203.59c-4.83-59.75-37.25-94-97.92-94-9,0-26.2.35-45.14,10.23-23.48,12.26-34.95,31.57-39.14,39.61-.15-6.35-1.45-21.65-12.56-34.16-15.62-17.6-39.34-16.67-49.87-16.63-44.25.16-72.15,38.17-75.53,42.93q5-19.58,9.95-39.15H379.2v233h57.56V220.93a74,74,0,0,1,2-17.34c5.6-23.08,22.42-41.16,47.5-41.16,25.47,0,40.84,18.08,45.83,41.16a81.6,81.6,0,0,1,1.82,17.34V345.47H591.5V220.93a70.58,70.58,0,0,1,2.13-17.34c5.86-22.79,23.26-40.21,48.34-40.21,25.38,0,38.52,17.21,42.51,40.21A94.5,94.5,0,0,1,685.83,220V345.47h57.55V220C743.38,214.33,743.17,208.87,742.72,203.59Z"/>
                            <path style={{fill: "#fff"}}
                                  d="M1029.25,203.59c-8.55-65.11-52.83-97.76-117-97.76-66.66,0-112,39.73-121.63,97.76a143.42,143.42,0,0,0-2,23.94,158.73,158.73,0,0,0,2.54,28.65c10.85,58.32,55.86,95.41,125.3,95.41,35.38,0,75.48-12.27,100-37.72l-36.81-36.33c-13.2,13.67-41,21.7-62.25,21.7-37.46,0-61.65-17.72-68.12-43.06a58.71,58.71,0,0,1-1.24-6.47h181.62A205.1,205.1,0,0,0,1029.25,203.59ZM914.17,156.78c33,0,56.6,15.07,60.38,45.28H849.06C857.54,171.85,883,156.78,914.17,156.78Z"/>
                            <path style={{fill: "#fff"}}
                                  d="M1217.49,289.31c-8.5,4.25-18.88,7.08-27.85,7.08-17.9,0-30.18-10.85-30.18-33V162.9h64.63V113.38l-77,2.7,12.87-68.76-57.56,6.13v59.93H1059V162.9h43.4V263.39c0,58,33,86.78,83.51,84.9a128.54,128.54,0,0,0,47.63-9.9Z"/>
                        </svg>
                        <span tw="px-1.5 py-2 text-neutral-400">Invest Smart, Earn Smart</span>
                    </div>
                    <div tw="flex rounded-3xl border border-neutral-800" style={{
                        width: "800px",
                        height: "430px",
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
                </div>
                <div tw='flex justify-between items-center w-full'>
                    <span tw="text-neutral-600 text-sm">Disclaimer: This information is provided for informational purposes only and is not intended as financial advice.</span>
                    <button tw='bg-white px-8 py-2 rounded-3xl text-black'>Discover More</button>
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
