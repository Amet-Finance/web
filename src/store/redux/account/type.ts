import {Balances} from "@/modules/api/type";

type AccountState = {
    _id: string,
    balances: Balances,
    xp?: 0,
    code?: string
    active?: boolean
    twitter?: {
        id: string,
        username: string
    }
    discord?: {
        id: string,
        username: string
    }
}

export type {
    AccountState
}
