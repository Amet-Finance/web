import {ContractCoreDetailsWithPayoutBalance} from "@/modules/cloud-api/contract-type";
import {format, formatLargeNumber} from "@/modules/utils/numbers";
import {tColor} from "@/components/pages/bonds/utils/colors";
import InfoBox from "@/components/utils/info-box";
import {STATISTICS_DEFINITION} from "@/components/pages/bonds/pages/explore-bond-id/constants";
import BigNumber from "bignumber.js";
import CalculatorController from "@/components/pages/bonds/utils/calculator";

export default function StatisticsContainer({contractInfo}: Readonly<{
    contractInfo: ContractCoreDetailsWithPayoutBalance
}>) {

    const {issuerScore, uniqueHolders} = contractInfo;
    const score = CalculatorController.score(contractInfo)
    const securedPercentage = CalculatorController.securedPercentage(contractInfo)
    const holdersIndex = uniqueHolders ? uniqueHolders / contractInfo.totalBonds : 0;

    const payoutBalanceClean = BigNumber(contractInfo.payoutBalance).div(BigNumber(10).pow(BigNumber(contractInfo.payout.decimals))).toNumber();

    return (
        <div className='grid grid-cols-4 gap-4 w-full'>
            <Container title='Bond Score'
                       value={`${format(score, 2)}`}
                       info={STATISTICS_DEFINITION.BondScore}
                       valueColor={tColor(score * 10)}/>
            <Container title='Secured Percentage'
                       value={`${format(securedPercentage, 2)}%`}
                       valueTitle={`${formatLargeNumber(payoutBalanceClean)} ${contractInfo.payout.symbol}`}
                       info={STATISTICS_DEFINITION.SecuredPercentage}
                       valueColor={tColor(securedPercentage)}/>
            <Container title='Issuer Score'
                       value={`${format(issuerScore, 2)}`}
                       info={STATISTICS_DEFINITION.IssuerScore}
                       valueColor={tColor(issuerScore * 10)}/>
            <Container title='Unique Holders'
                       value={`${uniqueHolders}`}
                       info={STATISTICS_DEFINITION.UniqueHolders}
                       valueColor={tColor(holdersIndex * 100)}/>
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
            className='flex flex-col items-end rounded-3xl p-6 pt-2 pr-2 border border-neutral-900 lg:col-span-1 col-span-2 cursor-pointer'>
            <div className='w-full p-2'>
                <InfoBox info={info} isRight><span/></InfoBox>
            </div>
            <div className='flex flex-col w-full' title={valueTitle}>
                <span className={`text-3xl font-bold ${valueColor}`}>{value}</span>
                <span className='text-xs text-neutral-400'>{title}</span>
            </div>
        </div>
    )
}
