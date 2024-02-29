import {getChain} from "@/modules/utils/wallet-connect";
import {ExplorerTypes} from "@/modules/web3/type";
import BigNumber from "bignumber.js";

function toBN(value: number | string) {
    return BigNumber(value)
}

function getExplorer(chainId: number | string | undefined, type: ExplorerTypes, value: string) {
    const chain = getChain(chainId)

    switch (type) {
        case "token": {
            return `${chain?.blockExplorers?.default.url}/token/${value}`
        }
        case "address" : {
            return `${chain?.blockExplorers?.default.url}/address/${value}`
        }
        case "hash": {
            return `${chain?.blockExplorers?.default.url}/tx/${value}`
        }
    }
}

function shorten(address: string | any, length = 6) {
    if (!address || address.length <= length) {
        return address;
    }

    const start = address.substring(0, length);
    const end = address.substring(address.length - length);

    return `${start}...${end}`;
}

export {
    toBN,
    getExplorer,
    shorten
}
