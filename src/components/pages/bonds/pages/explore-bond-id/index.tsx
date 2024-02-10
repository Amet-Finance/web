import {BondContractStats, BondDetailed} from "@/components/pages/bonds/pages/explore-bond-id/type";
import ArrowCurveSVG from "../../../../../../public/svg/utils/arrow-curve";
import RefreshSVG from "../../../../../../public/svg/utils/refresh";
import Image from "next/image";
import {BlockTimes} from "@/modules/web3/constants";
import {formatTime} from "@/modules/utils/dates";
import {getChain, getChainIcon} from "@/modules/utils/wallet-connect";
import {shorten} from "@/modules/web3/util";
import {shortenString} from "@/modules/utils/string";
import {formatLargeNumber} from "@/modules/utils/numbers";
import Link from "next/link";
import {useState} from "react";
import ArrowBasicSVG from "../../../../../../public/svg/utils/arrow-basic";
import {URLS} from "@/modules/utils/urls";

export default function ExploreBondId({bondDetailed}: { bondDetailed: BondDetailed }) {

    const {contractInfo, contractDescription, contractStats} = bondDetailed;

    // todo write a useEffect to update accordingly

    return <>
        <div className='flex flex-col gap-4 w-full px-52 py-24'>
            <HeadlineContainer/>
            <StatisticsContainer contractStats={contractStats}/>
            <MainContainer bondDetailed={bondDetailed}/>
        </div>
    </>
}

function HeadlineContainer() {
    return <>
        <div className='flex justify-between'>
            <span/>
            <div className='flex items-center gap-2 px-2'>
                <RefreshSVG isSmall={true}/>
                <span className='text-neutral-600 text-xs'>25s</span>
            </div>
        </div>
    </>
}

function StatisticsContainer({contractStats}: { contractStats: BondContractStats }) {

    const {score, securedPercentage, issuerScore, uniqueHolders} = contractStats;

    function Container({title, value}: { title: string, value: string }) {
        return <>
            <div
                className='flex flex-col items-end gap-4 bg-neutral-950 rounded-3xl p-6 pt-2 pr-2 border border-neutral-900'>
                <div className='w-min bg-neutral-800 p-4 rounded-full'><ArrowCurveSVG color='#fff'/></div>
                <div className='flex flex-col w-full gap-1'>
                    <span className='text-5xl font-bold'>{value}</span>
                    <span className='text-xs'>{title}</span>
                </div>
            </div>
        </>
    }

    return <>
        <div className='grid grid-cols-4 gap-4 w-full'>
            <Container title='Bond Score' value={score.toString()}/>
            <Container title='Secured Percentage' value={`${securedPercentage}%`}/>
            <Container title='Issuer Score' value={`${issuerScore}`}/>
            <Container title='Unique Holders' value={`${uniqueHolders}`}/>
        </div>
    </>
}

function MainContainer({bondDetailed}: { bondDetailed: BondDetailed }) {
    return <>
        <div className='grid grid-cols-12 w-full gap-4 h-full'>
            <MainDetailsContainer bondDetailed={bondDetailed}/>
            <ActionsContainer/>
        </div>
    </>
}

