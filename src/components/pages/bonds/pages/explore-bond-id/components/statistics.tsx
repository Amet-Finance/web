import {ContractExtendedFormat} from "@/modules/cloud-api/contract-type";
import ArrowCurveSVG from "../../../../../../../public/svg/utils/arrow-curve";
import {format} from "@/modules/utils/numbers";
import {tColor} from "@/components/pages/bonds/utils/colors";

export default function StatisticsContainer({bondDetailed}: { bondDetailed: ContractExtendedFormat }) {

    const {contractInfo, contractStats} = bondDetailed
    const {score, securedPercentage, issuerScore, uniqueHolders} = contractStats;
    const holdersIndex = uniqueHolders ? uniqueHolders / contractInfo.total : 0;

    function Container({title, value, valueColor}: { title: string, value: string, valueColor: string }) {
        return <>
            <div
                className='flex flex-col items-end gap-4  rounded-3xl p-6 pt-2 pr-2 border border-neutral-900 lg:col-span-1 sm:col-span-2'>
                <div className='w-min bg-neutral-800 p-4 rounded-full'><ArrowCurveSVG color='#fff'/></div>
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
                       valueColor={tColor(score * 10)}/>
            <Container title='Secured Percentage'
                       value={`${format(securedPercentage, 2)}%`}
                       valueColor={tColor(securedPercentage)}/>
            <Container title='Issuer Score' value={`${issuerScore}`}
                       valueColor={tColor(issuerScore * 10)}/>
            <Container title='Unique Holders' value={`${uniqueHolders}`}
                       valueColor={tColor(holdersIndex * 100)}/>
        </div>
    </>
}
