import {ContractCoreDetails} from "@/modules/api/contract-type";
import {format, formatLargeNumber} from "@/modules/utils/numbers";
import {tColor} from "@/components/pages/bonds/utils/colors";
import {InfoBox} from "@/components/utils/info-box";
import {STATISTICS_DEFINITION} from "@/components/pages/bonds/pages/explore-bond-id/constants";
import BigNumber from "bignumber.js";
import CalculatorController from "@/components/pages/bonds/utils/calculator";

export default function StatisticsContainer({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {

    const {totalBonds, purchased, redeemed, purchase, payout} = contractInfo;


    const isTotallyRedeemed = totalBonds === redeemed;
    const soldOutTitle = "SOLD OUT";

    const aprPercentage = CalculatorController.apr(contractInfo);
    const score = CalculatorController.score(contractInfo);
    const securedPercentage = CalculatorController.securedPercentage(contractInfo)
    const volume = CalculatorController.tbv(contractInfo)

    const maxVolume = (totalBonds * purchase.amountClean * (purchase.priceUsd ?? 0)) + (totalBonds * payout.amountClean * (payout.priceUsd ?? 0));

    const payoutBalanceClean = BigNumber(contractInfo.payoutBalance).div(BigNumber(10).pow(BigNumber(contractInfo.payout.decimals))).toNumber();

    return (
        <div className='grid grid-cols-4 sm:gap-4 gap-2 w-full'>
            <Container title='Bond Score'
                       value={isTotallyRedeemed ? soldOutTitle : `${format(score, 2)}`}
                       info={STATISTICS_DEFINITION.BondScore}
                       valueColor={isTotallyRedeemed ? "text-neutral-400" : tColor(score * 10)}/>
            <Container title='Secured Percentage'
                       value={isTotallyRedeemed ? soldOutTitle : `${format(securedPercentage, 2)}%`}
                       valueTitle={`${formatLargeNumber(payoutBalanceClean)} ${contractInfo.payout.symbol}`}
                       info={STATISTICS_DEFINITION.SecuredPercentage}
                       valueColor={isTotallyRedeemed ? "text-neutral-400" : tColor(securedPercentage)}/>
            <Container title='Volume'
                       value={`$${formatLargeNumber(volume)}`}
                       valueTitle={`${volume} USD`}
                       info={STATISTICS_DEFINITION.Volume}
                       valueColor={tColor(volume / maxVolume * 100)}/>
            <Container title='APR'
                       value={`${formatLargeNumber(aprPercentage)}%`}
                       info={STATISTICS_DEFINITION.APR}
                       valueColor={tColor(100)}/>
        </div>
    )
}

function Container({title, value, valueTitle, valueColor, info}: Readonly<{
    title: string,
    value: string,
    valueTitle?: string,
    valueColor: string,
    info: any
}>) {
    return (
        <div
            className='flex flex-col items-end justify-between rounded-3xl p-6 pt-2 pr-2 border border-neutral-900 lg:col-span-1 col-span-2 cursor-pointer'>
            <div className='p-2'>
                <InfoBox info={info} isRight className='w-[1000%]'><span/></InfoBox>
            </div>
            <div className='flex flex-col w-full' title={valueTitle}>
                <span className={`text-3xl font-bold ${valueColor}`}>{value}</span>
                <span className='text-xs text-neutral-400'>{title}</span>
            </div>
        </div>
    )
}
