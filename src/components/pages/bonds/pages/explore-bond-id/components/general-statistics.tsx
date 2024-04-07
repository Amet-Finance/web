import {ContractCoreDetails, ContractExtendedFormat, FinancialAttributeExtended} from "@/modules/api/contract-type";
import {useEffect, useRef, useState} from "react";
import {ActionLogFormat} from "@/components/pages/bonds/pages/explore-bond-id/type";
import {useAccount} from "wagmi";
import {getExplorer, shorten} from "@/modules/web3/util";
import Link from "next/link";
import {Chart, ChartOptions, registerables} from "chart.js";
import {formatLargeNumber} from "@/modules/utils/numbers";
import {LogTypes} from "@/modules/web3/constants";

const StatisticsTypes = {
    Purchase: "Purchase",
    Redeem: "Redeem"
}
export default function GeneralStatisticsContainer({bondDetailed}: Readonly<{ bondDetailed: ContractExtendedFormat }>) {
    const {contractInfo, actionLogs} = bondDetailed;

    return <>
        <GraphsContainer contractInfo={contractInfo} logs={actionLogs}/>
        <RecentActivityContainer contractInfo={contractInfo} logs={actionLogs}/>
    </>
}

function GraphsContainer({contractInfo, logs}: Readonly<{
    contractInfo: ContractCoreDetails,
    logs: ActionLogFormat[],
}>) {

    const {purchase, payout} = contractInfo;
    let totalPurchased = 0
    let totalRedeemed = 0

    const purchased: ActionLogFormat[] = []
    const redeemed: ActionLogFormat[] = [];

    logs.forEach(log => {
        if (log.type === LogTypes.Purchase) {
            totalPurchased += (log.count * purchase.amountClean);
            purchased.unshift(log);
        } else if (log.type === LogTypes.Redeem) {
            totalRedeemed += (log.count * payout.amountClean);
            redeemed.unshift(log);
        }
    })


    return (
        <div className='grid grid-cols-2 gap-4'>
            <Container type={StatisticsTypes.Purchase} total={totalPurchased} data={purchased} asset={purchase}/>
            <Container type={StatisticsTypes.Redeem} total={totalRedeemed} data={redeemed} asset={payout}/>
        </div>
    )
}

function Container({type, total, data, asset}: Readonly<{
    type: string,
    total: number,
    data: ActionLogFormat[],
    asset: FinancialAttributeExtended
}>) {
    const isPurchase = type === StatisticsTypes.Purchase
    const bgColor = isPurchase ? "#fff" : "rgb(34 197 94)"

    const centerIndex = Math.round(data.length / 2)
    const blocks = [data[0]?.block, data[centerIndex]?.block, data[data.length - 1]?.block]
    const totalInUsd = (asset.priceUsd ?? 0) * total
    const title = Boolean(totalInUsd) ? `$${formatLargeNumber(totalInUsd)}` : `${formatLargeNumber(total)} ${asset.symbol}`

    //todo fix this today with fixed 0%
    return (
        <div
            className='md:col-span-1 col-span-2 flex flex-col gap-4 w-full p-8 border border-neutral-900 rounded-3xl'>
            <div className='flex justify-between w-full'>
                <span className='font-medium text-xl'>{type} Statistics</span>
                <div className='flex flex-col items-end gap-1'>
                    <span className='text-2xl font-bold'>{title}</span>
                    <p className='text-neutral-500 text-sm'>
                        Today
                        {" "}
                        <span className='text-green-500'>(+0%)</span>
                    </p>
                </div>
            </div>
            <BarChart bgColor={bgColor} data={data} asset={asset}/>
            <div className='flex justify-between'>
                {blocks.map((block, index) => (
                    <span className='text-sm text-neutral-600' key={index}>{block}</span>))}
            </div>
        </div>
    )
}


function BarChart({bgColor, data, asset}: Readonly<{
    bgColor: string,
    data: ActionLogFormat[],
    asset: FinancialAttributeExtended
}>) {
    const chartRef = useRef<any>(null);

    useEffect(() => {
        if (!chartRef.current) return;


        const options: ChartOptions = {
            responsive: true,
            plugins: {legend: {display: false}},
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        display: false, // Hide grid lines for x-axis
                        offset: true
                    },
                    ticks: {
                        display: false, // Hide ticks for x-axis
                    },
                },
                y: {
                    beginAtZero: true,
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

        const priceExists = Boolean(asset.priceUsd)
        const label = priceExists ? "Value(USD)" : `Value(${shorten(asset.symbol, 5)})`

        Chart.register(...registerables)
        const chart = new Chart(chartRef.current, {
            type: "bar",
            data: {
                labels: data.map(item => `Block: ${item.block}`),
                datasets: [
                    {
                        label,
                        data: data.map(item => `${item.count * asset.amountClean * (asset.priceUsd || 1)}`),
                        backgroundColor: bgColor,
                        borderColor: '#858585',
                        barThickness: 'flex'
                    },
                ],
            },
            options: options,
        });

        return () => chart.destroy()
    }, [bgColor, data, asset.priceUsd, asset.amountClean, asset.symbol])

    return (
        <div className='w-full'>
            <canvas ref={chartRef} className='max-h-60'/>
        </div>
    )
}

function RecentActivityContainer({contractInfo, logs}: Readonly<{
    contractInfo: ContractCoreDetails,
    logs: ActionLogFormat[]
}>) {

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

    return (
        <div className='flex flex-col gap-8 border border-neutral-900 w-full rounded-3xl p-8'>
            <div className='flex md:flex-row flex-col justify-between md:items-center items-start gap-2'>
                <span className='text-xl font-medium'>Recent Activity</span>
                <div className='flex items-center border border-neutral-900 rounded-3xl cursor-pointer'>
                    {
                        Object.values(ActivityTypes).map((title) => (
                            <button
                                className={`p-1 px-4 rounded-3xl md:text-base text-sm ${title === activityType && "bg-neutral-900"}`}
                                key={title}
                                onClick={() => setActivityType(title)}>{title}</button>
                        ))
                    }
                </div>
            </div>
            <div className='grid grid-cols-6 gap-4 min-h-[10rem] max-h-72 overflow-y-auto whitespace-nowrap'>
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
                {logs.filter(filterMyLogs)
                    .map(log =>
                        <LogContainer
                            contractInfo={contractInfo}
                            log={log}
                            key={log.id}/>)}
            </div>
        </div>
    )
}


function LogContainer({contractInfo, log}: Readonly<{ contractInfo: ContractCoreDetails, log: ActionLogFormat }>) {

    const {chainId, purchase, payout} = contractInfo;

    const hashUrl = getExplorer(chainId, "hash", log.id)
    let typeClass, value;

    if (log.type === LogTypes.Redeem) {
        typeClass = "bg-green-950 text-green-500"
        value = `${payout.amountClean * log.count} ${payout.symbol}`
    } else if (log.type === LogTypes.Purchase) {
        typeClass = "bg-red-950 text-red-500"
        value = `${purchase.amountClean * log.count} ${purchase.symbol}`
    } else {
        typeClass = "bg-neutral-800 text-neutral-200"
    }


    return <>
        <div className='h-px col-span-6 bg-neutral-600 w-full'/>
        <div className='col-span-1 text-sm'>
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
                <span className='text-neutral-200 underline'>{shorten(log.id)}</span>
            </Link>
        </div>
    </>
}
