import Image from "next/image";
import {formatLargeNumber} from "@/modules/utils/numbers";
import {shorten} from "@/modules/web3/util";
import Link from "next/link";
import {tColor} from "@/components/pages/bonds/utils/colors";
import {formatTime} from "@/modules/utils/dates";
import makeBlockie from "ethereum-blockies-base64";
import {shortenString} from "@/modules/utils/string";
import {ContractCoreDetails} from "@/modules/api/contract-type";
import CalculatorController from "@/components/pages/bonds/utils/calculator";
import {useFinancialAttributeExtended} from "@/modules/utils/token";
import {ConditionalRenderer, ToggleBetweenChildren} from "@/components/utils/container";
import SecureSVG from "../../../../../../public/svg/utils/secure";
import SoldOutSVG from "../../../../../../public/svg/utils/sold-out";
import {InfoDescription} from "@/components/utils/info-box";
import {priorityBonds} from "@/modules/web3/featured";
import {BondContractTypes, CHAIN_BLOCK_TIMES} from "@/modules/web3/constants";
import {TagTexts} from "@/components/pages/bonds/utils/constants";


export default function BondCard({info, link}: Readonly<{ info: ContractCoreDetails, link?: string }>) {
    const purchase = useFinancialAttributeExtended(info.purchase);
    const payout = useFinancialAttributeExtended(info.payout);

    const bondDetails = {...info, purchase, payout};
    const {
        contractAddress,
        chainId,
        redeemed,
        owner,
        purchased,
        payoutBalance,
        isSettled,
        totalBonds,
        maturityPeriodInBlocks,
        issuanceDate
    } = bondDetails

    const additionalInfo = priorityBonds[chainId][contractAddress.toLowerCase()];
    const url = link ?? `/bonds/explore/${chainId}/${contractAddress}`
    const isSoldOut = totalBonds === purchased;

    const aprRate = CalculatorController.apr(bondDetails)
    const score = CalculatorController.score(bondDetails)
    const scoreColor = tColor(score * 10)

    const redeemedPercentage = Math.round(redeemed * 100 / totalBonds);
    const purchasedPercentage = Math.round(purchased * 100 / totalBonds);

    const maturityPeriodClean = CHAIN_BLOCK_TIMES[chainId] * maturityPeriodInBlocks
    const maturityInTime = formatTime(maturityPeriodClean, true, true, true)

    const payoutIcon = payout.icon ?? makeBlockie(contractAddress);

    const payoutSymbolShort = shortenString(payout.symbol, 5)
    const purchaseSymbolShort = shortenString(purchase.symbol, 5)

    const issuanceDateInFormat = new Date(issuanceDate);
    const issuanceDateClean = `${issuanceDateInFormat.toLocaleDateString("en-GB")}`.replace(/\//g, '.');


    return (
        <Link href={url}>
            <div className='group/main flex flex-col'>
                <div className=' flex gap-2 w-full h-full'>
                    <ConditionalRenderer isOpen={additionalInfo?.type === BondContractTypes.IBO}>
                        <InfoDescription
                            width={300}
                            text={TagTexts.IBO}
                            isRight>
                            <div
                                className='group-hover/main:translate-y-0 bg-amber-400 w-min px-4 pt-1 rounded-t-xl ml-4 border-t-2 border-neutral-900 group-hover/main:border-neutral-800 translate-y-5'>
                                <b className='text-sm'>IBO</b>
                            </div>
                        </InfoDescription>
                    </ConditionalRenderer>
                    <ConditionalRenderer isOpen={Boolean(additionalInfo?.boostedMultiplier)}>
                        <InfoDescription
                            width={200}
                            text={TagTexts.Boosted}
                            isRight>
                            <div className='group-hover/main:translate-y-0 bg-rose-600 w-min px-4 pt-1 rounded-t-xl border-t-2 border-neutral-900 group-hover/main:border-neutral-800 translate-y-5'>
                                <b className='text-sm whitespace-nowrap'>Boosted {additionalInfo?.boostedMultiplier}X</b>
                            </div>
                        </InfoDescription>
                    </ConditionalRenderer>
                </div>
                <div
                    className='relative rounded-2xl border border-neutral-900 group-hover/main:border-neutral-800 group-hover/main:bg-neutral-950'>
                    <div
                        className='flex flex-col justify-between gap-14 rounded-2xl p-4 py-4 bg-black w-full overflow-clip'>
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
                            <div className='flex items-start gap-2 z-20'>
                                <ConditionalRenderer isOpen={isSettled}>
                                    <InfoDescription text={TagTexts.Settled}>
                                        <SecureSVG size={18}/>
                                    </InfoDescription>
                                </ConditionalRenderer>
                                <ToggleBetweenChildren isOpen={isSoldOut}>
                                    <InfoDescription
                                        text={TagTexts.SoldOut}>
                                        <SoldOutSVG size={18}/>
                                    </InfoDescription>
                                    <div className='flex flex-col items-end'>
                                    <span
                                        className={`text-lg font-bold ${scoreColor} leading-5`}>{formatLargeNumber(score, false, 2)}</span>
                                        <span className='text-neutral-500 text-mm'>Score</span>
                                    </div>
                                </ToggleBetweenChildren>
                            </div>
                        </div>
                        <div className='flex flex-col gap-3'>
                            <div className='flex justify-between items-stretch  whitespace-nowrap'>
                                <DetailContainer
                                    value={`${formatLargeNumber(purchase.amountClean, true, 3)} ${purchaseSymbolShort}`}
                                    title={`Purchase`}/>
                                <DetailContainer
                                    value={`${formatLargeNumber(payout.amountClean, true, 3)} ${payoutSymbolShort}`}
                                    title="Payout"/>
                                <DetailContainer
                                    value={maturityInTime}
                                    title="Period"/>
                                <DetailContainer
                                    value={`${formatLargeNumber(aprRate)}%`}
                                    title="APR"
                                    valueClass={`${aprRate > 0 ? "text-green-500" : "text-red-500"} font-bold`}/>
                            </div>
                            <div className='relative w-full '>
                                <div className="absolute h-[3px] bg-green-900 z-20"
                                     style={{width: `${redeemedPercentage}%`}}/>
                                <div className="absolute h-[3px] bg-green-500 z-10"
                                     style={{width: `${purchasedPercentage}%`}}/>
                                <div className='absolute h-[3px] w-full bg-white'/>
                            </div>
                            <div className='flex justify-between items-center w-full'>
                                <span className='text-neutral-400 text-mm'>Issuer: {shorten(owner, 5)}</span>
                                <span className='text-neutral-400 text-mm'>{issuanceDateClean}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

function DetailContainer({value, title, valueClass}: Readonly<{ value: string, title: string, valueClass?: string }>) {
    return (
        <div className='flex flex-col items-center'>
            <span className={`${valueClass} text-sm font-semibold`}>{value}</span>
            <span className='text-mm text-neutral-500'>{title}</span>
        </div>
    )
}
