import {StringKeyedObject} from "@/components/utils/types";

type SuccessResult = {
    success: true
}

type FailedResult = {
    success: false
}


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

type AuthenticatedRequest = {
    address: string | `0x${string}`,
    signature: string,
    message: string
}

type User = {
    xp: number
}

export type  {
    User,
    TokenCore,
    TokenResponse,
    TokensResponse,
    GeneralStatistics,
    StatisticsTypes,
    TBVStatistics,
    GeneralStatsKey,
    TBVStatsKey,
    Balances,
    ContractBalance,
    AuthenticatedRequest,
    SuccessResult,
    FailedResult
}
