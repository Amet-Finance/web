import {DEFAULT_CHAIN_ID} from "@/modules/web3/constants";

function getIcon(contractAddress: string) {
    const lastCommit = "c125b8b9f5c108c475714c7c476ce8481a77f8e4"
    const chain = Number(DEFAULT_CHAIN_ID)
    return `https://raw.githubusercontent.com/Amet-Finance/public-meta/${lastCommit}/${chain}/${contractAddress.toLowerCase()}/logo.svg`
}

export  {
    getIcon
}