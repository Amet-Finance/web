import {ContractEssentialFormat} from "@/modules/cloud-api/contract-type";

export default function FinishedComponent({contractInfo}: Readonly<{ contractInfo: ContractEssentialFormat }>) {

    const {totalBonds, purchased, redeemed} = contractInfo;
    if (totalBonds !== redeemed) return null;

    return <div className='bg-neutral-700 rounded-md w-full p-2 border border-neutral-600 text-center'>
        <h1>This bond has been fully purchased and redeemed!</h1>
    </div>
}
