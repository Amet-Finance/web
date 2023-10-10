import {getWeb3Instance} from "@/modules/web3/index";
import {DEFAULT_CHAIN_ID} from "@/modules/web3/constants";

function getUtils() {
    return getWeb3Instance(DEFAULT_CHAIN_ID).utils
}

function toBN(value: number | string) {
    return getUtils().toBN(value)
}

export  {
    getUtils,
    toBN
}