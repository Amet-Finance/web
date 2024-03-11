import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import {useNetworkValidator} from "@/modules/utils/chain";
import {useSendTransaction} from "wagmi";
import {getChain} from "@/modules/utils/wallet-connect";

function useTransaction(chainId: number | string, txType: string, txConfig: { [key: string]: any }) {

    const chain = getChain(chainId);

    const validator = useNetworkValidator(chainId);


    const config = getContractInfoByType(chain, txType, txConfig)
    const {sendTransactionAsync, isLoading} = useSendTransaction({
        to: config.to,
        value: config.value,
        data: config.data
    })


    return {
        submitTransaction: async () => {
            try {
                await validator.validateAndSwitch()
                const response = await sendTransactionAsync();
                return await trackTransaction(chain, response.hash);
            } catch (error: any) {
                console.error(error)
            }
        },
        isLoading
    }
}

export {
    useTransaction
}
