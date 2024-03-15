import Image from "next/image";
import {formatLargeNumber} from "@/modules/utils/numbers";
import {shorten} from "@/modules/web3/util";
import Link from "next/link";
import {tColor} from "@/components/pages/bonds/utils/colors";
import {BlockTimes} from "@/modules/web3/constants";
import {formatTime} from "@/modules/utils/dates";
import {ContractBasicFormat} from "@/modules/cloud-api/contract-type";
import makeBlockie from "ethereum-blockies-base64";
import {shortenString} from "@/modules/utils/string";

export default function BondCard({info, link}: Readonly<{ info: ContractBasicFormat, link?: string }>) {
    const {
        _id,
        redeemed,
        owner,
        purchased,
        totalBonds,
        payout,
        purchase,
        score,
        tbv,
        maturityPeriodInBlocks,
        issuer,
        issuanceDate
    } = info;
    const [contractAddress, chainId] = _id.split("_");

    const url = link ?? `/bonds/explore/${chainId}/${contractAddress}`

    const scoreColor = tColor(score * 10)

    const redeemedPercentage = Math.round(redeemed * 100 / totalBonds);
    const purchasedPercentage = Math.round(purchased * 100 / totalBonds);

    const maturityPeriodClean = (BlockTimes[chainId] || 1) * maturityPeriodInBlocks
    const maturityInTime = formatTime(maturityPeriodClean, true, true, true)

    const payoutIcon = payout.icon ?? makeBlockie(contractAddress);

    const payoutSymbolShort = shortenString(payout.symbol, 5)
    const purchaseSymbolShort = shortenString(purchase.symbol, 5)

    const issuanceDateInFormat = new Date(issuanceDate);
    const issuanceDateClean = `${issuanceDateInFormat.toLocaleDateString()}`.replace(/\//g, '.');

    const payoutPriceUsd = payout.amountClean * (payout.priceUsd ?? 0);
    const purchasePriceUsd = purchase.amountClean * (purchase.priceUsd ?? 0)
    const expectedReturnPerBond = payoutPriceUsd - purchasePriceUsd;
    const expectedReturnMultiplier = payoutPriceUsd / purchasePriceUsd;

    return (
        <Link href={url}>
            <div
                className='flex flex-col justify-between gap-14 rounded-2xl border border-neutral-900 p-4 py-4 hover:border-neutral-800 hover:bg-neutral-950 bg-black w-full overflow-clip'>
                <div className='flex justify-between items-center w-full z-10'>
                    <div className='flex items-start gap-2'>
                        <div className='flex items-center gap-2 w-full whitespace-nowrap'>
                            <Image src={payoutIcon}
                                   alt={payout.name}
                                   width={1000}
                                   height={1000}
                                   className='object-contain w-[34px] rounded-full'/>
                            <div className='flex flex-col items-start'>
                                <span className='text-base font-semibold'>{payout.name}</span>
                                <span
                                    className='text-mm text-neutral-500'>{purchaseSymbolShort} - {payoutSymbolShort}</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col items-end'>
                        <span className={`text-lg font-bold ${scoreColor}`}>{formatLargeNumber(score, false, 2)}</span>
                        <span className='text-neutral-500 text-mm'>Score</span>
                    </div>
                </div>
                <div className='flex flex-col gap-3 z-10'>
                    <div className='flex justify-between items-stretch  whitespace-nowrap'>
                        <DetailContainer
                            value={`${formatLargeNumber(purchase.amountClean, true, 2)} ${purchaseSymbolShort}`}
                            title={`Purchase`}/>
                        <DetailContainer
                            value={`${formatLargeNumber(payout.amountClean, true)} ${payoutSymbolShort}`}
                            title="Payout"/>
                        <DetailContainer
                            value={maturityInTime}
                            title="Period"/>
                        <DetailContainer
                            value={`x${formatLargeNumber(expectedReturnMultiplier)}`}
                            title="Multiplier"
                            valueClass='text-green-500 font-bold'/>
                    </div>
                    <div className='relative w-full '>
                        <div className="absolute h-[3px] bg-green-900 z-20"
                             style={{width: `${redeemedPercentage}%`}}/>
                        <div className="absolute h-[3px] bg-green-500 z-10"
                             style={{width: `${purchasedPercentage}%`}}/>
                        <div className='absolute h-[3px] w-full bg-white'/>
                    </div>
                    <div className='flex justify-between items-center w-full'>
                        <span className='text-neutral-400 text-mm'>Issuer: {shorten(issuer, 5)}</span>
                        <span className='text-neutral-400 text-mm'>{issuanceDateClean}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

function DetailContainer({value, title, valueClass}: Readonly<{ value: string, title: string, valueClass?: string }>) {
    return <div className='flex flex-col items-center'>
        <span className={`${valueClass} font-semibold`}>{value}</span>
        <span className='text-mm text-neutral-500'>{title}</span>
    </div>
}
