import {useEffect, useRef} from "react";
import {Chart, registerables} from "chart.js";
import {join} from "@/modules/utils/styles";
import {ChartOptions} from "chart.js/dist/types";

type Arguments = {
    total: number;
    purchased: number;
    redeemed: number
}

export default function RoundProgress({total, purchased, redeemed}: Arguments) {
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
                    borderRadius: 10,
                },
            },
            cutout: "85%",
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context: any) {
                            const {label} = context
                            console.log(context)
                            switch (label) {
                                case DatasetLabels.Redeem: {
                                    return redeemed.toString();
                                }
                                case DatasetLabels.Purchased: {
                                    return purchased.toString();
                                }
                                case DatasetLabels.Left: {
                                    return left.toString();
                                }
                                default: {
                                    return "0"
                                }
                            }
                        }
                    }
                }
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
                    ],
                }],
                labels: [DatasetLabels.Redeem, DatasetLabels.Purchased, DatasetLabels.Left]
            },
            options: options
        });


        return () => {
            chart.destroy();
        };

    }, [])

    return <>
        <div className="container">
            <div className='canvas'>
                <canvas ref={chartRef}/>
            </div>
            <div className='texts'>
                <div className={join(['purple', "point"])}/>
                <span>Purchased</span>
                <span>{purchased}</span>
                <div className={join(['purple1', "point"])}/>
                <span>Redeemed</span>
                <span>{redeemed}</span>
                <div className='point'/>
                <span>Bonds Left</span>
                <span>{left}</span>
            </div>
        </div>
        <style jsx>{`
          .container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 0.5rem;
            padding: 1rem 1rem 1rem 1rem;
            gap: 1rem;
            width: 100%;
            background-color: #0e0e0e;
            text-align: start;
          }

          .canvas {
            width: 52px;
            height: 52px;
          }

          .texts {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.5rem;
            width: 100%;
            font-size: 0.7rem;
          }

          .point {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #fff;
          }

          .purple {
            background-color: #926AFF;
          }

          .purple1 {
            background-color: #4F2AB6;
          }

        `}</style>
    </>
}