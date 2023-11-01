type Account = {
    balance: {
        [chainId: number]: {
            [contractAddress: string]: any[] // tokenId[]
        }
    }
}

export type {
    Account
}
