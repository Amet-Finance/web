import {useNetwork, useSwitchNetwork} from "wagmi";

function useNetworkExtended(chainId: number | string) {

    const {chain} = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork({chainId: Number(chainId)})

    return {
        chain,
        validateAndSwitch: async () => {
            if (Number(chainId) !== chain?.id) {
                await switchNetworkAsync?.();
            }
        }
    }
}

export {
    useNetworkExtended
}
