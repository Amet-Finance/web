import {CHAIN_INFO} from "@/modules/web3/constants";

function getExplorerToken(chainId: string, address?: string) {
    return `${CHAIN_INFO[chainId].blockExplorerUrls[0]}/token/${address}`
}

export {
    getExplorerToken
}
