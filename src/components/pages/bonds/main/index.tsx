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
        <div className='flex flex-col w-full'>
            <div className='flex flex-col gap-32 px-52'>
                <div className='relative flex justify-between w-full gap-12 bg-blackToWhite py-24 rounded-[4rem]'>
                    <div className='flex flex-col w-full gap-12 px-24'>
                        <h1 className='text-5xl font-bold max-2w-xl'>Unlock Financial Possibilities <br/> with on-chain Bonds</h1>
                        <div className='h-px w-1/4 bg-neutral-500'/>
                        <p className='text-neutral-400 text-sm max-w-2xl'>{`Amet Finance's on-chain bonds platform lets you issue, buy, sell, and redeem bonds seamlessly. Elevate your investment strategy and embrace the future of decentralized finance today.`}</p>
                        <div className='flex gap-5'>
                            <Link href='/bonds/issue'>
                                <BasicButton wMin>
                                    <span className='font-medium text-xl'>Issue Bonds</span>
                                </BasicButton>
                            </Link>
                            <Link href='/bonds/explore'>
                                <BasicButton wMin isWhiteBorder>
                                    <span className='font-medium text-xl'>Explore Bonds</span>
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

    const totalRedeemed = formatLargeNumber(6822).toString()

    return <>
        <div className='relative grid grid-cols-2 grid-rows-3 gap-4 min-w-max h-min hollow-shadow '>
            <StatisticsBox value="38" title="Total Issued" classAttributes="col-span-1 row-span-1"/>
            <StatisticsBox value="$261,241" title="Total Volume" classAttributes='col-span-1 row-span-2 pr-16'/>
            <StatisticsBox value="789" title="Total Purchased" classAttributes='col-span-1 row-span-2'/>
            <StatisticsBox value={totalRedeemed} title="Total Redeemed" classAttributes='col-span-1 row-span-1 pr-16'/>
            <div className="absolute w-[626px] h-[489px] bg-neutral-800 bg-opacity-75 rounded-full blur-[500px]"/>
        </div>
    </>
}

function StatisticsBox({classAttributes, value, title}: { value: string, title: string, classAttributes?: string }) {
    return <>
        <div
            className={"flex flex-col justify-end p-8 w-full gap-2 h-full bg-gradient-to-b from-neutral-900 to-black rounded-2xl border border-zinc-900 z-10 cursor-pointer hover:scale-105 " + classAttributes}>
            <span className='text-3xl font-bold'>{value}</span>
            <span className='text-neutral-500 font-medium text-sm'>{title}</span>
        </div>
    </>
}


function BondCards() {
    return <>
        <div
            className='flex flex-col justify-center items-center w-full gap-4 rounded-3xl'>
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
                        <div className='flex items-center gap-2'>
                            <span className='font-medium text-xl'>Explore More Bonds</span>
                            <ArrowCurveSVG color='#000'/>
                        </div>
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
                    <h2 className='text-4xl font-medium'>Why Issue On-Chain Bonds?</h2>
                    <p className='text-neutral-400 text-sm'>{`Issuing on-chain bonds presents a unique opportunity for both entities and individuals seeking a simple yet effective way to raise capital. This method stands out for its straightforward process, offering a clear alternative to the intricacies of other financing methods. It allows issuers to reach a wider pool of investors, tapping into a market eager for stable and predictable investment options. By choosing to issue on-chain bonds, you open the door to hassle-free capital generation, providing a win-win for both issuers and investors looking for clarity and opportunity in the financial landscape.`}
                    </p>
                    <Link href='/bonds/issue'>
                        <BasicButton wMin>Issue Bonds</BasicButton>
                    </Link>
                </div>
                <div className='grid grid-cols-12 grid-rows-2 gap-2 text-black'>
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
                    <h4 className='text-2xl'>Issuing Bonds</h4>
                    <p className='text-neutral-300 text-sm'>This is the first step where the bond is created and offered
                        to the market. The issuer sets the terms including the bond’s total amount, interest rate, and
                        maturity period, officially initiating the bond offering</p>
                </div>
                <div className='flex flex-col gap-8'>
                    <div className='bg-gradient-to-r from-white to-black h-px w-full'/>
                    <h4 className='text-2xl'>Bond Acquisition</h4>
                    <p className='text-neutral-300 text-sm'>In this phase, investors acquire the bonds by paying the
                        issuer the bond price. This process mobilizes funds for the issuer, while investors receive a
                        financial instrument promising future returns</p>
                </div>
                <div className='flex flex-col gap-8'>
                    <div className='bg-gradient-to-r from-white to-black h-px w-full'/>
                    <h4 className='text-2xl'>Bond Growth Phase</h4>
                    <p className='text-neutral-300 text-sm'>During this phase, the bond is held by the investors. Over
                        this period, the bond accrues interest at the predetermined rate. It is a time of growth for the
                        investment, leading up to its maturity date</p>
                </div>
                <div className='flex flex-col gap-8'>
                    <div className='bg-gradient-to-r from-white to-black h-px w-full'/>
                    <h4 className='text-2xl'>Bond Redemption</h4>
                    <p className='text-neutral-300 text-sm'>In this final phase, the bond reaches its maturity. The
                        bondholder, now with the bond represented as an NFT, presents it to redeem their investment.
                        Upon redemption, the total return is transferred to the bondholder. This marks the successful
                        conclusion of the bond contract, fulfilling the investment cycle</p>
                </div>
            </div>

        </div>
    </>
}


function SectionEnd() {
    return <>
        <div className='flex flex-col justify-center items-center bg-zinc-950 w-full py-32 gap-8'>
            <h3 className='text-5xl font-bold max-w-2xl text-center capitalize'>Be a part of our journey at Amet Finance</h3>
            <p className='text-sm text-stone-300'>Connect with like-minded individuals, gain insights, and stay updated on the latest trends and opportunities.</p>
            <Link href={URLS.Discord} target="_blank">
                <div className='flex gap-3 items-center bg-white px-8 p-3 rounded-3xl text-black'>
                    <DiscordIcon color='#000' size={32}/>
                    <span className='font-medium text-xl'>Join Our Discord</span>
                </div>
            </Link>
        </div>
    </>
}
