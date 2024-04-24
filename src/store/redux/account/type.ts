import {Balances} from "@/modules/api/type";

type AccountState = {
    _id: string,
    balances: Balances,
    xp?: 0,
    code?: string
    active?: boolean
    twitter?: string
    discord?: string
}

export type {
    AccountState
}
