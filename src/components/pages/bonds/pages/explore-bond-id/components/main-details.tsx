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
import WarningSVG from "../../../../../../../public/svg/utils/warning";
import InfoBox from "@/components/utils/info-box";
import {InfoSections} from "@/components/pages/bonds/pages/issue/constants";
import {ConditionalRenderer} from "@/components/utils/container";
import CalculatorController from "@/components/pages/bonds/utils/calculator";

export default function MainDetailsContainer({bondDetailed}: { bondDetailed: ContractExtendedFormat }) {
    const {contractInfo} = bondDetailed;

    const {
        _id,
        issuer,
        purchase,
        payout,
        totalBonds,
        purchased,
        redeemed,
        maturityPeriodInBlocks,
        issuanceDate,
        owner
    } = contractInfo;

    const [contractAddress, chainId] = _id.split("_")


    const tbv = CalculatorController.tbv(contractInfo);
    const maturityPeriodTime = formatTime(BlockTimes[chainId] * maturityPeriodInBlocks, true, true, true)
    const chain = getChain(chainId)
    const chainIcon = getChainIcon(chainId);

    const payoutIcon = payout.icon ?? makeBlockie(payout._id)
    const issuanceDateInFormat = new Date(issuanceDate);
    const issuanceDateClean = `${issuanceDateInFormat.toLocaleDateString()}`.replace(/\//g, '.');

    const redeemedPercentage = Math.round(redeemed * 100 / totalBonds);
    const purchasedPercentage = Math.round(purchased * 100 / totalBonds);

    const purchaseTokenExplorer = getExplorer(chainId, "token", purchase.contractAddress);
    const payoutTokenExplorer = getExplorer(chainId, "token", payout.contractAddress);

    const payoutPriceUsd = payout.amountClean * (payout.priceUsd || 0);
    const purchasePriceUsd = purchase.amountClean * (purchase.priceUsd || 0)
    const expectedReturnPerBond = payoutPriceUsd - purchasePriceUsd;
    const expectedReturnMultiplier = payoutPriceUsd / purchasePriceUsd;

    return <div
        className='flex flex-col gap-8 lg:col-span-8 col-span-12  rounded-3xl p-6 border border-neutral-900 w-full'>
        <div className='flex flex-col gap-4 w-full'>
            <div className='flex md:flex-row flex-col justify-between w-full'>
                <div className='flex gap-2'>
                    <div className='w-12 h-12 rounded-full'>
                        <Image src={payoutIcon} alt={payout.name}
                               width={1000} height={1000}
                               className='w-full h-full object-contain rounded-full'/>
                    </div>
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
                    <span
                        className='bg-neutral-900 h-min px-3 py-1 rounded-md text-neutral-200 text-sm'>Fixed Flex</span>
                </div>
                <div className='flex flex-col justify-end items-end gap-2'>
                    <div className='relative grid grid-cols-3 items-end rounded-t-md gap-x-2'>
                        <div
                            className='flex flex-col items-center px-2 py-1.5 cursor-pointer text-center'>
                            <span className='text-md font-semibold'>{formatLargeNumber(totalBonds)}</span>
                            <span className='text-xs text-neutral-400 font-light'>Total Bonds</span>
                        </div>
                        <div
                            className='flex flex-col items-center px-2 py-1.5 cursor-pointer text-center'>
                            <span className='text-md font-semibold'>{formatLargeNumber(purchased)}</span>
                            <span className='text-xs text-neutral-400 font-light'>Purchased</span>
                        </div>
                        <div
                            className='flex flex-col items-center px-2 py-1.5 cursor-pointer rounded-tr-md text-center'>
                            <span className='text-md font-semibold'>{formatLargeNumber(redeemed)}</span>
                            <span className='text-xs text-neutral-400 font-light'>Redeemed</span>
                        </div>
                        <div className='relative w-full col-span-3 h-0.5'>
                            <div className='absolute h-full bg-green-900 rounded-full z-20'
                                 style={{width: `${redeemedPercentage}%`}}/>
                            <div className='absolute h-full bg-green-500 rounded-full z-10'
                                 style={{width: `${purchasedPercentage}%`}}/>
                            <div className='absolute h-full bg-white rounded-full w-full'/>
                        </div>
                    </div>
                    {contractInfo.isSettled && <SettledContract/>}
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                <ConditionalRenderer isOpen={!Boolean(payout.isVerified)}>
                    <NotVerifiedAsset title={"Payout"}/>
                </ConditionalRenderer>
                <ConditionalRenderer isOpen={!Boolean(purchase.isVerified)}>
                    <NotVerifiedAsset title={"Purchase"}/>
                </ConditionalRenderer>
            </div>
        </div>

        <div className='flex flex-col gap-8'>
            <div className='grid grid-cols-3  gap-4 mt-4 w-full p-4'>
                <div className='col-span-1 flex flex-col justify-end w-full'>
                        <span className='text-xl font-bold'>{formatLargeNumber(purchase.amountClean)} {purchase.symbol}</span>
                    <span className='text-sm text-neutral-400'>Purchase</span>
                </div>
                <div className='col-span-1 flex flex-col justify-end w-full'>
                    <span className='text-xl font-bold'>{maturityPeriodTime}</span>
                    <span className='text-sm text-neutral-400'>Maturity Period</span>
                </div>
                <div className='col-span-1 flex flex-col gap-1 justify-end w-full'>
                    <div className='flex items-center gap-2'>
                        <Image src={chainIcon} alt={chain?.name || ""} width={24} height={24}/>
                        <span className='text-xl font-bold'>{shortenString(chain?.name || "", 10)}</span>
                    </div>
                    <span className='text-sm text-neutral-400'>Chain</span>
                </div>
                <div className='col-span-1 flex flex-col justify-end w-full'>
                        <span
                            className='text-xl font-bold'>{formatLargeNumber(payout.amountClean)} {payout.symbol}</span>
                    <span className='text-sm text-neutral-400'>Payout</span>
                </div>
                <div className='col-span-1 flex flex-col justify-end w-full'>
                    <span className='text-xl font-bold'>${formatLargeNumber(tbv, true)}</span>
                    <span className='text-sm text-neutral-400'>Total Bonded Volume</span>
                </div>
                <div className='col-span-1 flex flex-col justify-end  w-full'>
                        <span
                            className='text-xl font-bold text-green-500'>${formatLargeNumber(expectedReturnPerBond, true)}(x{formatLargeNumber(expectedReturnMultiplier)})</span>
                    <span className='text-sm text-neutral-400'>Return Per Bond</span>
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
}

function SettledContract() {
    return <>
        <div className='text-sm font-medium'>
            <InfoBox info={InfoSections.Settled} className='w-[400%]' parentClassName="py-2" isRight={true}>
                <span className='text-green-500 whitespace-nowrap px-1 cursor-pointer'>Settled</span>
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
