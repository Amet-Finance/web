import {useEffect, useRef} from "react";
import {Chart, ChartMeta, registerables} from "chart.js";
import {join} from "@/modules/utils/styles";
import {formatLargeNumber} from "@/modules/utils/numbers";

type Arguments = {
    total: number;
    purchased: number;
    redeemed: number;
}

export default function PieChart({total, purchased, redeemed}: Arguments) {
    const left = total - purchased;
    const theUnredeemedAmount = purchased - redeemed;


    const DatasetLabels = {
        Redeem: "Redeem",
        Purchased: 'Purchased',
        Left: 'Left'
    }

    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const options: any = {
            datasets: {
                doughnut: {
                    backgroundColor: "#9BD0F5",
                    borderColor: "transparent",
                    spacing: 0.5,
                    borderJoinStyle: "round",
                    borderRadius: 5,
                },
            },
            cutout: "88%",
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }

        const doghuntLabel = {
            id: "doghuntLabel",
            afterDatasetDraw(chart: Chart, args: { index: number; meta: ChartMeta }, options: any): boolean | void {

                const {ctx, data, _active} = chart as any;
                const xCoor = chart.getDatasetMeta(0).data[0].x
                const yCoor = chart.getDatasetMeta(0).data[0].y
                let text = `Total: ${total}`

                let headline: any = "Total"
                let value: any = total
                let style: any = "#fff"

                ctx.save();

                if (_active.length) {
                    const datasetIndexValue = _active[0].datasetIndex;
                    const dataIndexValue = _active[0].index;

                    const dataLabel = data.labels?.[dataIndexValue];
                    const dataPoint = data.datasets[datasetIndexValue].data[dataIndexValue]
                    // style = data.datasets[0]?.backgroundColor?.[dataIndexValue]
                    // console.log(data.datasets)
                    headline = dataLabel
                    value = dataPoint

                }
                ctx.font = "500 0.75rem sans-serif"

                ctx.fillStyle = "rgba(255,255,255,0.5)";
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(headline, xCoor, yCoor - 8)
                ctx.font = "bold 1rem sans-serif"
                ctx.fillStyle = "rgba(255,255,255,1)";
                ctx.fillText(formatLargeNumber(value), xCoor, yCoor + 8)
            }
        }

        Chart.register(...registerables)
        const chart = new Chart(chartRef.current, {
            type: "doughnut",
            data: {
                datasets: [{
                    data: [redeemed, theUnredeemedAmount, left],
                    backgroundColor: [
                        '#22c55e',
                        '#fff',
                        '#393939',
                    ]
                }],
                labels: [DatasetLabels.Redeem, DatasetLabels.Purchased, DatasetLabels.Left]
            },
            options: options,
            plugins: [doghuntLabel]
        });


        return () => {
            chart.destroy();
        };

    }, [total, purchased, redeemed])

    return <>
        <div className="flex justify-center items-center cursor-pointer">
            <div className='w-[100px] h-[100px]'>
                <canvas ref={chartRef}/>
            </div>
        </div>
    </>
}
