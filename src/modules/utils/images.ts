
function getIcon(chainId: number|undefined, contractAddress: string) {
    const lastCommit = "c125b8b9f5c108c475714c7c476ce8481a77f8e4"
    return `https://raw.githubusercontent.com/Amet-Finance/public-meta/${lastCommit}/${chainId}/${contractAddress.toLowerCase()}/logo.svg`
}

export {
    getIcon
}
