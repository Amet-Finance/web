import {ContractExtendedFormat} from "@/modules/cloud-api/contract-type";
import {format} from "@/modules/utils/numbers";
import {tColor} from "@/components/pages/bonds/utils/colors";
import InfoBox from "@/components/utils/info-box";
import {STATISTICS_DEFINITION} from "@/components/pages/bonds/pages/explore-bond-id/constants";

export default function StatisticsContainer({bondDetailed}: { bondDetailed: ContractExtendedFormat }) {

    const {contractInfo, contractStats} = bondDetailed
    const {score, securedPercentage, issuerScore, uniqueHolders} = contractStats;
    const holdersIndex = uniqueHolders ? uniqueHolders / contractInfo.total : 0;

    function Container({title, value, valueColor, info}: {
        title: string,
        value: string,
        valueColor: string,
        info: any
    }) {
        return <>
            <div
                className='flex flex-col items-end gap-4  rounded-3xl p-6 pt-2 pr-2 border border-neutral-900 lg:col-span-1 sm:col-span-2'>
                <div className='w-full p-2'>
                    <InfoBox info={info} isRight><span/></InfoBox>
                </div>
                <div className='flex flex-col w-full gap-1'>
                    <span className={`text-5xl font-bold ${valueColor}`}>{value}</span>
                    <span className='text-xs'>{title}</span>
                </div>
            </div>
        </>
    }

    return <>
        <div className='grid grid-cols-4 gap-4 w-full'>
            <Container title='Bond Score'
                       value={`${format(score, 2)}`}
                       info={STATISTICS_DEFINITION.BondScore}
                       valueColor={tColor(score * 10)}/>
            <Container title='Secured Percentage'
                       value={`${format(securedPercentage, 2)}%`}
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
    </>
}
