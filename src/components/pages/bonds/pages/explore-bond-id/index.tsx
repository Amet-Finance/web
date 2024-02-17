import ArrowCurveSVG from "../../../../../../public/svg/utils/arrow-curve";
import RefreshSVG from "../../../../../../public/svg/utils/refresh";
import Image from "next/image";
import {BlockTimes, TxTypes} from "@/modules/web3/constants";
import {formatTime} from "@/modules/utils/dates";
import {getChain, getChainIcon} from "@/modules/utils/wallet-connect";
import {getExplorer, shorten} from "@/modules/web3/util";
import {shortenString} from "@/modules/utils/string";
import {format, formatLargeNumber} from "@/modules/utils/numbers";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import ArrowBasicSVG from "../../../../../../public/svg/utils/arrow-basic";
import {URLS} from "@/modules/utils/urls";
import {
    ContractExtendedFormat,
    ContractExtendedFormatV2,
    ContractExtendedInfoFormat,
    DescriptionEditParams
} from "@/modules/cloud-api/contract-type";
import makeBlockie from "ethereum-blockies-base64";
import {tColor} from "@/components/pages/bonds/utils/colors";
import WarningSVG from "../../../../../../public/svg/warning";
import {ExploreIdQueryParams, LogFormat} from "@/components/pages/bonds/pages/explore-bond-id/type";
import {fetchContractExtended, getPastLogs} from "@/components/pages/bonds/pages/explore-bond-id/utils";
import {Chart, registerables} from "chart.js";
import EditSVG from "../../../../../../public/svg/utils/edit";
import {useAccount, useNetwork, useSendTransaction, useSignMessage, useSwitchNetwork} from "wagmi";
import ContractAPI from "@/modules/cloud-api/contract-api";
import SaveSVG from "../../../../../../public/svg/utils/save";
import BigNumber from "bignumber.js";
import {getAllowance} from "@/modules/web3/tokens";
import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import {toast} from "react-toastify";

const UPDATE_INTERVAL = 25000;

export default function ExploreBondId({bondDetailedTmp, queryParams}: {
    bondDetailedTmp: ContractExtendedFormat,
    queryParams: ExploreIdQueryParams
}) {

    const [bondDetailed, setBondDetailed] = useState<ContractExtendedFormatV2>({...(bondDetailedTmp || {})})
    const [updateIndex, setUpdateIndex] = useState(0);
    const [refreshDate, setRefreshDate] = useState<Date>();
    const [isLoading, setLoading] = useState(!Boolean(bondDetailedTmp))

    useEffect(() => {
        const updater = () => fetchContractExtended(queryParams)
            .then(contract => {
                setRefreshDate(new Date())
                if (contract && JSON.stringify(contract) !== JSON.stringify(bondDetailed)) setBondDetailed({...contract});
            })
            .finally(() => setLoading(false))

        updater()
        const interval = setInterval(updater, UPDATE_INTERVAL)
        return () => clearInterval(interval);
    }, [bondDetailed, updateIndex, queryParams])

    if (isLoading) return <LoadingScreen/>

    const {contractInfo, contractDescription, contractStats} = bondDetailed;
    const refreshHandler = [refreshDate, setUpdateIndex]

    return <>
        <div className='flex flex-col gap-4 w-full xl1:px-52 lg:px-24 md:px-12 sm:px-8 py-24'>
            <HeadlineContainer refreshHandler={refreshHandler}/>
            <StatisticsContainer bondDetailed={bondDetailed}/>
            <MainContainer bondDetailed={bondDetailed}/>
            <GraphsContainer bondDetailed={bondDetailed}/>
            <DescriptionContainer bondDetailed={bondDetailed} setBondDetailed={setBondDetailed}/>
            <RecentActivityContainer contractInfo={contractInfo}/>
        </div>
    </>
}

function LoadingScreen() {
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setPercentage(percentage + Math.round(Math.random() * 10)), UPDATE_INTERVAL / 20);
        return () => clearInterval(interval)
    }, [percentage]);

    return <>
        <div className='flex gap-2 items-end w-full h-screen xl1:px-52 lg:px-24 md:px-12 sm:px-8'>
            <div className='-translate-y-28'>
                <div className='flex items-start'>
                    <span className='text-9xl font-bold'>{percentage}</span>
                    <span className='text-2xl font-bold'>%</span>
                </div>
                <span className='text-sm text-neutral-500'>Loading the contract information...</span>
            </div>
        </div>
    </>
}


