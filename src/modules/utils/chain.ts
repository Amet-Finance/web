import {Chain, useNetwork, useSwitchNetwork} from "wagmi";
import {SupportedChains} from "@/modules/utils/constants";

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

function getChainIcon(chainId: string | number | undefined) {
    return `/svg/chains/${chainId}.svg`;
}

function getChain(chainId: string | number | undefined): Chain | undefined {
    return SupportedChains.find(item => item.id === Number(chainId))
}

export {
    useNetworkExtended,
    getChainIcon,
    getChain
}
