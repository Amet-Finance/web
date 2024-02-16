type BondsAPIParams = {
    skip: number;
    limit: number;
    chainId: number;
    issuer?: string;
    _id?: string[];
    isTrending?: boolean;
}

type BondDetailedAPIParams = {
    chainId: number,
    _id: string
}

type StatsAPIParams = {
    chainId: number;
}

type BalanceAPIParams = {
    address: string;
    chainId: number;
}

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

type TokenBalance = {
    balance: string,
    balanceClean: number,
    decimals: number
}

type BondInfoDetailed = {
    _id: string,
    chainId: number,
    issuer: string,
    total: number,
    purchased: number,
    redeemed: number,
    redeemLockPeriod: number,

    investmentToken: string,
    investmentTokenAmount: string,
    investmentTokenInfo: TokenResponse,

    interestToken: string,
    interestTokenAmount: string,
    interestTokenInfo: TokenResponse

    interestTokenBalance?: TokenBalance,
    feePercentage: number,
    issuanceDate: number,
    issuanceBlock: number
}


type Description = {
    name: string,
    description: string,
    external_url: string,
    image: string,
    details?: {
        title: string,
        description: string
    }
}

type SecurityDetails = {
    securedPercentage: number,
    issuerScore: number,
    bondScore: number,
    uniqueHolders: number,
    uniqueHoldersIndex: number
}

type DetailedBondResponse = {
    description: Description,
    contractInfo: BondInfoDetailed,
    securityDetails: SecurityDetails,
    lastUpdated: number
}


export type  {
    BondsAPIParams,
    StatsAPIParams,
    BalanceAPIParams,
    TokenResponse,
    TokensResponse,
    BondDetailedAPIParams,
    DetailedBondResponse,
    SecurityDetails
}
