import {useNetwork, useSwitchNetwork} from "wagmi";

function useNetworkValidator(chainId: number | string) {

    const {chain} = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork({chainId: Number(chainId)})

    return {
        validateAndSwitch: async () => {
            if (Number(chainId) !== chain?.id) {
                await switchNetworkAsync?.();
            }
        }
    }
}

export {
    useNetworkValidator
}
