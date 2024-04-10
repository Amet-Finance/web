import {Chain} from "wagmi";

const joltevmDev: Chain = {
    id: 1730,
    name: "joltevm-dev",
    nativeCurrency: {
        name: "JOLT",
        symbol: "JOLT",
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: ['http://65.109.48.184:8555/'],
        },
        public: {
            http: ['http://65.109.48.184:8555/'],
        },
    },
    network: "joltevm-dev"
}

export {joltevmDev}
