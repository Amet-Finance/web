import {Balances} from "@/modules/api/type";

type AccountState = {
    _id: string,
    balances: Balances,
    lastUpdated?: Date,
    xp?: 0,
    code?: string
    active?: boolean
    twitter?: {
        id: string,
        username: string
    }
    discord?: {
        id: string,
        username: string,
        ametConnected?: boolean
        huntConnected?: boolean
    }
    email?: string
}

export type {
    AccountState
}