function HeadlineContainer({refreshHandler}: { refreshHandler: any[] }) {
    const [refreshDate, setUpdateIndex] = refreshHandler
    const [secondsPassed, setSecondsPassed] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsPassed(Math.round((Date.now() - refreshDate?.getTime()) / 1000))
        }, 500)
        return () => clearInterval(interval)
    }, [refreshDate]);

    function refresh() {
        setUpdateIndex(Math.random() * 10)
    }

    return <>
        <div className='flex justify-between'>
            <span/>
            <div className='flex items-center gap-2 px-2'>
                <span className='text-neutral-600 text-xs'>Refreshed {secondsPassed}s ago</span>
                <RefreshSVG isSmall={true} onClick={refresh}/>
            </div>
        </div>
    </>
}

function StatisticsContainer({bondDetailed}: { bondDetailed: ContractExtendedFormat }) {

    const {contractInfo, contractStats} = bondDetailed
    const {score, securedPercentage, issuerScore, uniqueHolders} = contractStats;
    const holdersIndex = uniqueHolders ? uniqueHolders / contractInfo.total : 0;

    function Container({title, value, valueColor}: { title: string, value: string, valueColor: string }) {
        return <>
            <div
                className='flex flex-col items-end gap-4 bg-neutral-950 rounded-3xl p-6 pt-2 pr-2 border border-neutral-900 lg:col-span-1 sm:col-span-2'>
                <div className='w-min bg-neutral-800 p-4 rounded-full'><ArrowCurveSVG color='#fff'/></div>
                <div className='flex flex-col w-full gap-1'>
                    <span className={`text-5xl font-bold ${valueColor}`}>{value}</span>
                    <span className='text-xs'>{title}</span>
                </div>
            </div>
        </>
    }

    return <>
        <div className='grid grid-cols-4 gap-4 w-full'>
            <Container title='Bond Score'
                       value={`${format(score, 2)}`}
                       valueColor={tColor(score * 10)}/>
            <Container title='Secured Percentage'
                       value={`${format(securedPercentage, 2)}%`}
                       valueColor={tColor(securedPercentage)}/>
            <Container title='Issuer Score' value={`${issuerScore}`}
                       valueColor={tColor(issuerScore * 10)}/>
            <Container title='Unique Holders' value={`${uniqueHolders}`}
                       valueColor={tColor(holdersIndex * 100)}/>
        </div>
    </>
}

function MainContainer({bondDetailed}: { bondDetailed: ContractExtendedFormat }) {
    return <>
        <div className='grid grid-cols-12 w-full gap-4 h-full'>
            <MainDetailsContainer bondDetailed={bondDetailed}/>
            <ActionsContainer contractInfo={bondDetailed.contractInfo}/>
        </div>
    </>
}

