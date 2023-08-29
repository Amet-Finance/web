type Account = {
    address: string,
    balance: { [key: string]: any[] }
}

type ConnectPayload = {
    address: string
}

export type {
    Account,
    ConnectPayload
}