import {useEffect, useRef} from "react";
import {Chart, ChartMeta, registerables} from "chart.js";
import {join} from "@/modules/utils/styles";

type Arguments = {
    total: number;
    purchased: number;
    redeemed: number;
    isHorizontal?: boolean;
    hideText?: boolean;
}

export default function PieChart({total, purchased, redeemed, isHorizontal, hideText}: Arguments) {
    const left = total - purchased;
    const theUnredeemedAmount = purchased - redeemed;
    // todo write total inside the round https://www.youtube.com/watch?v=c2mzQKpd_DI
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
            cutout: "90%",
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
            afterDatasetDraw(chart: Chart, args: { index: number; meta: ChartMeta }, options: O): boolean | void {

                const {ctx, data, _active} = chart;
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
                ctx.fillText(value, xCoor, yCoor + 8)
            }
        }

        Chart.register(...registerables)
        const chart = new Chart(chartRef.current, {
            type: "doughnut",
            data: {
                datasets: [{
                    data: [redeemed, theUnredeemedAmount, left],
                    backgroundColor: [
                        '#4F2AB6',
                        '#926AFF',
                        '#fff',
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

    }, [total, purchased, redeemed, isHorizontal])

    const size = isHorizontal ? "104px" : "52px"

    return <>
        <div className="container">
            <div className='canvas'>
                <canvas ref={chartRef}/>
            </div>
        </div>
        <style jsx>{`
          .container {
            display: flex;
            flex-direction: ${isHorizontal ? "row" : "column"};
            justify-content: center;
            align-items: center;
            border-radius: 0.5rem;
            width: 100%;
            height: 100%;
          }

          .canvas {
            width: 100px;
            height: 100px;
          }

          //
          //@media (max-width: 768px) {
          //  .canvas {
          //    width: 52px;
          //    height: 52px;
          //  }
          //}
          //
          //@media (max-width: 500px) {
          //  .container {
          //    flex-direction: column;
          //    gap: 0.5rem;
          //  }
          //} 

        `}</style>
    </>
}