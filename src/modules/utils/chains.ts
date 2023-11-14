import {defineChain} from "viem";


const mantaPacific = defineChain({
    id: 169,
    name: "Manta Pacific",
    network: "manta-pacific",
    nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18
    },
    blockExplorers: {
        default: {
            name: 'Manta Pacific Explorer',
            url: 'https://pacific-explorer.manta.network/',
        },
    },
    rpcUrls: {
        default: {
            http: ["https://pacific-rpc.manta.network/http"]
        },
        public: {
            http: ["https://pacific-rpc.manta.network/http"]
        }
    },
})


export {
    mantaPacific
}
