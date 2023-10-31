import {getBalance} from "@/modules/cloud-api/index";

type BondsAPIParams = {
    skip: number;
    limit: number;
    chainId?: string
}

type StatsAPIParams = {
    chainId: string
}

type BalanceAPIParams = {
    address: string;
    chainId: string
}

export type  {
    BondsAPIParams,
    StatsAPIParams,
    BalanceAPIParams
}
