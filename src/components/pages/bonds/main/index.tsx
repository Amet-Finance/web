import {BasicButton} from "@/components/utils/buttons";
import BondCard from "@/components/pages/bonds/utils/bond-card";
import Link from "next/link";
import {URLS} from "@/modules/utils/urls";
import {DiscordIcon} from "../../../../../public/svg/social/discord";
import {useEffect, useRef, useState} from "react";
import {Chart, registerables} from "chart.js";
import {formatLargeNumber} from "@/modules/utils/numbers";
import ContractAPI from "@/modules/cloud-api/contract-api";
import {ContractBasicFormat, ContractQuery} from "@/modules/cloud-api/contract-type";
import Loading from "@/components/utils/loading";
import CloudAPI from "@/modules/cloud-api";
import {UPDATE_INTERVAL} from "@/components/pages/bonds/pages/explore-bond-id/constants";

export default function Bonds() {
    return <>
        <div className='flex flex-col w-full'>
            <div className='flex flex-col gap-32 xl1:px-52 lg:px-24 md:px-12 sm:px-8'>
                <div className='relative flex lg:flex-row sm:flex-col lg:items-end sm:items-center justify-between w-full gap-12 py-24 rounded-[4rem]'>
                    <div
                        className='flex flex-col md:items-start sm:items-center md:text-start sm:text-center w-full gap-12 '>
                        <h1 className='lg:text-7xl md:text-8xl sm:text-5xl font-bold max-2w-xl'>Unlock Financial
                            Possibilities <br/> with on-chain
                            Bonds</h1>
                        <div className='h-px w-1/4 bg-neutral-500'/>
                        <p className='text-neutral-400 text-sm max-w-2xl'>{`Amet Finance's on-chain bonds platform lets you issue, buy, sell, and redeem bonds seamlessly. Elevate your investment strategy and embrace the future of decentralized finance today.`}</p>
                        <div className='flex md:flex-row sm:flex-col gap-5 w-full'>
                            <Link href='/bonds/issue'>
                                <BasicButton hFull>
                                    <span className='font-medium px-4 py-0.5'>Issue Bonds</span>
                                </BasicButton>
                            </Link>
                            <Link href='/bonds/explore'>
                                <BasicButton isWhiteBorder hFull>
                                    <span className='font-medium px-4 py-2.5'>Explore Bonds</span>
                                </BasicButton>
                            </Link>
                        </div>
                    </div>
                    <Statistics/>
                </div>
                <BondCards/>
                <BondsExplanation/>
            </div>
            <SectionEnd/>
        </div>
    </>
}

function Statistics() {

    const [isLoading, setLoading] = useState(true)
    const [statistics, setStatistics] = useState({
        purchased: 0,
        redeemed: 0,
        volumeUSD: 0,
        issued: 0
    })

    useEffect(() => {
        setLoading(true);
        const updater = () => {
            CloudAPI.getStatistics()
                .then(response => {
                    if (response) setStatistics(response)
                }).finally(() => setLoading(false))
        }

        updater()

        const interval = setInterval(updater, UPDATE_INTERVAL);
        return () => clearInterval(interval);
    }, []);


    const totalVolume = `$${formatLargeNumber(statistics.volumeUSD, true).toString()}`

    return <>
        <div className='relative grid grid-cols-2 grid-rows-3 gap-4  h-min hollow-shadow w-full '>
            <StatisticsBox value={statistics.issued}
                           isLoading={isLoading}
                           title="Total Issued"
                           classAttributes="col-span-1 row-span-1"/>
            <StatisticsBox value={totalVolume}
                           isLoading={isLoading}
                           title="Total Volume"
                           classAttributes='col-span-1 row-span-2 pr-16'/>
            <StatisticsBox value={statistics.purchased}
                           isLoading={isLoading}
                           title="Total Purchased"
                           classAttributes='col-span-1 row-span-2'/>
            <StatisticsBox value={statistics.redeemed}
                           isLoading={isLoading}
                           title="Total Redeemed"
                           classAttributes='col-span-1 row-span-1 pr-16'/>
            <div className="absolute w-[626px] h-[489px] bg-neutral-800 bg-opacity-75 rounded-full blur-[500px] "/>
        </div>
    </>
}

function StatisticsBox({classAttributes, value, title, isLoading}: {
    value: string | number,
    title: string,
    classAttributes?: string
    isLoading: boolean
}) {
    return <>
        <div
            className={"flex flex-col justify-end p-8 w-full gap-2 h-full rounded-2xl border border-zinc-900 z-10 cursor-pointer hover:scale-105 hover:bg-white hover:text-black overflow-x-auto" + classAttributes}>
            {
                isLoading ?
                    <Loading/> :
                    <div className='flex flex-col gap-2'>
                        <span className='md:text-3xl sm:text-xl font-bold'>{value}</span>
                        <span className='text-neutral-500 font-medium md:text-sm sm:text-xs'>{title}</span>
                    </div>
            }
        </div>
    </>
}


