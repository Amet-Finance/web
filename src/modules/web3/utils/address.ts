import {CHAIN_INFO, DEFAULT_CHAIN_ID} from "@/modules/web3/constants";

function shorten(address: string, length = 6) {
    if (address.length <= length) {
        return address;
    }

    const start = address.substring(0, length);
    const end = address.substring(address.length - length);

    return `${start}...${end}`;
}

function getExplorerAddress(address: string) {
    return `${CHAIN_INFO[DEFAULT_CHAIN_ID].blockExplorerUrls[0]}/address/${address}`
}

export {
    shorten,
    getExplorerAddress
}