type BondsAPIParams = {
    skip: number;
    limit: number;
    chainId: number;
    issuer?: string;
    _id?: string[];
}

type StatsAPIParams = {
    chainId: number;
}

type BalanceAPIParams = {
    address: string;
    chainId: number;
}

type TokenResponse = {
    _id: string,
    name: string,
    symbol: string,
    decimals: number,
    isVerified: boolean,
    icon?: string
}

type TokensResponse = {
    [contractLowerCased: string]: TokenResponse
}

export type  {
    BondsAPIParams,
    StatsAPIParams,
    BalanceAPIParams,
    TokenResponse,
    TokensResponse
}
