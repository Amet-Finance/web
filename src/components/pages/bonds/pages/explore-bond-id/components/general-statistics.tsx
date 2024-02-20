import {ContractExtendedInfoFormat} from "@/modules/cloud-api/contract-type";
import {useEffect, useRef, useState} from "react";
import {ActionLogFormat} from "@/components/pages/bonds/pages/explore-bond-id/type";
import {getPastLogs} from "@/components/pages/bonds/pages/explore-bond-id/utils";
import {nop} from "@/modules/utils/function";
import {useAccount} from "wagmi";
import RefreshSVG from "../../../../../../../public/svg/utils/refresh";
import {getExplorer, shorten} from "@/modules/web3/util";
import {LogTypes} from "@/modules/web3/zcb/v2/constants";
import Link from "next/link";
import {Chart, registerables} from "chart.js";
import {formatLargeNumber} from "@/modules/utils/numbers";
import Loading from "@/components/utils/loading";

export default function GeneralStatisticsContainer({contractInfo}: { contractInfo: ContractExtendedInfoFormat }) {
    const [logs, setLogs] = useState<ActionLogFormat[]>([])
    const [isLoadingLogs, setLoadingLogs] = useState(false)

    useEffect(() => {
        getPastLogs(contractInfo, setLogs, setLoadingLogs).catch(nop)
    }, [contractInfo]);


    return <>
        <GraphsContainer contractInfo={contractInfo} logs={logs} isLoadingLogs={isLoadingLogs}/>
        <RecentActivityContainer contractInfo={contractInfo} logs={logs} isLoadingLogs={isLoadingLogs}/>
    </>
}

function GraphsContainer({contractInfo, logs, isLoadingLogs}: {
    contractInfo: ContractExtendedInfoFormat,
    logs: ActionLogFormat[],
    isLoadingLogs: boolean
}) {

    const {investment, interest} = contractInfo;
    let totalPurchased = 0
    let totalRedeemed = 0

    const purchased: ActionLogFormat[] = []
    const redeemed: ActionLogFormat[] = [];

    logs.forEach(log => {
        if (log.type === LogTypes.Purchase) {
            totalPurchased += (log.count * investment.amountClean);
            purchased.push(log);
        } else if (log.type === LogTypes.Redeem) {
            totalRedeemed += (log.count * interest.amountClean);
            redeemed.push(log);
        }
    })

    const StatisticsTypes = {
        Purchase: "Purchase",
        Redeem: "Redeem"
    }

    function Container({type, total, data}: { type: string, total: number, data: ActionLogFormat[] }) {
        const isPurchase = type === StatisticsTypes.Purchase
        const bgColor = isPurchase ? "#fff" : "rgb(34 197 94)"
        const asset = isPurchase ? investment : interest

        if (isLoadingLogs) {
            return <>
                <div
                    className='md:col-span-1 sm:col-span-2 flex justify-center items-center w-full p-4 border border-neutral-900 rounded-3xl'>
                    <Loading/>
                </div>
            </>
        }


        const centerIndex = Math.round(data.length / 2)
        const blocks = [data[0]?.block, data[centerIndex]?.block, data[data.length - 1]?.block]

        return <>
            <div
                className='md:col-span-1 sm:col-span-2 flex flex-col gap-4 w-full p-8 border border-neutral-900 rounded-3xl'>

                <div className='flex justify-between w-full'>
                    <span className='font-medium text-xl'>{type} Statistics</span>
                    <div className='flex flex-col items-end'>
                        <span
                            className='text-2xl font-bold'>{formatLargeNumber(total, true)} {asset.symbol}</span>
                        <p className='text-neutral-500 text-sm'>Today <span
                            className='text-green-500'>(+2.4%)</span>
                        </p>
                    </div>
                </div>
                <BarChart bgColor={bgColor} data={data}/>
                <div className='flex justify-between'>
                    {blocks.map(block => (<><span className='text-sm text-neutral-600'>{block}</span></>))}
                </div>
            </div>
        </>
    }

    return <>
        <div className='grid grid-cols-2 gap-4'>
            <Container type={StatisticsTypes.Purchase} total={totalPurchased} data={purchased}/>
            <Container type={StatisticsTypes.Redeem} total={totalRedeemed} data={redeemed}/>
        </div>
    </>
}


function BarChart({bgColor, data}: { bgColor: string, data: ActionLogFormat[] }) {
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


        Chart.register(...registerables)
        const chart = new Chart(chartRef.current, {
            type: "bar",
            data: {
                labels: data.map(item => item.block),
                datasets: [
                    {
                        label: 'Value:',
                        data: data.map(item => item.count),
                        backgroundColor: bgColor,
                        borderColor: '#858585',
                        borderWidth: 0,
                        borderRadius: 0,
                        barThickness: 3,
                    },
                ],
            },
            options: options
        });

        return () => chart.destroy()
    }, [bgColor, data])

    return <>
        <div className='w-full'>
            <canvas ref={chartRef} className='max-h-60'/>
        </div>
    </>
}

function RecentActivityContainer({contractInfo, logs, isLoadingLogs}: {
    contractInfo: ContractExtendedInfoFormat,
    logs: ActionLogFormat[],
    isLoadingLogs: boolean
}) {

    const ActivityTypes = {
        All: "All",
        My: "My Activity"
    }

    const {address} = useAccount();
    const [activityType, setActivityType] = useState(ActivityTypes.All)


    function filterMyLogs(log: ActionLogFormat) {
        if (activityType === ActivityTypes.My) {
            return log.from.toLowerCase() === address?.toLowerCase() || log.to.toLowerCase() === address?.toLowerCase()
        }
        return true;
    }

    return <>
        <div className='flex flex-col gap-8 border border-neutral-900 w-full rounded-3xl p-8'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-4'>
                    <span className='text-xl font-medium'>Recent Activity</span>
                    <RefreshSVG isLoading={isLoadingLogs} isSmall/>
                </div>
                <div className='flex items-center border border-neutral-900 rounded-3xl cursor-pointer'>
                    {
                        Object.values(ActivityTypes).map(title => (<>
                <span className={`p-2 px-4 rounded-3xl ${title === activityType && "bg-neutral-900"}`}
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
                {
                    logs.filter(filterMyLogs)
                        .map(log =>
                            <LogContainer
                                contractInfo={contractInfo}
                                log={log}
                                key={log.hash}/>)
                }
            </div>
        </div>
    </>
}


function LogContainer({contractInfo, log}: { contractInfo: ContractExtendedInfoFormat, log: ActionLogFormat }) {

    const {_id, interest, investment} = contractInfo;
    const [_, chainId] = _id;

    const hashUrl = getExplorer(Number(chainId), "hash", log.hash)
    let typeClass, value;

    if (log.type === LogTypes.Redeem) {
        typeClass = "bg-green-950 text-green-500"
        value = `${interest.amountClean * log.count} ${interest.symbol}`
    } else if (log.type === LogTypes.Purchase) {
        typeClass = "bg-red-950 text-red-500"
        value = `${investment.amountClean * log.count} ${investment.symbol}`
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
            <span className='text-neutral-200'>{value}</span>
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
