import {getWeb3Instance} from "@/modules/web3/index";
import {CHAIN_IDS} from "@/modules/web3/constants";

function getUtils() {
    return getWeb3Instance(CHAIN_IDS.Mumbai).utils
}

function toBN(value: number | string) {
    return getUtils().toBN(value)
}

export  {
    getUtils,
    toBN
}