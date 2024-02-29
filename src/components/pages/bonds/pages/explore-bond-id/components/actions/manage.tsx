import {ContractExtendedInfoFormat} from "@/modules/cloud-api/contract-type";
import {useSendTransaction} from "wagmi";
import {getContractInfoByType} from "@/modules/web3";
import {TxTypes} from "@/modules/web3/constants";
import {getChain} from "@/modules/utils/wallet-connect";

export default function ManageTab({contractInfo}: { contractInfo: ContractExtendedInfoFormat }) {

    const settle = useSettle(contractInfo);

    return <>
        <div className='flex flex-col justify-end h-full w-full'>
            <div className='grid grid-cols-2 gap-2'>
                <span className='text-sm text-neutral-400 whitespace-nowrap bg-neutral-800 rounded-md p-2'>Deposit Payout</span>
                <span className='text-sm text-neutral-400 whitespace-nowrap bg-neutral-800 rounded-md p-2'
                      onClick={() => settle.sendTransactionAsync()}>Settle</span>
                <span className='col-span-2 text-sm text-neutral-400 whitespace-nowrap bg-neutral-800 rounded-md p-2'>Update Bond Supply</span>
                <span className='col-span-2 text-sm text-neutral-400 whitespace-nowrap bg-neutral-800 rounded-md p-2'>Withdraw Excess Payout</span>
                <span className='col-span-2 text-sm text-neutral-400 whitespace-nowrap bg-neutral-800 rounded-md p-2'>Decrease Maturity Period</span>
            </div>
        </div>
    </>
}


function useSettle(contractInfo: ContractExtendedInfoFormat) {
    const [contractAddress, chainId] = contractInfo._id.split("_");
    const chain = getChain(chainId);
    const config = getContractInfoByType(chain, TxTypes.Settle, {contractAddress})
    const transaction = useSendTransaction({
        to: config.to,
        value: config.value,
        data: config.data
    })


    return {
        sendTransactionAsync: () => transaction.sendTransactionAsync(),
        isLoading: () => transaction.isLoading
    }
}
