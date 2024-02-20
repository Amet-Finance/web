import {ContractExtendedFormat} from "@/modules/cloud-api/contract-type";
import {formatTime} from "@/modules/utils/dates";
import {BlockTimes} from "@/modules/web3/constants";
import {getChain, getChainIcon} from "@/modules/utils/wallet-connect";
import makeBlockie from "ethereum-blockies-base64";
import Image from "next/image";
import {shortenString} from "@/modules/utils/string";
import {formatLargeNumber} from "@/modules/utils/numbers";
import Link from "next/link";
import {shorten} from "@/modules/web3/util";
import WarningSVG from "../../../../../../../public/svg/warning";

export default function MainDetailsContainer({bondDetailed}: { bondDetailed: ContractExtendedFormat }) {
    const {contractInfo, contractStats} = bondDetailed;

    const {
        _id,
        issuer,
        investment,
        interest,
        total,
        purchased,
        redeemed,
        maturityPeriod,
        issuanceDate
    } = contractInfo;

    const [contractAddress, chainId] = _id.split("_")

    const {tbv} = contractStats;

    const maturityPeriodTime = formatTime(BlockTimes[chainId] * maturityPeriod, true, true, true)
    const chain = getChain(chainId)
    const chainIcon = getChainIcon(chainId);

    const interestIcon = interest.icon || makeBlockie(interest._id)
    const issuanceDateInFormat = new Date(issuanceDate);
    const issuanceDateClean = `${issuanceDateInFormat.toLocaleDateString()}`.replace(/\//g, '.');

    const redeemedPercentage = Math.round(redeemed * 100 / total);
    const purchasedPercentage = Math.round(purchased * 100 / total);


    return <>
        <div
            className='flex flex-col gap-8 lg:col-span-8 sm:col-span-12  rounded-3xl p-8 pt-4 border border-neutral-900 w-full'>
            <div className='flex flex-col gap-2 w-full'>
                <div className='flex justify-between items-center w-full'>
                    <div className='flex gap-2'>
                        <Image src={interestIcon} alt={interest.name} width={48} height={48}
                               className='object-contain rounded-full'/>
                        <div className='flex flex-col'>
                            <span className='text-2xl font-bold'>{interest.name}</span>
                            <span
                                className='font-thin text-neutral-400 text-sm'>{investment.symbol} - {interest.symbol}</span>
                        </div>
                        <span className='bg-neutral-900 h-min px-3 py-1 rounded-full text-neutral-400'>ZCB</span>
                    </div>
                    <div className='flex flex-col items-end'>
                        <div className='flex flex-col '>
                            <div className='relative grid grid-cols-3 items-end rounded-t-md gap-x-2'>
                                <div
                                    className='flex flex-col items-center px-2 py-1.5 cursor-pointer'>
                                    <span className='text-md font-semibold'>{total}</span>
                                    <span className='text-xs text-neutral-400 font-light'>Total Bonds</span>
                                </div>
                                <div
                                    className='flex flex-col items-center px-2 py-1.5 cursor-pointer'>
                                    <span className='text-md font-semibold'>{purchased}</span>
                                    <span className='text-xs text-neutral-400 font-light'>Purchased</span>
                                </div>
                                <div
                                    className='flex flex-col items-center px-2 py-1.5 cursor-pointer rounded-tr-md'>
                                    <span className='text-md font-semibold'>{redeemed}</span>
                                    <span className='text-xs text-neutral-400 font-light'>Redeemed</span>
                                </div>
                                <div className='relative w-full col-span-3 h-0.5'>
                                    <div className='absolute h-full bg-green-900 rounded-full z-20' style={{width: `${redeemedPercentage}%`}}/>
                                    <div className='absolute h-full bg-green-500 rounded-full z-10' style={{width: `${purchasedPercentage}%`}}/>
                                    <div className='absolute h-full bg-white rounded-full w-full'/>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {!Boolean(interest.isVerified) && <NotVerifiedAsset title={"Interest"}/>}
                {!Boolean(investment.isVerified) && <NotVerifiedAsset title={"Investment"}/>}
            </div>

            <div className='flex flex-col gap-8'>
                <div className='grid grid-cols-3 gap-y-12 mt-8 w-full p-4'>
                    <div className='col-span-1 flex flex-col gap-1 justify-end w-full'>
                        <span className='text-2xl font-bold'>{investment.amountClean} {investment.symbol}</span>
                        <span className='text-sm text-neutral-400'>Investment</span>
                    </div>
                    <div className='col-span-1 flex flex-col gap-1 justify-end w-full'>
                        <span className='text-2xl font-bold'>{maturityPeriodTime}</span>
                        <span className='text-sm text-neutral-400'>Maturity Period</span>
                    </div>
                    <div className='col-span-1 flex flex-col gap-1 justify-end w-full'>
                        <div className='flex items-center gap-2'>
                            <Image src={chainIcon} alt={chain?.name || ""} width={32} height={32}/>
                            <span className='text-2xl font-bold'>{shortenString(chain?.name || "", 10)}</span>
                        </div>
                        <span className='text-sm text-neutral-400'>Chain</span>
                    </div>
                    <div className='col-span-1 flex flex-col justify-end gap-1 w-full'>
                        <span className='text-2xl font-bold'>{interest.amountClean} {interest.symbol}</span>
                        <span className='text-sm text-neutral-400'>Interest</span>
                    </div>
                    <div className='col-span-1 flex flex-col justify-end gap-1 w-full'>
                        <span className='text-2xl font-bold'>${formatLargeNumber(tbv, true)}</span>
                        <span className='text-sm text-neutral-400'>Total Bonded Volume</span>
                    </div>
                </div>
                <div className='flex items-center justify-between w-full text-sm'>
                    <div className='flex items-center gap-2 text-neutral-400'>
                        <span>Issuer:</span>
                        <Link href={`/address/${issuer}`}>
                            <span className='underline'>{shorten(issuer, 5)}</span>
                        </Link>
                    </div>
                    <span className='text-neutral-400'>{issuanceDateClean}</span>
                </div>
            </div>

        </div>
    </>
}

function NotVerifiedAsset({title}: { title: string }) {
    return <>
        <div
            className='flex items-center gap-2 px-4 py-1 border w-min whitespace-nowrap rounded-md border-w1 cursor-pointer'>
            <WarningSVG/>
            <span className='text-red-500 text-sm font-light'><b>Caution</b>: {title} token has not been verified. Please proceed carefully!</span>
        </div>
    </>
}