function MainDetailsContainer({bondDetailed}: { bondDetailed: ContractExtendedFormat }) {
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
    const issuanceDateClean = `${issuanceDateInFormat.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})} ${issuanceDateInFormat.toLocaleDateString()}`.replace(/\//g, '.');

    return <>
        <div
            className='flex flex-col gap-4 lg:col-span-8 sm:col-span-12 bg-neutral-950 rounded-3xl p-8 pt-4 border border-neutral-900 w-full'>
            <div className='flex flex-col gap-2 w-full'>
                <div className='flex justify-between items-center w-full'>
                    <div className='flex gap-2'>
                        <Image src={interestIcon} alt={interest.name} width={64} height={64}
                               className='object-contain rounded-full'/>
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
                {!Boolean(interest.isVerified) && <NotVerifiedAsset title={"Interest"}/>}
                {!Boolean(investment.isVerified) && <NotVerifiedAsset title={"Investment"}/>}
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
            <div className='flex items-center justify-between w-full mt-10'>
                <div className='flex items-center gap-2 text-neutral-400'>
                    <span>Issuer:</span>
                    <Link href={`/address/${issuer}`}>
                        <span className='underline'>{shorten(issuer, 5)}</span>
                    </Link>
                </div>
                <span className='text-neutral-400'>{issuanceDateClean}</span>
            </div>
        </div>
    </>
}

function NotVerifiedAsset({title}: { title: string }) {
    return <>
        <div className='flex items-center gap-2 px-4 py-1 border w-min whitespace-nowrap rounded-md border-w1 cursor-pointer'>
            <WarningSVG/>
            <span className='text-red-500 text-sm font-light'><b>Caution</b>: {title} token has not been verified. Please proceed carefully!</span>
        </div>
    </>
}

function ActionsContainer({contractInfo}: { contractInfo: ContractExtendedInfoFormat }) {

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
                return <PurchaseTab contractInfo={contractInfo}/>
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
        <div
            className='lg:col-span-4 sm:col-span-12 flex flex-col gap-12 bg-neutral-950 rounded-3xl p-8 py-4 border border-neutral-900 w-full h-full'>
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


function PurchaseTab({contractInfo}: { contractInfo: ContractExtendedInfoFormat }) {

    const {_id, investment, total, purchased} = contractInfo;
    const [contractAddress, chainId] = _id.toLowerCase().split("_");
    const {address} = useAccount();
    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork({chainId: Number(chainId)});
    const chain = getChain(chainId)

    const TitleTypes = {
        Purchase: "Purchase",
        Approve: "Approve",
        NotEnough: "Not Enough Bonds to Purchas"
    }

    const [isLoading, setLoading] = useState(false)
    const [allowance, setAllowance] = useState("0")
    const [amount, setAmount] = useState(0);

    const currentAllowance = BigNumber(allowance.toString())
    const required = BigNumber(amount).times(BigNumber(investment.amount))
    const needed = currentAllowance.minus(required);

    const isApprove = needed.isLessThan(BigNumber(0))

    let blockClick = false

    let title = isApprove ? TitleTypes.Approve : TitleTypes.Purchase
    if (purchased + amount > total) {
        title = TitleTypes.NotEnough
        blockClick = true
    }


    const transactionType = isApprove ? TxTypes.ApproveToken : TxTypes.PurchaseBonds;
    const config = isApprove ?
        {contractAddress: investment.contractAddress, spender: contractAddress, value: needed.abs().toString()} :
        {contractAddress: contractAddress, count: amount}

    // todo add referrer when purchasing from query param
    const txConfig = getContractInfoByType(chain, transactionType, config)
    const {sendTransactionAsync} = useSendTransaction(txConfig)

    useEffect(() => {
        if (chain && address) {
            setLoading(true)
            getAllowance(chain, investment.contractAddress, address, contractAddress)
                .then(response => setAllowance(response.toString()))
                .finally(() => setLoading(false))
        }
    }, [amount, chain, address, contractAddress, investment.contractAddress]);

    function onChange(event: any) {
        const {value} = event.target;
        setAmount(Number(value))
    }

    async function submit() {
        if (blockClick) return;
        if (!chain) return toast.error("Please select correct chain")
        if (network.chain?.id !== chain.id) await switchNetworkAsync?.(chain.id);

        const response = await sendTransactionAsync();
        const result = await trackTransaction(chain, response.hash);
        console.log(result)
    }

    return <>
        <div className='flex flex-col gap-4 justify-end w-full'>
            <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between border border-neutral-800 rounded-md py-1.5 px-4'>
                    <input type="number"
                           id='amount'
                           className='bg-transparent placeholder:text-neutral-600 w-full'
                           onChange={onChange}
                           placeholder='Type the amount of bonds '/>
                </div>
                <p className='text-xs text-neutral-600'>You confirm that you have read and understood the <Link
                    href={URLS.TermsOfService} target="_blank"><u>Terms and Conditions.</u></Link></p>
            </div>
            <button className='bg-white w-full text-black rounded-full py-1.5 font-medium'
                    onClick={submit}>{title}</button>
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


function GraphsContainer({bondDetailed}: { bondDetailed: ContractExtendedFormat }) {
    const Container = ({children}: any) => (
        <div
            className='md:col-span-1 sm:col-span-2 flex flex-col gap-4 w-full p-4 border border-w1 rounded-3xl'>{children}</div>)

    return <>
        <div className='grid grid-cols-2 gap-4'>
            <Container>
                <div className='flex justify-between w-full'>
                    <span className='font-medium text-xl'>Purchase Statistics</span>
                    <div className='flex flex-col items-end'>
                        <span className='text-2xl font-bold'>$23.4k</span>
                        <p className='text-neutral-500 text-sm'>Today <span className='text-green-500'>(+2.4%)</span>
                        </p>
                    </div>
                </div>
                <BarChart bgColor="#fff"/>
            </Container>
            <Container>
                <div className='flex justify-between w-full'>
                    <span className='font-medium text-xl'>Redeem Statistics</span>
                    <div className='flex flex-col items-end'>
                        <span className='text-2xl font-bold'>$42.4k</span>
                        <p className='text-neutral-500 text-sm'>Today <span className='text-green-500'>(+1.4%)</span>
                        </p>
                    </div>
                </div>
                <BarChart bgColor='rgb(34 197 94)'/>
            </Container>
        </div>
    </>
}


function BarChart({bgColor}: { bgColor: string }) {
    const chartRef = useRef<any>(null);

    useEffect(() => {
        if (!chartRef.current) return;
        const options = {
            responsive: true,
            plugins: {legend: {display: false}},
            scales: {
                x: {
                    grid: {
                        display: false, // Hide grid lines for x-axis
                        offset: true
                    },
                    ticks: {
                        display: false, // Hide ticks for x-axis
                    },
                },
                y: {
                    grid: {
                        display: false,
                        offset: true
                    },
                    ticks: {
                        display: false, // Hide ticks for x-axis
                    },
                }

            },
        };

        const data = [10, 30, 32, 35, 42, 50, 48, 52, 55, 34, 35, 35, 60];
        Chart.register(...registerables)
        const chart = new Chart(chartRef.current, {
            type: "bar",
            data: {
                labels: data,
                datasets: [
                    {
                        label: 'Total Bonds Issued',
                        data,
                        backgroundColor: bgColor,
                        borderColor: '#858585',
                        borderWidth: 0,
                        borderRadius: 0,
                        barThickness: 5
                    },
                ],
            },
            options: options
        });

        return () => chart.destroy()
    }, [bgColor])

    return <>
        <div className='w-full'>
            <canvas ref={chartRef} className='max-h-60'/>
            <div className='flex justify-between'>
                <span className='text-sm text-neutral-600'>May 30</span>
                <span className='text-sm text-neutral-600'>May 30</span>
                <span className='text-sm text-neutral-600'>May 30</span>
            </div>
        </div>
    </>
}

function DescriptionContainer({bondDetailed, setBondDetailed}: {
    bondDetailed: ContractExtendedFormat,
    setBondDetailed: (contractExtendedFormat: any) => any
}) {

    const {contractInfo, contractDescription} = bondDetailed;

    const message = `To ensure the security of your bond description update, please sign this request with your wallet. This signature is needed to verify the authenticity of the modification. Make sure to review the changes before signing. Your signature helps maintain the integrity of the information on the Amet Finance platform\n\nContract: ${contractInfo._id.toLowerCase()} \nNonce: ${Date.now()}`;

    const {address} = useAccount();
    const [isHidden, setHidden] = useState(true);
    const [isEditMode, setEditMode] = useState(false);
    const [descriptionDetails, setDescriptionDetails] = useState({
        title: "",
        description: ""
    })
    const isIssuer = contractInfo.issuer.toLowerCase() === address?.toLocaleLowerCase()

    const {signMessageAsync} = useSignMessage({message});

    useEffect(() => {
        if (contractDescription.details || isIssuer) {
            if (!contractDescription.details && isIssuer) setEditMode(true)
            setHidden(false);
        }
    }, [address, contractDescription?.details, isIssuer]);

    if (isHidden) return null;

    function edit(event: any) {
        const {id, value} = event.target;
        setDescriptionDetails({
            ...descriptionDetails,
            [id]: value
        })
    }

    async function updateDescription() {
        try {
            if (!address) {
                return;
            }

            const signature = await signMessageAsync?.()

            const params: DescriptionEditParams = {
                _id: contractInfo._id,
                address: address,
                message: message,
                title: descriptionDetails.title,
                description: descriptionDetails.description,
                signature,
            }
            const descriptionUpdated = await ContractAPI.updateContractDescription(params);
            setBondDetailed({...bondDetailed, contractDescription: descriptionUpdated})
            setEditMode(false);
        } catch (error: any) {
            console.log(error)
        }

    }

    return <>
        <div className='flex flex-col gap-4 w-full p-8 border border-w1 rounded-3xl'>
            <div className='flex justify-between items-center'>
                {
                    isEditMode ?
                        <input type="text"
                               className='bg-transparent border-b-2 border-w1 placeholder:text-neutral-400'
                               id='title'
                               onChange={edit}
                               placeholder='Title'/> :
                        <h1 className='text-2xl font-bold'>{contractDescription.details?.title}</h1>
                }
                {
                    isEditMode ?
                        <SaveSVG onClick={updateDescription}/> :
                        <EditSVG onClick={() => setEditMode(true)}/>
                }
            </div>
            {
                isEditMode ?
                    <textarea
                        rows={1}
                        onChange={edit}
                        id='description'
                        className='bg-transparent border-b-2 border-w1 placeholder:text-neutral-400'
                        placeholder='Desribe you bonds, the purpose and etc..'/> :
                    <p className='text-sm text-neutral-400'>{contractDescription.details?.description}</p>
            }
        </div>
    </>
}


function RecentActivityContainer({contractInfo}: { contractInfo: ContractExtendedInfoFormat }) {

    const ActivityTypes = {
        All: "All",
        My: "My Activity"
    }

    const [contractAddress, chainId] = contractInfo._id.split("_");

    const [activityType, setActivityType] = useState(ActivityTypes.All)
    const [logs, setLogs] = useState<LogFormat[]>([]);


    useEffect(() => {
        getPastLogs(contractInfo, setLogs)
    }, [contractInfo]);


    return <>
        <div className='flex flex-col gap-12 border border-w1 w-full rounded-3xl p-8'>
            <div className='flex justify-between items-center'>
                <span className='text-xl font-medium'>Recent Activity</span>
                <div className='flex items-center border border-white rounded-3xl cursor-pointer'>
                    {
                        Object.values(ActivityTypes).map(title => (<>
                            <span className={`p-2 px-4 rounded-3xl ${title === activityType && "bg-white text-black"}`}
                                  onClick={() => setActivityType(title)}>{title}</span>
                        </>))
                    }
                </div>
            </div>
            <div className='grid grid-cols-6 gap-4 min-h-[10rem] max-h-72 overflow-y-auto'>
                <div className='col-span-1 text-sm'>
                    <span className='text-neutral-400'>From</span>
                </div>
                <div className='col-span-1 text-sm'>
                    <span className='text-neutral-400'>To</span>
                </div>
                <div className='col-span-1 text-sm'>
                    <span className='text-neutral-400'>Type</span>
                </div>
                <div className='col-span-1 text-sm'>
                    <span className='text-neutral-400'>Value</span>
                </div>
                <div className='col-span-1 text-sm'>
                    <span className='text-neutral-400'>Block</span>
                </div>
                <div className='col-span-1 text-sm'>
                    <span className='text-neutral-400 '>Hash</span>
                </div>
                {logs.map(log => <LogContainer chainId={Number(chainId)} log={log} key={log.hash}/>)}
            </div>
        </div>
    </>
}


function LogContainer({chainId, log}: { chainId: number, log: LogFormat }) {

    const hashUrl = getExplorer(chainId, "hash", log.hash)
    let typeClass;

    if (log.type === "Redeem") {
        typeClass = "bg-green-950 text-green-500"
    } else if (log.type === "Purchase") {
        typeClass = "bg-red-950 text-red-500"
    } else {
        typeClass = "bg-neutral-800 text-neutral-200"
    }

    return <>
        <div className='h-px col-span-6 bg-neutral-600 w-full'/>
        <div className='col-span-1 text-sm '>
            <span className='text-neutral-200'>{shorten(log.from, 5)}</span>
        </div>
        <div className='col-span-1 text-sm'>
            <span className='text-neutral-200'>{shorten(log.to, 5)}</span>
        </div>
        <div className='col-span-1 text-sm w-full'>
            <span className={`${typeClass} px-3 py-1.5 rounded-full`}>{log.type}</span>
        </div>
        <div className='col-span-1 text-sm'>
            <span className='text-neutral-200'>{log.value}</span>
        </div>
        <div className='col-span-1 text-sm'>
            <span className='text-neutral-200'>{log.block}</span>
        </div>
        <div className='col-span-1 text-sm'>
            <Link href={hashUrl} target='_blank'>
                <span className='text-neutral-200 underline'>{shorten(log.hash)}</span>
            </Link>
        </div>
    </>
}