function BondCards() {

    const [isLoading, setLoading] = useState(false);
    const [params, setParams] = useState<ContractQuery>({limit: 12})
    const [contracts, setContracts] = useState<ContractBasicFormat[]>([])

    useEffect(() => {
        const requestContracts = () => ContractAPI.getContractsBasic(params).then(response => Boolean(response) && setContracts(response))

        setLoading(true)
        requestContracts().then(() => setLoading(false))

        const interval = setInterval(requestContracts, 15000)
        return () => clearInterval(interval);
    }, [params])

    return <>
        <div className='flex flex-col justify-center items-center w-full gap-4 rounded-3xl'>
            {isLoading ? <Loader/> : <ContractsContainer contracts={contracts}/>}
            <Link href='/bonds/explore'>
                <div className="flex w-min">
                    <BasicButton>
                        <div className='flex items-center px-4 py-0.5 gap-2'>
                            <span className='font-medium'>Explore More Bonds</span>
                        </div>
                    </BasicButton>
                </div>
            </Link>
        </div>
    </>
}

function Loader() {
    return <div className='p-12'><Loading percent={-50}/></div>
}

function ContractsContainer({contracts}: { contracts: ContractBasicFormat[] }) {
    return <>
        <div className='relative w-full'>
            <div className='grid xl1:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-4'>
                {contracts.map(contract => <BondCard info={contract} key={contract._id}/>)}
            </div>
            <div className='absolute top-[70%] left-0 h-[30%] w-full bg-gradient-to-b from-transparent to-black z-20'/>
        </div>
    </>
}

