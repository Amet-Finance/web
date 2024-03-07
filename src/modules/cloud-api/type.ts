type TokenResponse = {
    _id: string, //0x13a8398fdf48055209186b93920d50eca5703bf0_80001
    contractAddress: string,
    chainId: number,
    name: string,
    symbol: string,
    decimals: number,
    isVerified: boolean,
    icon?: string,
    unidentified?: boolean,
}

type TokensResponse = {
    [contractLowerCased: string]: TokenResponse
}

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

export type  {
    TokenResponse,
    TokensResponse,
    GeneralStatistics,
    StatisticsTypes,
    TBVStatistics,
    GeneralStatsKey,
    TBVStatsKey
}