function MainDetailsContainer({bondDetailed}: { bondDetailed: BondDetailed }) {
    const {contractInfo, contractStats} = bondDetailed;

    const {
        issuer,
        chainId,
        investment,
        interest,
        total,
        purchased,
        redeemed,
        maturityPeriod,
        issuanceDate
    } = contractInfo;

    const {tbv} = contractStats;

    const maturityPeriodTime = formatTime(BlockTimes[contractInfo.chainId] * maturityPeriod, true, true, true)
    const chain = getChain(chainId)
    const chainIcon = getChainIcon(chainId)

    return <>
        <div
            className='flex flex-col gap-4 col-span-8 bg-neutral-950 rounded-3xl p-8 pt-4 border border-neutral-900 w-full'>
            <div className='flex justify-between items-center w-full'>
                {/*    bitcoin icon and etc*/}
                <div className='flex gap-2'>
                    <Image src={interest.icon} alt={interest.name} width={64} height={64}/>
                    <div className='flex flex-col'>
                        <span className='text-3xl font-bold'>{interest.name}</span>
                        <span className='font-thin text-neutral-400'>{investment.symbol} - {interest.symbol}</span>
                    </div>
                    <span className='bg-neutral-900 h-min px-3 py-1 rounded-full text-neutral-400'>ZCB</span>
                    {/*    todo add star here as well */}
                </div>

                <div className='flex flex-col items-end'>
                    <div className='flex gap-1 items-center'>
                        <div className='p-1 rounded-full bg-green-500'/>
                        <span className='text-green-500'>Live</span>
                    </div>
                    <div className='flex flex-col '>
                        <span className='text-xl font-semibold text-end'>{total}/{purchased}/{redeemed}</span>
                        <span className='text-xs text-neutral-400 font-light'>Total/Purchased/Redeemed</span>
                    </div>

                </div>
            </div>
            <div className='h-px w-full bg-neutral-800'/>
            <div className='grid grid-cols-3 gap-y-12 mt-8 w-full'>
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
                        <Image src={chainIcon} alt={chain?.name || ""} width={42} height={42}/>
                        <span className='text-2xl font-bold'>{shortenString(chain?.name || "", 10)}</span>
                    </div>
                    <span className='text-sm text-neutral-400'>Investment</span>
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
            <div className='flex items-center justify-between w-full mt-10'>
                <div className='flex items-center gap-2 text-neutral-400'>
                    <span>Issuer:</span>
                    <Link href={`/address/${issuer}`}>
                        <span className='underline'>{shorten(issuer, 5)}</span>
                    </Link>
                </div>
                <span className='text-neutral-400'>{issuanceDate.toUTCString()}</span>
            </div>
        </div>
    </>
}

function ActionsContainer() {

    const Tabs = {
        Purchase: "Purchase",
        Redeem: "Redeem",
        More: {
            Manage: "Manage",
            ReferralRewards: "Referral Rewards"
        }
    }

    const [selected, setSelected] = useState(Tabs.Purchase)

    function Tab({title, className}: { title: string, className?: string }) {
        return <>
            <span
                className={`cursor-pointer text-neutral-400 whitespace-nowrap first-letter:uppercase hover:text-white ${className} ${selected === title && "text-white"}`}
                onClick={() => setSelected(title)}>{title}</span></>
    }

    function TabSelector({title}: { title: string }) {
        switch (title) {
            case Tabs.Purchase:
                return <PurchaseTab/>
            case Tabs.Redeem:
                return <RedeemTab/>
            case Tabs.More.Manage:
                return <ManageTab/>
            case Tabs.More.ReferralRewards:
                return <ReferralRewardsTab/>
            default:
                return <></>
        }
    }

    return <>
        <div className='col-span-4 flex flex-col bg-neutral-950 rounded-3xl p-8 py-4 border border-neutral-900 w-full h-full'>
            <div className='flex gap-4 items-center'>
                <Tab title={Tabs.Purchase}/>
                <Tab title={Tabs.Redeem}/>
                <div className='group relative'>
                    <div className='group flex gap-1 items-center cursor-pointer'>
                        <span className='text-neutral-400 group-hover:text-white'>More</span>
                        <ArrowBasicSVG sPercentage={-25} classname='stroke-neutral-400 group-hover:stroke-white'/>
                    </div>
                    <div
                        className='group-hover:flex absolute top-full right-0 hidden flex-col bg-neutral-900 p-2 gap-2 rounded-lg'>
                        {Object.values(Tabs.More).map(title => <Tab title={title} key={title}
                                                                    className="hover:bg-neutral-800 px-2 rounded-md"/>)}
                    </div>
                </div>
            </div>
            <div className='flex w-full h-full'>
                <TabSelector title={selected}/>
            </div>
        </div>
    </>
}


function PurchaseTab() {
    return <>
        <div className='flex flex-col gap-4 justify-end w-full'>
            <div className='flex flex-col gap-2'>
                <input type="number"
                       className='bg-transparent border border-neutral-800 rounded-md py-1.5 px-4 placeholder:text-neutral-600'
                       placeholder='Type the amount of bonds '/>
                <p className='text-xs text-neutral-600'>You confirm that you have read and understood the <Link href={URLS.TermsOfService} target="_blank"><u>Terms and Conditions.</u></Link></p>
            </div>
            <button className='bg-white w-full text-black rounded-full py-1.5 font-medium'>Purchase</button>
        </div>
    </>
}

function RedeemTab() {
    return <><span>RedeemTab Ping</span></>
}

function ManageTab() {
    return <><span>ManageTab Ping</span></>
}

function ReferralRewardsTab() {
    return <><span>ReferralRewardsTab Ping</span></>
}
