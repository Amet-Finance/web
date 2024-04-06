import {StringKeyedObject} from "@/components/utils/general";

type TokenCore = {
    contractAddress: string,
    chainId: number,
    name: string,
    symbol: string,
    decimals: number
}

type TokenResponse = TokenCore & {
    isVerified?: boolean,
    priceUsd?: number,
    icon?: string,
    unidentified?: boolean,
}

// contractAddress_chainId => ContractBalance
type TokensResponse = StringKeyedObject<TokenResponse>

type GeneralStatsKey = "general-stats"
type TBVStatsKey = "tbv-daily-stats"

type StatisticsTypes = GeneralStatsKey | TBVStatsKey

type GeneralStatistics = {
    _id: GeneralStatsKey,
    issued: number,
    purchased: number,
    redeemed: number,
    activeUsers: number,
    maxReturn: number,
    realisedGains: number,
    volume: number
}

type TBVStatistics = {
    _id: TBVStatsKey,
    values: [number, number][]
}

// contractAddress => ContractBalance
type Balances = StringKeyedObject<ContractBalance[]>

type ContractBalance = {
    balance: number,
    purchaseBlock: number,
    tokenId: number
}

export type  {
    TokenCore,
    TokenResponse,
    TokensResponse,
    GeneralStatistics,
    StatisticsTypes,
    TBVStatistics,
    GeneralStatsKey,
    TBVStatsKey,
    Balances,
    ContractBalance
}
