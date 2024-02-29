import {ContractExtendedFormat} from "@/modules/cloud-api/contract-type";
import {formatTime} from "@/modules/utils/dates";
import {BlockTimes} from "@/modules/web3/constants";
import {getChain, getChainIcon} from "@/modules/utils/wallet-connect";
import makeBlockie from "ethereum-blockies-base64";
import Image from "next/image";
import {shortenString} from "@/modules/utils/string";
import {formatLargeNumber} from "@/modules/utils/numbers";
import Link from "next/link";
import {getExplorer, shorten} from "@/modules/web3/util";
import WarningSVG from "../../../../../../../public/svg/warning";
import InfoBox from "@/components/utils/info-box";
import {InfoSections} from "@/components/pages/bonds/pages/issue/constants";

export default function MainDetailsContainer({bondDetailed}: { bondDetailed: ContractExtendedFormat }) {
    const {contractInfo, contractStats} = bondDetailed;

    const {
        _id,
        issuer,
        purchase,
        payout,
        totalBonds,
        purchased,
        redeemed,
        maturityPeriodInBlocks,
        issuanceDate
    } = contractInfo;

    const [contractAddress, chainId] = _id.split("_")

    const {tbv} = contractStats;

    const maturityPeriodTime = formatTime(BlockTimes[chainId] * maturityPeriodInBlocks, true, true, true)
    const chain = getChain(chainId)
    const chainIcon = getChainIcon(chainId);

    const payoutIcon = payout.icon || makeBlockie(payout._id)
    const issuanceDateInFormat = new Date(issuanceDate);
    const issuanceDateClean = `${issuanceDateInFormat.toLocaleDateString()}`.replace(/\//g, '.');

    const redeemedPercentage = Math.round(redeemed * 100 / totalBonds);
    const purchasedPercentage = Math.round(purchased * 100 / totalBonds);

    const purchaseTokenExplorer = getExplorer(chainId, "token", purchase.contractAddress);
    const payoutTokenExplorer = getExplorer(chainId, "token", payout.contractAddress);


    return <>
        <div
            className='flex flex-col gap-8 lg:col-span-8 sm:col-span-12  rounded-3xl p-8 pt-4 border border-neutral-900 w-full'>
            <div className='flex flex-col gap-4 w-full'>
                <div className='flex justify-between items-center w-full'>
                    <div className='flex gap-2'>
                        <Image src={payoutIcon} alt={payout.name} width={48} height={48}
                               className='object-contain rounded-full'/>
                        <div className='flex flex-col'>
                            <span className='text-2xl font-bold'>{payout.name}</span>
                            <div className='flex gap-1 items-center cursor-pointer'>
                                <Link href={purchaseTokenExplorer} target="_blank">
                                    <span
                                        className='font-thin text-neutral-400 text-sm hover:underline underline-offset-2'>{purchase.symbol}</span>
                                </Link>
                                <span className='font-thin text-neutral-400 text-sm'>-</span>
                                <Link href={payoutTokenExplorer} target="_blank">
                                    <span
                                        className='font-thin text-neutral-400 text-sm hover:underline underline-offset-2'>{payout.symbol}</span>
                                </Link>
                            </div>
                        </div>
                        <span className='bg-neutral-900 h-min px-3 py-1 rounded-full text-neutral-400'>Fixed Flex</span>
                    </div>
                    <div className='flex flex-col items-end'>
                        <div className='flex flex-col '>
                            <div className='relative grid grid-cols-3 items-end rounded-t-md gap-x-2'>
                                <div
                                    className='flex flex-col items-center px-2 py-1.5 cursor-pointer'>
                                    <span className='text-md font-semibold'>{formatLargeNumber(totalBonds)}</span>
                                    <span className='text-xs text-neutral-400 font-light'>Total Bonds</span>
                                </div>
                                <div
                                    className='flex flex-col items-center px-2 py-1.5 cursor-pointer'>
                                    <span className='text-md font-semibold'>{formatLargeNumber(purchased)}</span>
                                    <span className='text-xs text-neutral-400 font-light'>Purchased</span>
                                </div>
                                <div
                                    className='flex flex-col items-center px-2 py-1.5 cursor-pointer rounded-tr-md'>
                                    <span className='text-md font-semibold'>{formatLargeNumber(redeemed)}</span>
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
                <div className='flex flex-col gap-1'>
                    {!Boolean(payout.isVerified) && <NotVerifiedAsset title={"Payout"}/>}
                    {!Boolean(purchase.isVerified) && <NotVerifiedAsset title={"Purchase"}/>}
                    {contractInfo.isSettled && <SettledContract/>}
                </div>
            </div>

            <div className='flex flex-col gap-8'>
                <div className='grid grid-cols-3 gap-y-12 mt-8 w-full p-4'>
                    <div className='col-span-1 flex flex-col gap-1 justify-end w-full'>
                        <span className='text-2xl font-bold'>{formatLargeNumber(purchase.amountClean)} {purchase.symbol}</span>
                        <span className='text-sm text-neutral-400'>Purchase</span>
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
                        <span className='text-2xl font-bold'>{formatLargeNumber(payout.amountClean)} {payout.symbol}</span>
                        <span className='text-sm text-neutral-400'>Payout</span>
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

function SettledContract() {
    return <>
        <div className='border border-green-700  w-min rounded-md text-sm font-medium'>
            <InfoBox info={InfoSections.Settled} className='w-[400%]' parentClassName="pr-4 py-1">
                <span className='text-green-500 px-4'>Settled</span>
            </InfoBox>
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
