import {DEFAULT_CHAIN_ID} from "@/modules/web3/constants";

function getIcon(contractAddress: string) {
    const lastCommit = "d7d10a3a8baf16d306a2c31b29114360e71fd812"
    const chain = Number(DEFAULT_CHAIN_ID)
    return `https://raw.githubusercontent.com/Amet-Finance/public-meta/${lastCommit}/${chain}/${contractAddress.toLowerCase()}/logo.svg`
}

export  {
    getIcon
}