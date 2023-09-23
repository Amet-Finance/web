import {CHAIN_INFO, DEFAULT_CHAIN_ID} from "@/modules/web3/constants";

function getExplorerToken(address?: string) {
    return `${CHAIN_INFO[DEFAULT_CHAIN_ID].blockExplorerUrls[0]}/token/${address}`
}

export {
    getExplorerToken
}
