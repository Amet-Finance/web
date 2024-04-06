import {StringKeyedObject} from "@/components/utils/general";

type TokenResponse = {
    contractAddress: string,
    chainId: number,
    name: string,
    symbol: string,
    decimals: number,
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
