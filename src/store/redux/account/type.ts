type Account = {
    connection: {
        type: string
    },
    address: string,
    chainId: string,
    balance: { [key: string]: any[] }
}

export type {
    Account
}