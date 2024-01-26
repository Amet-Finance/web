import {BasicButton} from "@/components/utils/buttons";
import BondCard from "@/components/pages/bonds/utils/bond-card";
import {BOND_CARDS} from "@/components/pages/main/constants";
import ArrowCurveSVG from "../../../../../public/svg/utils/arrow-curve";
import Link from "next/link";
import {URLS} from "@/modules/utils/urls";
import {DiscordIcon} from "../../../../../public/svg/social/discord";
import {useEffect, useRef} from "react";
import {Chart, registerables} from "chart.js";
import {formatLargeNumber} from "@/modules/utils/numbers";

export default function Bonds() {
    return <>
        <div>
            <div className='flex flex-col gap-24 px-36 py-32'>
                <div className='relative flex justify-between w-full gap-12'>

                    <div className='flex flex-col w-full gap-12 py-32'>
                        <h1 className='text-5xl font-bold max-2w-xl'>Unlock Financial Possibilities <br/> with on-chain
                            Bonds</h1>
                        <div className='h-px w-1/4 bg-neutral-500'/>
                        <p className='text-neutral-400 text-sm max-w-2xl'>{`Amet Finance's on-chain bonds platform lets
                            you
                            issue,
                            buy,
                            sell, and redeem bonds seamlessly.
                            Elevate your investment strategy and embrace the future of decentralized finance today.`}</p>
                        <div className='flex gap-5'>
                            <BasicButton wMin>
                                <span>Issue Bonds</span>
                            </BasicButton>
                            <BasicButton wMin isWhiteBorder>
                                <span>Explore Bonds</span>
                            </BasicButton>
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
    return <>
        <div className='relative grid grid-cols-2 gap-4 min-w-max h-min hollow-shadow '>
            <StatisticsBox value="38" title="Total Issued"/>
            <StatisticsBox value="$261,241" title="Total Volume" classAttributes='translate-y-28'/>
            <StatisticsBox value="789" title="Total Purchased"/>
            <StatisticsBox value="682" title="Total Redeemed" classAttributes='translate-y-28'/>
            <div className="absolute w-[626px] h-[489px] bg-neutral-800 bg-opacity-75 rounded-full blur-[500px]"/>
        </div>
    </>
}

function StatisticsBox({classAttributes, value, title}: { value: string, title: string, classAttributes?: string }) {
    return <>
        <div
            className={"flex flex-col justify-end px-5 py-8 w-60 gap-2 h-64 bg-gradient-to-b from-zinc-900 to-black rounded-2xl border border-zinc-900 z-10 cursor-pointer hover:scale-105 " + classAttributes}>
            <span className='text-3xl font-bold'>{value}</span>
            <span className='text-neutral-500 font-medium text-sm'>{title}</span>
        </div>
    </>
}


function BondCards() {
    return <>
        <div
            className='flex flex-col justify-center items-center w-full gap-4 bg-gradient-to-b from-zinc-950 to-black p-8 rounded-3xl'>
            <div className='relative'>
                <div className='grid xl1:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-4'>
                    <BondCard info={BOND_CARDS[0]}/>
                    <BondCard info={BOND_CARDS[2]}/>
                    <BondCard info={BOND_CARDS[1]}/>
                    <BondCard info={BOND_CARDS[0]}/>
                    <BondCard info={BOND_CARDS[1]}/>
                    <BondCard info={BOND_CARDS[2]}/>
                </div>
                <div
                    className='absolute top-[70%] left-0 h-[30%] w-full bg-gradient-to-b from-transparent to-black z-20'/>
            </div>
            <Link href='/bonds/explore'>
                <div className="flex w-min">
                    <BasicButton>
                        <span>Explore More Bonds</span>
                    </BasicButton>
                    <BasicButton>
                        <ArrowCurveSVG color='#000'/>
                    </BasicButton>
                </div>
            </Link>
        </div>
    </>
}

