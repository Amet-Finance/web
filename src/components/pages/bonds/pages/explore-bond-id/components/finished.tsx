import {ContractCoreDetails} from "@/modules/api/contract-type";

export default function FinishedComponent({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {

    const {totalBonds, purchased, redeemed} = contractInfo;
    if (totalBonds !== redeemed) return null;

    return (
        <div className=' rounded-2xl w-full p-4 border border-neutral-900 text-center'>
            <span className='font-medium'>This bond has been fully purchased and redeemed!</span>
        </div>
    )
}
