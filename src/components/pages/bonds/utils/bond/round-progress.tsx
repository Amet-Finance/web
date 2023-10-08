import {useEffect, useRef} from "react";
import {Chart, registerables} from "chart.js";
import {join} from "@/modules/utils/styles";

type Arguments = {
    total: number;
    purchased: number;
    redeemed: number;
    isHorizontal?: boolean;
}

export default function RoundProgress({total, purchased, redeemed, isHorizontal}: Arguments) {
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

    }, [total, purchased, redeemed, isHorizontal])

    const size = isHorizontal ? "104px" : "52px"

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
            flex-direction: ${isHorizontal ? "row" : "column"};
            justify-content: center;
            align-items: center;
            border-radius: 0.5rem;
            gap: ${isHorizontal ? "2rem" : "1rem"};
            width: 100%;
            height: 100%;
            text-align: start;
          }

          .canvas {
            width: ${size};
            height: ${size};
          }

          .texts {
            display: grid;
            grid-template-columns: repeat(3, auto);
            align-items: center;
            justify-content: center;
            gap: 0.25rem 1rem;
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

          @media (max-width: 768px) {
            .canvas {
              width: 52px;
              height: 52px;
            }
          }

          @media (max-width: 500px) {
            .container {
              flex-direction: column;
              gap: 0.5rem;
            }
          }

        `}</style>
    </>
}