function BondsExplanation() {

    function TVL() {
        const chartRef = useRef<any>(null);

        useEffect(() => {
            if (!chartRef.current) return;
            const options = {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: true,
                    },
                },
                scales: {
                    x: {
                        display: false, // Completely hide the x-axis including the axis line
                        grid: {
                            display: false, // Hide grid lines for x-axis
                        },
                        ticks: {
                            display: false, // Hide ticks for x-axis
                        },
                    },
                    y: {
                        display: false, // Completely hide the y-axis including the axis line
                        grid: {
                            display: false, // Hide grid lines for y-axis
                        },
                        ticks: {
                            display: false, // Hide ticks for y-axis
                        },
                    },
                },
                elements: {
                    line: {
                        tension: 0.05 // Adjust this for line smoothness
                    },
                    point: {
                        radius: 0 // This will remove the points (bullets) on the line
                    },
                },
            };

            const data = [10, 30, 32, 35, 42, 50, 48, 52, 55, 34, 35, 35, 60];
            Chart.register(...registerables)
            const chart = new Chart(chartRef.current, {
                type: "line",
                data: {
                    labels: data,
                    datasets: [
                        {
                            label: 'Total Bonds Issued',
                            data,
                            backgroundColor: (context: any) => {
                                if (!context.chart.chartArea) return;

                                const {ctx, data, chartArea: {top, bottom}} = context.chart;
                                const gradientBg = ctx.createLinearGradient(0, top, 0, bottom)
                                // #858585, #00000000
                                gradientBg.addColorStop(0, "#E4E4E4")
                                gradientBg.addColorStop(1, "#D9D9D900")
                                return gradientBg;
                            },
                            borderColor: '#858585',
                            borderWidth: 1, // you can adjust the thickness of the line here
                            pointRadius: 0, // this wil
                            fill: true,
                        },
                    ],
                },
                options: options
            });

            return () => chart.destroy()
        }, [])

        return <>
            <div className="bg-white rounded-3xl h-full w-full">
                <div className='flex justify-between items-center px-5 py-6'>
                    <div className='flex flex-col text-black'>
                        <span className='text-base font-medium'>Total Value Locked</span>
                        <span className='text-3xl font-bold'>${formatLargeNumber(421522)}</span>
                    </div>
                    <div className='bg-neutral-200 rounded-full px-2'>
                        <span>+5.6%</span>
                    </div>
                </div>
                <div className='rounded-3xl'>
                    <canvas ref={chartRef}/>
                </div>
                <div className='text-black py-3'/>
            </div>

        </>
    }

    const lifecycleAttributes = [
        {
            title: "Issuing Bonds",
            text: `This is the first step where the bond is created and offered
                    to the market. The issuer sets the terms including the bond’s total amount, interest rate, and
                    maturity period, officially initiating the bond offering`
        },
        {
            title: "Bond Acquisition",
            text: `In this phase, investors acquire the bonds by paying the
                        issuer the bond price. This process mobilizes funds for the issuer, while investors receive a
                        financial instrument promising future returns`
        },
        {
            title: `Bond Growth Phase`,
            text: `During this phase, the bond is held by the investors. Over
                        this period, the bond accrues interest at the predetermined rate. It is a time of growth for the
                        investment, leading up to its maturity date`
        },
        {
            title: `Bond Redemption`,
            text: `The bondholder, now with the bond represented as an NFT, presents it to redeem their investment.
                        Upon redemption, the total return is transferred to the bondholder. This marks the successful
                        conclusion of the bond contract, fulfilling the investment cycle`
        }
    ]

    function LifecycleContainer({item}: { item: { text: string, title: string } }) {
        return <>
            <div className='md:col-span-1 sm:col-span-4 flex flex-col gap-8'>
                <div className='bg-gradient-to-r from-white to-black h-px w-full'/>
                <h4 className='text-2xl'>{item.title}</h4>
                <p className='text-neutral-300 text-sm'>{item.text}</p>
            </div>
        </>
    }

    return <>
        <div className='flex flex-col gap-40'>
            <div className='flex gap-12 justify-between xl1:flex-row sm:flex-col items-center'>
                <div className='flex flex-col md:max-w-xl sm:max-w-none gap-8'>
                    <h2 className='text-4xl font-medium'>Why Issue On-Chain Bonds?</h2>
                    <p className='text-neutral-400 text-sm'>{`Issuing on-chain bonds presents a unique opportunity for both entities and individuals seeking a simple yet effective way to raise capital. This method stands out for its straightforward process, offering a clear alternative to the intricacies of other financing methods. It allows issuers to reach a wider pool of investors, tapping into a market eager for stable and predictable investment options. By choosing to issue on-chain bonds, you open the door to hassle-free capital generation, providing a win-win for both issuers and investors looking for clarity and opportunity in the financial landscape.`}
                    </p>
                    <Link href='/bonds/issue'>
                        <BasicButton wMin>Issue Bonds</BasicButton>
                    </Link>
                </div>
                <div className='grid grid-cols-12 grid-rows-2 gap-2 text-black w-fit'>
                    <div className='md:col-span-6 sm:col-span-12 row-span-2 w-full '>
                        <TVL/>
                    </div>
                    <div className='md:col-span-3 sm:col-span-6 md:p-0 sm:p-8 row-span-1 bg-white rounded-3xl'>
                        <div className='flex flex-col justify-center items-center h-full'>
                            <span className='text-black text-center font-medium text-base'>Active Users</span>
                            <span className='text-3xl font-bold'>{formatLargeNumber(4251)}</span>
                        </div>
                    </div>
                    <div className='md:col-span-3 sm:col-span-6 md:p-0 sm:p-8 row-span-1 bg-stone-900 rounded-3xl text-white'>
                        <div className='flex flex-col justify-center items-center h-full'>
                            <span className='text-center font-medium text-base'>Max Return</span>
                            <span className='text-3xl font-bold'>x{150}</span>
                        </div>
                    </div>
                    <div className='md:col-span-6 sm:col-span-12 md:p-0 sm:p-8 row-span-1 bg-stone-900 rounded-3xl text-white'>
                        <div className='flex flex-col justify-center h-full px-6'>
                            <span className='font-medium text-base'>Realised Gains</span>
                            <span className='text-3xl font-bold'>${formatLargeNumber(2524251)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-4 gap-12'>
                {lifecycleAttributes.map(item => <LifecycleContainer item={item} key={item.title}/>)}
            </div>
        </div>
    </>
}


function SectionEnd() {
    return <>
        <div className='flex flex-col justify-center items-center bg-zinc-950 w-full py-32 gap-8'>
            <h3 className='md:text-5xl sm:text-4xl font-bold max-w-2xl text-center capitalize'>Be a part of our journey at Amet Finance</h3>
            <p className='md:text-sm sm:text-xs text-stone-300 text-center'>Connect with like-minded individuals, gain insights, and stay updated on the latest trends and opportunities.</p>
            <Link href={URLS.Discord} target="_blank">
                <div className='flex gap-3 items-center bg-white px-8 p-2.5 rounded-3xl text-black'>
                    <DiscordIcon color='#000' size={32}/>
                    <span className='font-medium'>Join Our Discord</span>
                </div>
            </Link>
        </div>
    </>
}