function BondsExplanation() {

    // 1. How much people made with Amet Finance?
    // 2.
    function TVL() {
        const chartRef = useRef<any>(null);
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

        useEffect(() => {
            if (!chartRef.current) return;

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
            <div className="w-80 h-80 bg-white rounded-3xl">
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

    return <>
        <div className='flex flex-col gap-40'>
            <div className='flex justify-between'>
                <div className='flex flex-col max-w-xl gap-8'>
                    <h2 className='text-4xl font-medium'>Why On-Chain Bonds?</h2>
                    <p className='text-neutral-400 text-sm'>{`Amet Finance's on-chain bonds platform lets you issue, buy,
                        sell, and redeem bonds seamlessly. Elevate your investment strategy and embrace the future of
                        decentralized finance today. Amet Finance's on-chain bonds platform lets you issue, buy, sell,
                        and redeem bonds seamlessly.
                        Elevate your investment strategy and embrace the future of decentralized finance today.`}
                    </p>
                    <BasicButton wMin>Issue Bonds</BasicButton>
                </div>
                <div className='grid grid-cols-12 grid-rows-2 gap-1 text-black'>
                    <div className='col-span-6 row-span-2 '>
                        <TVL/>
                    </div>
                    <div className='col-span-3 row-span-1 bg-white rounded-3xl'>
                        <div className='flex flex-col justify-center items-center h-full'>
                            <span className='text-black text-center font-medium text-base'>Active Users</span>
                            <span className='text-3xl font-bold'>{formatLargeNumber(4251)}</span>
                        </div>
                    </div>
                    <div className='col-span-3 row-span-1 bg-stone-900 rounded-3xl text-white'>
                        <div className='flex flex-col justify-center items-center h-full'>
                            <span className='text-center font-medium text-base'>Max Return</span>
                            <span className='text-3xl font-bold'>x{150}</span>
                        </div>
                    </div>
                    <div className='col-span-6 row-span-2 bg-stone-900 rounded-3xl text-white'>
                        <div className='flex flex-col justify-center h-full px-6'>
                            <span className='font-medium text-base'>Realised Gains</span>
                            <span className='text-3xl font-bold'>${formatLargeNumber(2524251)}</span>
                        </div>
                    </div>
                </div>

            </div>
            <div className='grid grid-cols-4 gap-12'>
                <div className='flex flex-col gap-8'>
                    <div className='bg-gradient-to-r from-white to-black h-px w-full'/>
                    <h4 className='text-2xl'>Issue</h4>
                    <p className='text-neutral-300 text-sm'>{`Amet Finance's on-chain bonds platform lets you issue, buy,
                        sell, and redeem bonds seamlessly.
                        Elevate your investment strategy and embrace the future of decentralized finance today.`}</p>
                </div>
                <div className='flex flex-col gap-8'>
                    <div className='bg-gradient-to-r from-white to-black h-px w-full'/>
                    <h4 className='text-2xl'>Issue</h4>
                    <p className='text-neutral-300 text-sm'>{`Amet Finance's on-chain bonds platform lets you issue, buy,
                        sell, and redeem bonds seamlessly.
                        Elevate your investment strategy and embrace the future of decentralized finance today.`}</p>
                </div>
                <div className='flex flex-col gap-8'>
                    <div className='bg-gradient-to-r from-white to-black h-px w-full'/>
                    <h4 className='text-2xl'>Issue</h4>
                    <p className='text-neutral-300 text-sm'>{`Amet Finance's on-chain bonds platform lets you issue, buy,
                        sell, and redeem bonds seamlessly.
                        Elevate your investment strategy and embrace the future of decentralized finance today.`}</p>
                </div>
                <div className='flex flex-col gap-8'>
                    <div className='bg-gradient-to-r from-white to-black h-px w-full'/>
                    <h4 className='text-2xl'>Issue</h4>
                    <p className='text-neutral-300 text-sm'>{`Amet Finance's on-chain bonds platform lets you issue, buy,
                        sell, and redeem bonds seamlessly.
                        Elevate your investment strategy and embrace the future of decentralized finance today.`}</p>
                </div>
            </div>

        </div>
    </>
}


function SectionEnd() {
    return <>
        <div className='flex flex-col justify-center items-center bg-zinc-950 w-full py-32 gap-8'>
            <h3 className='text-5xl font-bold max-w-2xl text-center capitalize'>See forward with Amet’s Blockchain
                Analytics</h3>
            <p className='text-sm text-stone-300'>Investment strategy and embrace the future of decentralized finance
                today.</p>
            <Link href={URLS.Discord} target="_blank">
                <div className='flex gap-3 items-center bg-white px-8 p-3 rounded-3xl text-black'>
                    <DiscordIcon color='#000' size={32}/>
                    <span className='font-medium'>Join Our Discord</span>
                </div>
            </Link>
        </div>
    </>
}
