import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import {useNetworkValidator} from "@/modules/utils/chain";
import {useAccount, useSendTransaction, useSignMessage} from "wagmi";
import {getChain} from "@/modules/utils/wallet-connect";
import {StringKeyedObject} from "@/components/utils/general";
import {useConnectWallet} from "@/modules/utils/address";

function useTransaction(chainId: number | string, txType: string, txConfig: StringKeyedObject<any>) {

    const {address} = useAccount();
    const {open} = useConnectWallet();
    const chain = getChain(chainId);
    const validator = useNetworkValidator(chainId);

    const config = getContractInfoByType(chain, txType, txConfig);
    const {sendTransactionAsync, isLoading} = useSendTransaction({
        to: config.to,
        value: config.value,
        data: config.data as any
    })

    async function submitTransaction() {
        try {
            if (!address) {
                open()
                return undefined;
            }
            await validator.validateAndSwitch()
            const response = await sendTransactionAsync();
            return await trackTransaction(chain, response.hash);
        } catch (error: any) {
            console.error(error)
            return undefined;
        }
    }


    return {
        submitTransaction,
        isLoading
    }
}

function useSignature(message: string, nonce?: boolean, contractAddress?: string) {

    const {address} = useAccount();
    const {open} = useConnectWallet();

    if (contractAddress) {
        message += `\nContract: ${contractAddress}`
    }

    if (nonce) {
        message += `\nNonce: ${Date.now()}`
    }

    const {signMessageAsync} = useSignMessage({message});

    async function submitSignature(): Promise<string | undefined> {
        try {
            if (!address) {
                open()
                return undefined
            }
            return await signMessageAsync();
        } catch (error: any) {
            console.error(error)
            return undefined;
        }
    }

    return {
        address,
        message,
        submitSignature
    }
}

export {
    useTransaction,
    useSignature
}
