type BondsAPIParams = {
    skip: number;
    limit: number;
    chainId: number;
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
