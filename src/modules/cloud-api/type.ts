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

export type  {
    BondsAPIParams,
    StatsAPIParams,
    BalanceAPIParams
}
