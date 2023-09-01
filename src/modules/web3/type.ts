type BondInfoDetailed = {
    _id: string,
    issuer: string,
    total: number,
    purchased: number,
    redeemed: number,
    redeemLockPeriod: number,
    investmentToken: string,
    investmentTokenAmount: string,
    interestToken: string,
    interestTokenAmount: number,
    interestTokenBalance: string
}

type TokenInfo = {
    name?: string,
    symbol?: string,
    decimals?: number,
    verified?: boolean,
    icon?: string,
    balance?: number,
    isLoading?: boolean
}

export type {
    BondInfoDetailed,
    TokenInfo
}