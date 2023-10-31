import {getWeb3Instance} from "@/modules/web3/index";
import {defaultChain} from "@/modules/utils/wallet-connect";
import {CHAINS} from "@/modules/utils/wallet-connect";
import {ExplorerTypes} from "@/modules/web3/type";


function getUtils() {
    return getWeb3Instance(defaultChain).utils
}

function toBN(value: number | string) {
    return getUtils().toBN(value)
}


function getExplorer(chainId: number | undefined, type: ExplorerTypes, value: string) {
    chainId = chainId || defaultChain.id
    const chain = CHAINS.find(item => item.id === chainId);

    switch (type) {
        case "token": {
            return `${chain?.blockExplorers?.default.url}/token/${value}`
        }
        case "address" : {
            return `${chain?.blockExplorers?.default.url}/address/${value}`
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
    getUtils,
    toBN,
    getExplorer,
    shorten
}
