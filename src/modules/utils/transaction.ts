import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import {useNetworkValidator} from "@/modules/utils/chain";
import {useAccount, useSendTransaction} from "wagmi";
import {getChain} from "@/modules/utils/wallet-connect";
import {useWeb3Modal} from "@web3modal/wagmi/react";

function useTransaction(chainId: number | string, txType: string, txConfig: { [key: string]: any }) {

    const {address} = useAccount();
    const {open} = useWeb3Modal();
    const chain = getChain(chainId);
    const validator = useNetworkValidator(chainId);

    const config = getContractInfoByType(chain, txType, txConfig);
    const {sendTransactionAsync, isLoading} = useSendTransaction({
        to: config.to,
        value: config.value,
        data: config.data
    })

    async function submitTransaction() {
        try {
            if (!address) return open();
            await validator.validateAndSwitch()
            const response = await sendTransactionAsync();
            return await trackTransaction(chain, response.hash);
        } catch (error: any) {
            console.error(error)
        }
    }


    return {
        submitTransaction,
        isLoading
    }
}

export {
    useTransaction
}
