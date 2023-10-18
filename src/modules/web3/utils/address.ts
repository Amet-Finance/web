import {CHAIN_INFO} from "@/modules/web3/constants";

function shorten(address: string, length = 6) {
    if (address.length <= length) {
        return address;
    }

    const start = address.substring(0, length);
    const end = address.substring(address.length - length);

    return `${start}...${end}`;
}

function getExplorerAddress(chainId: string, address: string) {
    return `${CHAIN_INFO[chainId].blockExplorerUrls[0]}/address/${address}`
}

export {
    shorten,
    getExplorerAddress
}