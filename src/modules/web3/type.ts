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
    interestTokenBalance: string,
    feePercentage: number,
    issuanceDate: number
}

type TokenInfo = {
    name?: string,
    symbol?: string,
    decimals?: number,
    verified?: boolean,
    unidentified?: boolean,
    icon?: string,
    balance?: number,
    balanceClean?: string,
    isLoading?: boolean
}

export type {
    BondInfoDetailed,
    TokenInfo
}