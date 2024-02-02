import {BondCardInfo} from "@/components/pages/bonds/utils/bond-card/type";
import Image from "next/image";
import {formatLargeNumber} from "@/modules/utils/numbers";
import {getChain, getChainIcon} from "@/modules/utils/wallet-connect";
import {shorten} from "@/modules/web3/util";
import Link from "next/link";
import {tColor} from "@/components/pages/bonds/utils/colors";
import {BlockTimes} from "@/modules/web3/constants";
import {formatTime} from "@/modules/utils/dates";

export default function BondCard({info, link}: { info: BondCardInfo, link?: string }) {
    const {
        contractAddress,
        redeemed,
        purchased,
        total,
        interest,
        investment,
        score,
        tbv,
        maturityPeriod,
        chainId,
        issuer,
        issuanceDate
    } = info;

    const url = link || `/explore/${chainId}/${contractAddress}`
    const chain = getChain(chainId);
    const chainIcon = getChainIcon(chainId);

    const scoreColor = tColor(score * 10)

    const redeemedPercentage = Math.round(redeemed * 100 / total);
    const purchasedPercentage = Math.round(purchased * 100 / total);

    const maturityPeriodClean = (BlockTimes[chainId] || 1) * maturityPeriod

    return <>
        <Link href={url}>
            <div className='group flex flex-col justify-between gap-16 rounded-3xl border border-w1 p-6 py-4 hover:border-w2 bg-black w-full bg-gradient-to-tr from-black to-neutral-950 overflow-clip'>
                <div className='flex justify-between w-full z-10'>
                    <div className='flex items-start gap-2'>
                        <div className='flex items-center gap-3 w-full whitespace-nowrap'>
                            <Image src={interest.icon}
                                   alt={interest.name}
                                   width={1000}
                                   height={1000}
                                   className='object-contain w-[40px] h-[40px]'/>
                            <div className='flex flex-col items-start'>
                                <span className='text-xl font-bold'>{interest.name}</span>
                                <span className='text-xs text-stone-400'>{investment.symbol} - {interest.symbol}</span>
                            </div>
                        </div>
                        <span className='px-3 py-1 bg-stone-700 rounded-full text-xs'>ZCB</span>
                    </div>
                    <div className='flex flex-col'>
                        <span className={`text-3xl font-bold ${scoreColor} `}>{score}</span>
                        <span className='text-stone-400 text-xs'>Score</span>
                    </div>
                </div>
                <div className='flex flex-col gap-4 z-10'>
                    <div className='flex justify-between items-stretch gap-6 whitespace-nowrap'>
                        <div className='flex flex-col items-center gap-1'>
                            <span className='text-md font-semibold'>{formatLargeNumber(investment.amountClean, true)} {investment.symbol}</span>
                            <span className='text-xs text-stone-400'>Investment</span>
                        </div>
                        <div className='flex flex-col items-center gap-1'>
                            <span className='text-md font-semibold'>{formatLargeNumber(interest.amountClean, true)} {interest.symbol}</span>
                            <span className='text-xs text-stone-400'>Total Return</span>
                        </div>
                        <div className='flex flex-col items-center gap-1'>
                            <span className='text-md font-semibold'>{formatTime(maturityPeriodClean, true, true, true)}</span>
                            <span className='text-xs text-stone-400'>Maturity Period</span>
                        </div>
                        <div className='flex flex-col items-center gap-1'>
                            <span className='text-md font-semibold'>${formatLargeNumber(tbv, true)}</span>
                            <span className='text-xs text-stone-400'>TBV</span>
                        </div>
                    </div>
                    <div className='relative w-full '>
                        <div className="absolute h-[3px] bg-green-900 z-20" style={{width: `${redeemedPercentage}%`}}/>
                        <div className="absolute h-[3px] bg-green-500 z-10" style={{width: `${purchasedPercentage}%`}}/>
                        <div className='absolute h-[3px] w-full bg-white'/>
                    </div>
                    <div className='flex justify-between items-center w-full'>
                        <span className='text-stone-400 text-xs'>Issuer: {shorten(issuer)}</span>
                        <span className='text-stone-400 text-xs'>{issuanceDate}</span>
                    </div>
                </div>
            </div>
        </Link>
    </>
}
