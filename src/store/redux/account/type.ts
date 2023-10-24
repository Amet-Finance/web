type Account = {
    connection: {
        type: string
    },
    address: string,
    chainId: string,
    balance: { [contractAddress: string]: any[] } // tokenId[]
}

export type {
    Account
}
