import Image from "next/image";
import {format, formatLargeNumber} from "@/modules/utils/numbers";
import {shorten} from "@/modules/web3/util";
import Link from "next/link";
import {tColor} from "@/components/pages/bonds/utils/colors";
import {BlockTimes} from "@/modules/web3/constants";
import {formatTime} from "@/modules/utils/dates";
import {ContractBasicFormat} from "@/modules/cloud-api/contract-type";
import makeBlockie from "ethereum-blockies-base64";
import {shortenString} from "@/modules/utils/string";

export default function BondCard({info, link}: { info: ContractBasicFormat, link?: string }) {
    const {
        _id,
        redeemed,
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

    const url = link || `/bonds/explore/${chainId}/${contractAddress}`

    const scoreColor = tColor(score * 10)

    const redeemedPercentage = Math.round(redeemed * 100 / totalBonds);
    const purchasedPercentage = Math.round(purchased * 100 / totalBonds);

    const maturityPeriodClean = (BlockTimes[chainId] || 1) * maturityPeriodInBlocks
    const maturityInTime = formatTime(maturityPeriodClean, true, true, true)

    const payoutIcon = payout.icon || makeBlockie(contractAddress);

    const payoutSymbolShort = shortenString(payout.symbol, 5)
    const purchaseSymbolShort = shortenString(purchase.symbol, 5)

    const issuanceDateInFormat = new Date(issuanceDate);
    const issuanceDateClean = `${issuanceDateInFormat.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})} ${issuanceDateInFormat.toLocaleDateString()}`.replace(/\//g, '.');

    return <>
        <Link href={url}>
            <div className='group flex flex-col justify-between gap-16 rounded-3xl border border-w1 p-6 py-4 hover:border-w2 bg-black w-full bg-gradient-to-tr from-black to-neutral-950 overflow-clip'>
                <div className='flex justify-between w-full z-10'>
                    <div className='flex items-start gap-2'>
                        <div className='flex items-center gap-2 w-full whitespace-nowrap'>
                            <Image src={payoutIcon}
                                   alt={payout.name}
                                   width={1000}
                                   height={1000}
                                   className='object-contain w-[38px] rounded-full'/>
                            <div className='flex flex-col items-start'>
                                <span className='text-lg font-bold'>{payout.name}</span>
                                <span
                                    className='text-xs text-neutral-500'>{purchaseSymbolShort} - {payoutSymbolShort}</span>
                            </div>
                        </div>
                        <span
                            className='px-3 py-1 bg-stone-700 rounded-full text-mm whitespace-nowrap'>Fixed Flex</span>
                    </div>
                    <div className='flex flex-col items-end'>
                        <span className={`text-xl font-bold ${scoreColor}`}>{format(score || 0, 2)}</span>
                        <span className='text-neutral-500 text-mm'>Score</span>
                    </div>
                </div>
                <div className='flex flex-col gap-4 z-10'>
                    <div className='flex justify-between items-stretch  whitespace-nowrap'>
                        <div className='flex flex-col justify-end items-center'>
                            <span
                                className='text-md font-semibold'>{formatLargeNumber(purchase.amountClean, true)} {purchaseSymbolShort}</span>
                            <span className='text-xs text-neutral-500'>Purchase</span>
                        </div>
                        <div className='flex flex-col justify-end items-center'>
                            <span
                                className='text-md font-semibold'>{formatLargeNumber(payout.amountClean, true)} {payoutSymbolShort}</span>
                            <span className='text-xs text-neutral-500'>Payout</span>
                        </div>
                        <div className='flex flex-col justify-end items-center'>
                            <span className='text-md font-semibold'>{maturityInTime}</span>
                            <span className='text-xs text-neutral-500'>Maturity Period</span>
                        </div>
                        <div className='flex flex-col justify-end items-center'>
                            <span className='text-md font-semibold'>${formatLargeNumber(tbv, true)}</span>
                            <span className='text-xs text-neutral-500'>TBV</span>
                        </div>
                    </div>
                    <div className='relative w-full '>
                        <div className="absolute h-[3px] bg-green-900 z-20" style={{width: `${redeemedPercentage}%`}}/>
                        <div className="absolute h-[3px] bg-green-500 z-10" style={{width: `${purchasedPercentage}%`}}/>
                        <div className='absolute h-[3px] w-full bg-white'/>
                    </div>
                    <div className='flex justify-between items-center w-full'>
                        <span className='text-neutral-400 text-xs'>Issuer: {shorten(issuer)}</span>
                        <span className='text-neutral-400 text-xs'>{issuanceDateClean}</span>
                    </div>
                </div>
            </div>
        </Link>
    </>
}
