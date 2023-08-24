import {DEFAULT_CHAIN_ID} from "@/modules/web3/constants";

function getIcon(contractAddress: string) {
    const lastCommit = "a720c5a106aea49e0c4177baaa96d081149ccd2f"
    const chain = Number(DEFAULT_CHAIN_ID)
    return `https://raw.githubusercontent.com/Amet-Finance/public-meta/${lastCommit}/${chain}/${contractAddress.toLowerCase()}/logo.svg`
}

export  {
    getIcon
}