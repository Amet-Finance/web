import {DetailedBondResponse, SecurityDetails} from "@/modules/cloud-api/type";
import {tColor} from "@/components/pages/bonds/utils/colors";
import ArrowSVG from "../../../../../../public/svg/utils/arrow";

export default function ExploreBondId({bondInfoDetailed}: { bondInfoDetailed: DetailedBondResponse }) {

    const {description,securityDetails} = bondInfoDetailed;


    return <>
        <div className='w-full min-h-screen'>
            <div className='flex flex-col w-full px-16 py-12 gap-10'>
                <div className='flex gap-4 items-center'>
                    <h1 className='text-3xl font-bold'>{description.name}</h1>
                    <ArrowSVG/>
                </div>
                <SecurityDetailsComponent securityDetails={securityDetails}/>
                <div className='grid grid-cols-6 gap-4'>
                    <div
                        className='relative flex flex-col justify-center items-center col-span-4 py-40 bg-neutral-500 rounded w-full'>
                        <div className='absolute top-5 left-5'>
                            <span>Bond name in top left corner with type</span>
                        </div>
                        <div className='absolute top-5 right-5'>
                            <span>Bond status(isOpen)</span>
                        </div>
                        <span>Bond Info(Purchase/Sold/Time)</span>
                    </div>
                    <div className='flex justify-center items-center col-span-2 bg-neutral-500 rounded'>
                        <span>Bond Actions(Purchase/Redeem)</span>
                    </div>
                </div>

                <div className=' flex justify-center items-center w-full bg-neutral-500 py-20 rounded'>
                    <span>Descritpion</span>
                </div>

                <div className=' flex justify-center items-center w-full bg-neutral-500 py-20 rounded'>
                    <span>Recent Activity</span>
                </div>

                <div className=' flex justify-center items-center w-full bg-neutral-500 py-20 rounded'>
                    <span>Simillar bonds</span>
                </div>
            </div>
        </div>
    </>
}


function SecurityDetailsComponent({securityDetails}: { securityDetails: SecurityDetails }) {
    return <>
        <div className='grid gap-2 xl:grid-cols-4 md:grid-cols-2 sm:grid-cols-1'>
            <div className='flex flex-col justify-center items-center py-10 w-full rounded border border-w1'>
                <span
                    className={`text-3xl font-bold ${tColor(securityDetails.securedPercentage)}`}>{securityDetails.securedPercentage}%</span>
                <span className='text-sm text-g'>Secured Percentage</span>
            </div>
            <div className='flex flex-col justify-center items-center py-10 w-full rounded border border-w1'>
                <span
                    className={`text-3xl font-bold ${tColor(securityDetails.bondScore * 10)}`}>{securityDetails.bondScore}</span>
                <span className='text-sm text-g'>Bond Score</span>
            </div>
            <div
                className='flex flex-col justify-center items-center py-10 w-full rounded border border-w1'>
                <span
                    className={`text-3xl font-bold ${tColor(securityDetails.issuerScore * 10)}`}>{securityDetails.issuerScore}</span>
                <span className='text-sm text-g'>Issuer Score</span>
            </div>
            <div
                className='flex flex-col justify-center items-center py-10 w-full rounded border border-w1'>
                <span
                    className={`text-3xl font-bold ${tColor(securityDetails.uniqueHoldersIndex * 10)}`}>{securityDetails.uniqueHoldersIndex}</span>
                <span className='text-sm text-g'>Unique Holders Index</span>
            </div>
        </div>
    </>
}
