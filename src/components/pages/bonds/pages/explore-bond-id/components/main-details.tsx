import {ContractExtendedFormat} from "@/modules/api/contract-type";
import {formatTime} from "@/modules/utils/dates";
import {getChain, getChainIcon} from "@/modules/utils/wallet-connect";
import makeBlockie from "ethereum-blockies-base64";
import Image from "next/image";
import {shortenString} from "@/modules/utils/string";
import {formatLargeNumber} from "@/modules/utils/numbers";
import Link from "next/link";
import {getExplorer, shorten} from "@/modules/web3/util";
import WarningSVG from "../../../../../../../public/svg/utils/warning";
import {InfoDescription} from "@/components/utils/info-box";
import {ConditionalRenderer} from "@/components/utils/container";
import {CHAIN_BLOCK_TIMES} from "@/modules/web3/constants";

export default function MainDetailsContainer({bondDetailed}: Readonly<{ bondDetailed: ContractExtendedFormat }>) {
    const {contractInfo} = bondDetailed;

    const {
        chainId,
        issuer,
        purchase,
        payout,
        totalBonds,
        purchased,
        redeemed,
        maturityPeriodInBlocks,
        issuanceDate,
        purchaseRate
    } = contractInfo;

    const maturityPeriodLong = formatTime(CHAIN_BLOCK_TIMES[chainId] * maturityPeriodInBlocks, false, true);
    const maturityPeriodTime = formatTime(CHAIN_BLOCK_TIMES[chainId] * maturityPeriodInBlocks, true, true, true)
    const chain = getChain(chainId)
    const chainIcon = getChainIcon(chainId);

    const payoutIcon = payout.icon ?? makeBlockie(payout.contractAddress)
    const issuanceDateInFormat = new Date(issuanceDate);
    const issuanceDateClean = `${issuanceDateInFormat.toLocaleDateString("en-GB")}`.replace(/\//g, '.');

    const redeemedPercentage = Math.round(redeemed * 100 / totalBonds);
    const purchasedPercentage = Math.round(purchased * 100 / totalBonds);

    const purchaseTokenExplorer = getExplorer(chainId, "token", purchase.contractAddress);
    const payoutTokenExplorer = getExplorer(chainId, "token", payout.contractAddress);

    const purchasePriceUsd = purchase.amountClean * (purchase.priceUsd ?? 0)
    const payoutPriceUsd = payout.amountClean * (payout.priceUsd ?? 0)

    const totalPurePurchase = totalBonds * purchase.amountClean
    const totalPurchase = totalPurePurchase - (totalPurePurchase * purchaseRate) / 100;
    const totalPurchaseText = `${formatLargeNumber(totalPurchase)} = ${formatLargeNumber(totalPurePurchase)} (Total Bonds * Purchase Price) - ${purchaseRate}% (Purchase Fee)`;


    const totalPayout = totalBonds * payout.amountClean
    const totalPayoutText = `${formatLargeNumber(totalPayout)} =  ${formatLargeNumber(totalPayout)} (Total Bonds * Payout Amount)`

    return (
        <div
            className='flex flex-col justify-between gap-8 xl:col-span-8 col-span-12 rounded-3xl p-6 border border-neutral-900 w-full'>
            <div className='flex flex-col gap-4 w-full'>
                <div className='flex md:flex-row flex-col justify-between w-full sm:gap-4 gap-8 items-start'>
                    <div className='flex justify-start gap-2 md:w-max w-full'>
                        <Link href={payoutTokenExplorer} target='_blank' className='md:w-12 md:h-12 w-10 h-10'>
                            <Image src={payoutIcon} alt={payout.name}
                                   width={1000} height={1000}
                                   className=' object-contain rounded-full border border-neutral-900 hover:border-neutral-800 cursor-pointer'/>
                        </Link>
                        <div className='flex justify-between gap-2 w-full'>
                            <div className='flex flex-col'>
                                <span className='xl:text-xl md:text-xl text-base font-bold'>{payout.name}</span>
                                <div
                                    className='flex gap-1 items-center cursor-pointer font-thin text-neutral-400 sm:text-sm text-xs'>
                                    <Link href={purchaseTokenExplorer} target="_blank">
                                        <span className='hover:underline underline-offset-2'>{purchase.symbol}</span>
                                    </Link>
                                    <span>-</span>
                                    <Link href={payoutTokenExplorer} target="_blank">
                                        <span className='hover:underline underline-offset-2'>{payout.symbol}</span>
                                    </Link>
                                </div>
                            </div>
                            <span
                                className='bg-neutral-900 h-min px-3 py-1 rounded-md text-neutral-200 text-center sm:text-sm text-xs'>Fixed Flex</span>
                        </div>
                    </div>
                    <div className='flex flex-col justify-end items-end gap-3 md:w-max w-full'>
                        <div className='relative grid grid-cols-3 items-end gap-x-2 md:w-max w-full'>
                            <div className='flex flex-col items-center px-2 cursor-pointer text-center'>
                                <span className='text-md font-semibold'>{formatLargeNumber(totalBonds)}</span>
                                <span className='text-xs text-neutral-400 font-light'>Total Bonds</span>
                            </div>
                            <div className='flex flex-col items-center px-2 cursor-pointer text-center'>
                                <span className='text-md font-semibold'>{formatLargeNumber(purchased)}</span>
                                <span className='text-xs text-neutral-400 font-light'>Purchased</span>
                            </div>
                            <div
                                className='flex flex-col items-center px-2 cursor-pointer text-center'>
                                <span className='text-md font-semibold'>{formatLargeNumber(redeemed)}</span>
                                <span className='text-xs text-neutral-400 font-light'>Redeemed</span>
                            </div>
                            {/*<div className='relative w-full col-span-3 h-0.5'>*/}
                            {/*    <div className='absolute h-full bg-green-900 rounded-full z-20'*/}
                            {/*         style={{width: `${redeemedPercentage}%`}}/>*/}
                            {/*    <div className='absolute h-full bg-green-500 rounded-full z-10'*/}
                            {/*         style={{width: `${purchasedPercentage}%`}}/>*/}
                            {/*    <div className='absolute h-full bg-white rounded-full w-full'/>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <ConditionalRenderer isOpen={!payout.isVerified}>
                        <NotVerifiedAsset title={"Payout"}/>
                    </ConditionalRenderer>
                    <ConditionalRenderer isOpen={!purchase.isVerified}>
                        <NotVerifiedAsset title={"Purchase"}/>
                    </ConditionalRenderer>
                </div>
            </div>

            <div className='flex flex-col gap-8'>
                <div className='grid grid-cols-8 gap-4 mt-4 w-full items-start'>
                    <InfoDescription className='lg:col-span-2 col-span-4 flex flex-col justify-end w-full cursor-help'
                                     isRight
                                     width={100}
                                     text={`${purchase.amountClean} ${purchase.symbol} ~ $${formatLargeNumber(purchasePriceUsd, false, 5)}`}>
                        <span
                            className='font-bold'>{formatLargeNumber(purchase.amountClean, false, 5)} {purchase.symbol}</span>
                        <span className='text-xs text-neutral-400'>Purchase</span>
                    </InfoDescription>
                    <InfoDescription className='lg:col-span-2 col-span-4 flex flex-col justify-end w-full cursor-help'
                                     isRight
                                     width={100}
                                     text={`${payout.amountClean} ${payout.symbol} ~ $${formatLargeNumber(payoutPriceUsd, false, 5)}`}>
                        <span
                            className='font-bold'>{formatLargeNumber(payout.amountClean, false, 5)} {payout.symbol}</span>
                        <span className='text-xs text-neutral-400'>Payout</span>
                    </InfoDescription>
                    <InfoDescription
                        text={`${maturityPeriodLong} or ${formatLargeNumber(maturityPeriodInBlocks)} blocks`}
                        isRight
                        width={100}
                        className='lg:col-span-2 col-span-4 flex flex-col justify-end w-full cursor-help'>
                        <span className='font-bold'>{maturityPeriodTime}</span>
                        <span className='text-xs text-neutral-400'>Maturity Period</span>
                    </InfoDescription>
                    <div className='lg:col-span-2 col-span-4 flex flex-col gap-1 justify-end w-full cursor-help'>
                        <div className='flex items-center gap-2'>
                            <Image src={chainIcon} alt={chain?.name ?? ""} width={24} height={24}/>
                            <span className='font-bold'>{shortenString(chain?.name ?? "", 7)}</span>
                        </div>
                        <span className='text-xs text-neutral-400'>Chain</span>
                    </div>
                    <InfoDescription
                        text={totalPurchaseText}
                        isRight
                        width={200}
                        className='lg:col-span-2 col-span-4 flex flex-col justify-end w-full cursor-help'>
                        <span className='font-bold'>{formatLargeNumber(totalPurchase)} {purchase.symbol}</span>
                        <span className='text-xs text-neutral-400'>Total Purchase Amount</span>
                    </InfoDescription>

                    <InfoDescription
                        text={totalPayoutText}
                        isRight
                        width={200}
                        className='lg:col-span-2 col-span-4 flex flex-col justify-end w-full cursor-help'>
                        <span className='font-bold'>{formatLargeNumber(totalPayout)} {payout.symbol}</span>
                        <span className='text-xs text-neutral-400'>Total Payout Amount</span>
                    </InfoDescription>
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
    )
}

function NotVerifiedAsset({title}: { title: string }) {
    return (
        <div
            className='flex items-center gap-2 px-4 py-1 border w-min whitespace-nowrap rounded-md border-w1 cursor-pointer'>
            <WarningSVG/>
            <span className='text-red-500 text-sm font-light'><b>Caution</b>: {title} token has not been verified. Please proceed carefully!</span>
        </div>
    )
}
